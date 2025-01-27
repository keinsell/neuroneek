use crate::analyzer::model::IngestionAnalysis;
use crate::ingestion::model::Ingestion;
use crate::substance::route_of_administration::phase::PhaseClassification;
use crate::tui::core::Renderable;
use crate::tui::theme::Theme;
use chrono::DateTime;
use chrono::Duration;
use chrono::Local;
use chrono::Timelike;
use ratatui::Frame;
use ratatui::layout::Constraint;
use ratatui::layout::Direction;
use ratatui::layout::Layout;
use ratatui::layout::Rect;
use ratatui::prelude::*;
use ratatui::style::Modifier;
use ratatui::style::Style;
use ratatui::symbols;
use ratatui::text::Line;
use ratatui::text::Span;
use ratatui::widgets::Block;
use ratatui::widgets::BorderType;
use ratatui::widgets::Borders;
use ratatui::widgets::Chart;
use ratatui::widgets::Dataset;
use ratatui::widgets::GraphType;
use ratatui::widgets::Paragraph;
use ratatui::widgets::Sparkline;
use std::collections::HashMap;

pub struct DashboardCharts
{
    active_ingestions: Vec<IngestionAnalysis>,
    effect_datasets: Vec<(PhaseClassification, Vec<(f64, f64)>)>,
    combined_effects: Vec<(f64, f64)>,
    time_marker: Vec<(f64, f64)>,
}

impl DashboardCharts
{
    pub fn new() -> Self
    {
        Self {
            active_ingestions: Vec::new(),
            effect_datasets: Vec::new(),
            combined_effects: Vec::new(),
            time_marker: Vec::new(),
        }
    }

    pub fn set_active_ingestions(&mut self, ingestions: Vec<IngestionAnalysis>)
    {
        self.active_ingestions = ingestions;
    }


    fn generate_phase_points(&self, range: &std::ops::Range<f64>, intensity: f64)
    -> Vec<(f64, f64)>
    {
        let points_count = ((range.end - range.start) * 12.0).ceil() as usize;
        (0..=points_count)
            .map(|i| {
                let progress = i as f64 / points_count as f64;
                let hour = range.start + (range.end - range.start) * progress;

                let transition_intensity = if progress < 0.2
                {
                    intensity * (progress / 0.2)
                }
                else if progress > 0.8
                {
                    intensity * ((1.0 - progress) / 0.2)
                }
                else
                {
                    intensity
                };

                (hour, transition_intensity)
            })
            .collect()
    }

    fn calculate_hourly_intensity(&self) -> Vec<u64>
    {
        let now = Local::now();
        let start_hour = now - Duration::hours(24);
        let mut hourly_data = vec![0; 24];

        for analysis in &self.active_ingestions
        {
            let start = analysis.ingestion_start.max(start_hour);
            let end = analysis.ingestion_end.min(now);

            if start < end
            {
                let mut current = start;
                while current < end
                {
                    let hour_idx = 23 - (now - current).num_hours() as usize;
                    if hour_idx < 24
                    {
                        hourly_data[hour_idx] += 1;
                    }
                    current = current + Duration::hours(1);
                }
            }
        }

        hourly_data
    }

    pub fn update(&mut self, ingestions: Vec<(Ingestion, Option<IngestionAnalysis>)>)
    {
        self.active_ingestions = ingestions
            .into_iter()
            .filter_map(|(_, analysis)| analysis)
            .collect();
        self.calculate_effects();
        self.calculate_timeline();
    }

    fn calculate_effects(&mut self)
    {
        let now = Local::now();
        let day_start = now.date_naive().and_hms_opt(0, 0, 0).unwrap();

        self.effect_datasets.clear();
        let mut combined = vec![0.0; 24];

        // Calculate individual effects
        for analysis in &self.active_ingestions
        {
            let effect_data: Vec<(f64, f64)> = (0..24)
                .map(|hour| {
                    let time = day_start + chrono::Duration::hours(hour);
                    let intensity = if time >= analysis.ingestion_start.naive_local()
                        && time <= analysis.ingestion_end.naive_local()
                    {
                        let phase_intensity = match analysis.current_phase
                        {
                            | Some(PhaseClassification::Peak) => 1.0,
                            | Some(PhaseClassification::Comeup) => 0.7,
                            | Some(PhaseClassification::Comedown) => 0.4,
                            | Some(PhaseClassification::Afterglow) => 0.2,
                            | Some(PhaseClassification::Onset) => 0.3,
                            | _ => 0.0,
                        };
                        combined[hour as usize] += phase_intensity;
                        phase_intensity
                    }
                    else
                    {
                        0.0
                    };
                    (hour as f64, intensity)
                })
                .collect();
            let phase_data = (
                analysis.current_phase.unwrap_or(PhaseClassification::Onset),
                effect_data,
            );
            self.effect_datasets.push(phase_data);
        }

        // Store combined effects
        self.combined_effects = combined
            .iter()
            .enumerate()
            .map(|(hour, &intensity)| (hour as f64, intensity))
            .collect();

        // Update time marker
        let current_hour = now.hour() as f64;
        self.time_marker = vec![
            (current_hour, 0.0),
            (current_hour, combined[now.hour() as usize]),
        ];
    }

