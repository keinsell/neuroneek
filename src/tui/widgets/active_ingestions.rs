use crate::analyzer::model::IngestionAnalysis;
use crate::tui::core::Renderable;
use crate::tui::theme::Theme;
use ratatui::prelude::*;
use ratatui::widgets::{Block, BorderType, Borders, Gauge, List, ListItem, TableState};

pub struct ActiveIngestionPanel {
    pub ingestions: Vec<IngestionAnalysis>,
    pub state: TableState,
}

impl ActiveIngestionPanel {
    pub fn new() -> Self {
        Self {
            ingestions: Vec::new(),
            state: TableState::default(),
        }
    }

    pub fn update(&mut self, ingestions: Vec<IngestionAnalysis>) {
        self.ingestions = ingestions;
        if self.state.selected().is_none() && !self.ingestions.is_empty() {
            self.state.select(Some(0));
        }
    }
}

impl Renderable for ActiveIngestionPanel {
    fn render(&self, area: Rect, frame: &mut Frame) -> miette::Result<()> {
        let block = Block::default()
            .title("Active Ingestions")
            .borders(Borders::ALL)
            .border_type(BorderType::Rounded)
            .style(Style::default().bg(Theme::SURFACE0));

        let inner_area = block.inner(area);
        frame.render_widget(block, area);

        if self.ingestions.is_empty() {
            frame.render_widget(
                List::new(vec![ListItem::new("No active ingestions")])
                    .style(Style::default().fg(Theme::TEXT)),
                inner_area,
            );
            return Ok(());
        }

        let chunks = Layout::default()
            .direction(Direction::Vertical)
            .constraints(
                self.ingestions
                    .iter()
                    .map(|_| Constraint::Length(3))
                    .collect::<Vec<_>>(),
            )
            .split(inner_area);

        for (analysis, chunk) in self.ingestions.iter().zip(chunks.iter()) {
            let substance_name = analysis
                .substance
                .as_ref()
                .map(|s| s.name.as_str())
                .unwrap_or("Unknown");

            let phase_text = analysis
                .current_phase
                .map(|p| format!("Phase: {}", p))
                .unwrap_or_else(|| "No phase".to_string());

            let progress = analysis.progress();
            let progress_text = format!("{:.1}%", progress * 100.0);

            let title = format!("{} - {}", substance_name, phase_text);
            let gauge = Gauge::default()
                .block(Block::default().title(title))
                .gauge_style(Style::default().fg(Theme::GREEN))
                .label(progress_text)
                .ratio(progress);

            frame.render_widget(gauge, *chunk);
        }

        Ok(())
    }
}