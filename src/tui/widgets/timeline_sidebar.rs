use crate::analyzer::model::IngestionAnalysis;
use crate::ingestion::model::Ingestion;
use crate::tui::core::Renderable;
use crate::tui::theme::Theme;
use chrono::{DateTime, Duration, Local, Timelike};
use ratatui::prelude::*;
use ratatui::widgets::{Block, BorderType, Borders, List, ListItem, Padding, Paragraph};
use std::collections::{BTreeMap, HashSet};

pub struct TimelineSidebar {
    ingestions: BTreeMap<DateTime<Local>, Vec<(Ingestion, Option<IngestionAnalysis>)>>,
}

impl TimelineSidebar {
    pub fn new() -> Self {
        Self {
            ingestions: BTreeMap::new(),
        }
    }

    pub fn update(&mut self, ingestions: Vec<(Ingestion, Option<IngestionAnalysis>)>) {
        self.ingestions.clear();
        
        let now = Local::now();
        let window_start = (now - Duration::hours(12)).with_minute(0).unwrap();
        let window_end = (now + Duration::hours(12)).with_minute(0).unwrap();

        for (ingestion, analysis) in ingestions {
            if let Some(analysis) = analysis {
                // Calculate first and last relevant hours
                let mut current_hour = analysis.ingestion_start
                    .max(window_start)
                    .with_minute(0)
                    .unwrap();
                
                let end_hour = analysis.ingestion_end
                    .min(window_end)
                    .with_minute(0)
                    .unwrap();

                // Add to all hours between start and end
                while current_hour <= end_hour {
                    self.ingestions
                        .entry(current_hour)
                        .or_default()
                        .push((ingestion.clone(), Some(analysis.clone())));
                    
                    current_hour += Duration::hours(1);
                }
            }
        }
    }

    fn render_timeline_entry(
        &self,
        time: DateTime<Local>,
        ingestions: &[(Ingestion, Option<IngestionAnalysis>)],
    ) -> Option<Vec<ListItem<'static>>> {
        // If no ingestions and not the current hour, return None to collapse
        let now = Local::now();
        let is_current = time.hour() == now.hour() && time.date_naive() == now.date_naive();
        
        if ingestions.is_empty() && !is_current {
            return None;
        }

        let mut items = Vec::new();
        let is_past = time < now;

        // Hour marker with distinct symbols
        let (hour_marker, marker_style) = match (is_current, is_past) {
            (true, _) => ("➤", Style::default().fg(Theme::YELLOW).add_modifier(Modifier::BOLD)),
            (false, true) => ("•", Style::default().fg(Theme::TEXT)),
            (false, false) => ("○", Style::default().fg(Theme::MAUVE)),
        };

        // Format the hour label
        let hour_label = format!("{:02}:00", time.hour());

        // Add the hour marker and label
        items.push(ListItem::new(Line::from(vec![
            Span::styled(hour_marker, marker_style),
            Span::raw(" "),
            Span::styled(hour_label, Style::default().add_modifier(Modifier::BOLD)),
        ])));

        // Deduplicate substances to handle multi-block ingestions
        let unique_substances: HashSet<_> = ingestions
            .iter()
            .map(|(ingestion, _)| ingestion.substance.clone())
            .collect();

        // Add ingestions under the hour
        if !ingestions.is_empty() {
            for substance in unique_substances {
                // Find all ingestions for this substance
                let substance_ingestions: Vec<_> = ingestions
                    .iter()
                    .filter(|(ingestion, _)| ingestion.substance == substance)
                    .collect();

                // Aggregate dosages and phases
                let total_dosage: f64 = substance_ingestions
                    .iter()
                    .map(|(ingestion, _)| ingestion.dosage.as_base_units())
                    .sum();
                
                let phases: Vec<_> = substance_ingestions
                    .iter()
                    .filter_map(|(_, analysis)| {
                        analysis.as_ref().and_then(|a| {
                            // Show phase if current hour is within phase duration
                            let hour_start = time;
                            let hour_end = time + Duration::hours(1);
                            a.phases.iter().find(|phase| 
                                phase.duration_range.start < hour_end &&
                                phase.duration_range.end > hour_start
                            ).map(|p| p.class)
                        })
                    })
                    .collect();

                // Determine style based on time
                let ingestion_style = if is_past {
                    Style::default().fg(Theme::GREEN)
                } else {
                    Style::default().fg(Theme::BLUE)
                };

                // Combine unique phases
                let phase_text = if !phases.is_empty() {
                    format!(" ({})", phases.iter().map(|p| p.to_string()).collect::<HashSet<_>>().into_iter().collect::<Vec<_>>().join(", "))
                } else {
                    String::new()
                };

                items.push(ListItem::new(Line::from(vec![
                    Span::raw("    "), // Indentation for sub-items
                    Span::styled("• ", Style::default().fg(Theme::TEXT)),
                    Span::styled(substance, ingestion_style),
                    Span::raw(" - "),
                    Span::styled(format!("{:.1}mg", total_dosage), Style::default().fg(Theme::TEXT)),
                    Span::styled(phase_text, Style::default().fg(Theme::MAUVE)),
                ])));
            }
        } else {
            // Indicate no ingestions for this hour
            items.push(ListItem::new(Line::from(vec![
                Span::raw("    "),
                Span::styled("No ingestions", Style::default().fg(Theme::OVERLAY0)),
            ])));
        }

        Some(items)
    }
}

impl Renderable for TimelineSidebar {
    fn render(&self, area: Rect, frame: &mut Frame) -> miette::Result<()> {
        let block = Block::default()
            .title("Timeline")
            .borders(Borders::ALL)
            .border_type(BorderType::Rounded)
            .style(Style::default().bg(Theme::SURFACE0))
            .padding(Padding::new(1, 1, 1, 1));

        let inner_area = block.inner(area);
        frame.render_widget(block, area);

        if self.ingestions.is_empty() {
            frame.render_widget(
                Paragraph::new("No ingestions in the timeline window.")
                    .style(Style::default().fg(Theme::TEXT))
                    .alignment(Alignment::Center),
                inner_area,
            );
            return Ok(());
        }

        let mut items = Vec::new();

        let now = Local::now();
        let window_start = now - Duration::hours(12);
        let window_end = now + Duration::hours(12);
        let mut current = window_start;

        while current <= window_end {
            if let Some(ingestions) = self.ingestions.get(&current) {
                if let Some(hour_items) = self.render_timeline_entry(current, ingestions) {
                    items.extend(hour_items);
                }
            } else {
                // Show current hour even if no ingestions
                if let Some(hour_items) = self.render_timeline_entry(current, &[]) {
                    items.extend(hour_items);
                }
            }
            current = current + Duration::hours(1);
        }

        frame.render_widget(
            List::new(items)
                .block(Block::default())
                .style(Style::default().fg(Theme::TEXT))
                .highlight_style(Style::default().add_modifier(Modifier::BOLD)),
            inner_area,
        );

        Ok(())
    }
} 