    fn calculate_timeline(&mut self)
    {
        let mut phase_data = Vec::new();

        // Collect all phases from all ingestions
        for analysis in &self.active_ingestions
        {
            for phase in &analysis.phases
            {
                let start_hour = phase.duration_range.start.hour() as f64
                    + phase.duration_range.start.minute() as f64 / 60.0;
                let end_hour = phase.duration_range.end.hour() as f64
                    + phase.duration_range.end.minute() as f64 / 60.0;

                // Store phase data with substance name for better visualization
                phase_data.push((
                    start_hour..end_hour,
                    phase.class,
                    analysis
                        .substance
                        .as_ref()
                        .map(|s| s.name.clone())
                        .unwrap_or_else(|| "Unknown".to_string()),
                ));
            }
        }

        // Generate datasets for each phase type
        self.effect_datasets = vec![
            (PhaseClassification::Onset, 0.3),
            (PhaseClassification::Comeup, 0.7),
            (PhaseClassification::Peak, 1.0),
            (PhaseClassification::Comedown, 0.4),
            (PhaseClassification::Afterglow, 0.2),
        ]
        .into_iter()
        .map(|(phase_type, base_intensity)| {
            let phase_points: Vec<(f64, f64)> = phase_data
                .iter()
                .filter(|(_, phase, _)| *phase == phase_type)
                .flat_map(|(range, _, _substance)| {
                    self.generate_phase_points(range, base_intensity)
                        .into_iter()
                        .map(|(hour, intensity)| (hour, intensity))
                        .collect::<Vec<_>>()
                })
                .collect();

            (phase_type, phase_points)
        })
        .collect();

        // Calculate combined effects
        let mut combined = vec![0.0; 24 * 12]; // Higher resolution for smoother curves
        for (range, phase, _) in &phase_data
        {
            let intensity = match phase
            {
                | PhaseClassification::Peak => 1.0,
                | PhaseClassification::Comeup => 0.7,
                | PhaseClassification::Comedown => 0.4,
                | PhaseClassification::Afterglow => 0.2,
                | PhaseClassification::Onset => 0.3,
                | _ => 0.0,
            };

            let start_idx = (range.start * 12.0) as usize;
            let end_idx = (range.end * 12.0) as usize;
            for idx in start_idx..=end_idx.min(combined.len() - 1)
            {
                let progress = (idx as f64 - start_idx as f64) / (end_idx - start_idx) as f64;
                let effect = if progress < 0.2
                {
                    intensity * (progress / 0.2)
                }
                else if progress > 0.8
                {
                    intensity * ((1.0 - progress) / 0.2)
                }
                else
                {
                    intensity
                };
                combined[idx] += effect;
            }
        }

        // Convert combined effects to data points
        self.combined_effects = combined
            .iter()
            .enumerate()
            .map(|(i, &intensity)| {
                let hour = i as f64 / 12.0;
                (hour, intensity)
            })
            .collect();

        // Update current time marker
        let current_hour = Local::now().hour() as f64 + Local::now().minute() as f64 / 60.0;
        let current_idx = (current_hour * 12.0) as usize;
        self.time_marker = vec![
            (current_hour, 0.0),
            (
                current_hour,
                combined.get(current_idx).copied().unwrap_or(0.0),
            ),
        ];
    }
}

impl Renderable for DashboardCharts
{
    fn render(&self, area: Rect, frame: &mut Frame) -> miette::Result<()>
    {
        let chunks = Layout::default()
            .direction(Direction::Vertical)
            .constraints([Constraint::Percentage(50), Constraint::Percentage(50)])
            .split(area);

        // Render intensity timeline
        let intensity_block = Block::default()
            .title("24h Intensity Timeline")
            .borders(Borders::ALL)
            .border_type(BorderType::Rounded)
            .style(Style::default().bg(Theme::SURFACE0));

        let intensity_area = intensity_block.inner(chunks[0]);
        frame.render_widget(intensity_block, chunks[0]);

        let intensity_data = self.calculate_hourly_intensity();
        let sparkline = Sparkline::default()
            .block(Block::default())
            .style(Style::default().fg(Theme::GREEN))
            .data(&intensity_data);

        frame.render_widget(sparkline, intensity_area);

        // Render statistics
        let stats_block = Block::default()
            .title("Statistics")
            .borders(Borders::ALL)
            .border_type(BorderType::Rounded)
            .style(Style::default().bg(Theme::SURFACE0));

        let stats_area = stats_block.inner(chunks[1]);
        frame.render_widget(stats_block, chunks[1]);

        let active_count = self.active_ingestions.len();
        let stats_text = vec![Line::from(vec![
            Span::raw("Active Ingestions: "),
            Span::styled(active_count.to_string(), Style::default().fg(Theme::GREEN)),
        ])];

        frame.render_widget(
            Paragraph::new(stats_text).alignment(Alignment::Left),
            stats_area,
        );

        Ok(())
    }
}
