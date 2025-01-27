use crate::tui::core::Renderable;
use crate::tui::Theme;
use crate::tui::widgets::{DashboardCharts, TimelineSidebar};
use crate::substance::route_of_administration::phase::PhaseClassification;
use chrono::Local;
use miette::Result;
use ratatui::layout::*;
use ratatui::prelude::*;
use ratatui::widgets::*;
use ratatui::Frame;

#[doc = include_str!("./home.md")]
pub struct Home<'a> {
    active_ingestions: &'a [(crate::ingestion::model::Ingestion, Option<crate::analyzer::model::IngestionAnalysis>)],
}

impl<'a> Home<'a> {
    pub fn new(active_ingestions: &'a [(crate::ingestion::model::Ingestion, Option<crate::analyzer::model::IngestionAnalysis>)]) -> Self {
        Self {
            active_ingestions,
        }
    }
}

impl<'a> Renderable for Home<'a> {
    fn render(&self, area: Rect, frame: &mut Frame) -> miette::Result<()> {
        let main_chunks = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Length(3),
                Constraint::Min(10),
            ])
            .margin(1)
            .split(area);

        let stats_block = Block::default()
            .title("Overview")
            .borders(Borders::ALL)
            .border_type(BorderType::Rounded)
            .style(Style::default().bg(Theme::SURFACE0));
        
        let stats_inner = stats_block.inner(main_chunks[0]);
        frame.render_widget(stats_block, main_chunks[0]);
        self.render_stats_bar(frame, stats_inner);

        let content_chunks = Layout::default()
            .direction(Direction::Horizontal)
            .constraints([
                Constraint::Percentage(70),
                Constraint::Percentage(30),
            ])
            .spacing(1)
            .split(main_chunks[1]);

        self.render_dashboard(frame, content_chunks[0])?;
        self.render_timeline_sidebar(frame, content_chunks[1])?;

        Ok(())
    }
}

impl<'a> Home<'a> {
    fn render_stats_bar(&self, frame: &mut Frame, area: Rect) {
        let stats = Layout::default()
            .direction(Direction::Horizontal)
            .constraints([
                Constraint::Percentage(20),  // Active count
                Constraint::Percentage(20),  // Unique substances
                Constraint::Percentage(20),  // Total dosages
                Constraint::Percentage(20),  // Next phase change
                Constraint::Percentage(20),  // Declining substances
            ])
            .split(area);

        let active_count = self.active_ingestions.len();
        let unique_substances = self.active_ingestions.iter()
            .map(|(i, _)| &i.substance)
            .collect::<std::collections::HashSet<_>>()
            .len();
        
        let total_dosages: f64 = self.active_ingestions.iter()
            .map(|(i, _)| i.dosage.as_base_units())
            .sum();
            
        let declining_count = self.active_ingestions.iter()
            .filter(|(_, a)| {
                a.as_ref().map_or(false, |analysis| {
                    analysis.current_phase == Some(PhaseClassification::Comedown)
                })
            })
            .count();
            
        // Find next phase change
        let next_phase_change = self.active_ingestions.iter()
            .filter_map(|(_, a)| a.as_ref())
            .filter_map(|analysis| {
                analysis.phases.iter()
                    .find(|phase| {
                        let now = Local::now();
                        phase.duration_range.end > now
                    })
                    .map(|phase| phase.duration_range.end)
            })
            .min()
            .map_or("None".to_string(), |time| {
                let duration = time - Local::now();
                format!("{}m", duration.num_minutes())
            });

        let stats_style = Style::default().fg(Theme::TEXT);
        let value_style = Style::default().fg(Theme::MAUVE).add_modifier(Modifier::BOLD);

        // Render all stats
        frame.render_widget(
            Paragraph::new(Line::from(vec![
                Span::styled("Active: ", stats_style),
                Span::styled(active_count.to_string(), value_style),
            ])).alignment(Alignment::Center),
            stats[0]
        );

        frame.render_widget(
            Paragraph::new(Line::from(vec![
                Span::styled("Unique: ", stats_style),
                Span::styled(unique_substances.to_string(), value_style),
            ])).alignment(Alignment::Center),
            stats[1]
        );

        frame.render_widget(
            Paragraph::new(Line::from(vec![
                Span::styled("Total: ", stats_style),
                Span::styled(format!("{:.1}mg", total_dosages), value_style),
            ])).alignment(Alignment::Center),
            stats[2]
        );

        frame.render_widget(
            Paragraph::new(Line::from(vec![
                Span::styled("Next: ", stats_style),
                Span::styled(next_phase_change, value_style),
            ])).alignment(Alignment::Center),
            stats[3]
        );

        frame.render_widget(
            Paragraph::new(Line::from(vec![
                Span::styled("Declining: ", stats_style),
                Span::styled(declining_count.to_string(), value_style),
            ])).alignment(Alignment::Center),
            stats[4]
        );
    }

    fn render_dashboard(&self, frame: &mut Frame, area: Rect) -> miette::Result<()> {
        let block = Block::default()
            .title("Dashboard")
            .borders(Borders::ALL)
            .border_type(BorderType::Rounded)
            .style(Style::default().bg(Theme::SURFACE0));

        let inner = block.inner(area);
        frame.render_widget(block, area);

        let mut charts = DashboardCharts::new();
        charts.update(self.active_ingestions.to_vec());
        charts.render(inner, frame)?;

        Ok(())
    }

    fn render_timeline_sidebar(&self, frame: &mut Frame, area: Rect) -> miette::Result<()> {
        let mut timeline = TimelineSidebar::new();
        timeline.update(self.active_ingestions.to_vec());
        timeline.render(area, frame)?;

        Ok(())
    }
}