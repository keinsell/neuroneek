use ratatui::{
    style::{Color, Style},
    layout::Constraint,
    widgets::{Block, Borders, Cell, Row, Table},
};
use crate::cli::stats::PeriodStatistics;

pub struct RollingStats {
    pub stats: Vec<PeriodStatistics>,
}

impl RollingStats {
    pub fn new(stats: Vec<PeriodStatistics>) -> Self {
        Self { stats }
    }

    pub fn update(&mut self, stats: Vec<PeriodStatistics>) {
        self.stats = stats;
    }

    pub fn render(&self) -> Table {
        let header_cells = ["Substance", "AVG", "SUM", "MIN", "MAX", "Count"]
            .iter()
            .map(|h| Cell::from(*h).style(Style::default().fg(Color::Yellow)))
            .collect::<Vec<_>>();
        let header = Row::new(header_cells)
            .height(1)
            .bottom_margin(1);
        let rows = self.stats.iter().map(|stat| {
            Row::new(vec![
                Cell::from(stat.substance_name.clone()),
                Cell::from(stat.daily_dosage.to_string()),
                Cell::from(stat.sum_dosage.to_string()),
                Cell::from(stat.min_dosage.to_string()),
                Cell::from(stat.max_dosage.to_string()),
                Cell::from(stat.count.to_string()),
            ])
        });

        let widths = &[
            Constraint::Percentage(20),
            Constraint::Percentage(15),
            Constraint::Percentage(15),
            Constraint::Percentage(15),
            Constraint::Percentage(15),
            Constraint::Percentage(20),
        ];

        Table::new(rows, widths)
            .header(header)
            .block(Block::default().borders(Borders::ALL).title("Rolling Statistics"))
    }
}
