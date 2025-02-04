use ratatui::{
    layout::Alignment,
    style::{Color, Style},
    text::{Line, Span},
    widgets::{Block, Borders, Paragraph},
};
use crate::cli::stats::PeriodStatistics;
use crate::substance::route_of_administration::dosage::Dosage;

/// VisualStats renders text-based sparklines/bar charts using available PeriodStatistics data.
pub struct VisualStats {
    pub stats: Vec<PeriodStatistics>,
}

impl VisualStats {
    pub fn new(stats: Vec<PeriodStatistics>) -> Self {
        Self { stats }
    }

    /// Update the data (so it can be called periodically to reflect real-time stats)
    pub fn update(&mut self, stats: Vec<PeriodStatistics>) {
        self.stats = stats;
    }

    /// Generate a horizontal bar (sparkline) of fixed width based on value and max.
    /// Uses the full block character.
    fn generate_bar(&self, value: f64, max: f64, width: usize) -> String {
        let ratio = if max > 0.0 { value / max } else { 0.0 };
        let full_blocks = (ratio * width as f64).round() as usize;
        let bar = "█".repeat(full_blocks) + &" ".repeat(width - full_blocks);
        bar
    }

    /// Render the component as a Paragraph widget with one line per substance.
    pub fn render(&self) -> Paragraph {
        // Use the daily_dosage to compute and normalize the bars
        let max_daily = self.stats.iter()
            .map(|s| s.daily_dosage.to_string().parse::<f64>().unwrap_or(0.0))
            .fold(0.0_f64, |a: f64, b| a.max(b));

        let mut lines = Vec::new();
        for stat in &self.stats {
            let daily_value = stat.daily_dosage.to_string().parse::<f64>().unwrap_or(0.0);
            let bar = self.generate_bar(daily_value, max_daily, 20);
            let line = Line::from(vec![
                Span::styled(&stat.substance_name, Style::default().fg(Color::Cyan)),
                Span::raw(" "),
                Span::raw(bar),
                Span::raw(format!(" {}", stat.daily_dosage)),
            ]);
            lines.push(line);
        }
        Paragraph::new(lines)
            .block(Block::default().borders(Borders::ALL).title("Consumption Trends"))
            .alignment(Alignment::Left)
    }
}
