use crate::analyzer::model::IngestionAnalysis;
use crate::ingestion::model::Ingestion;
use crate::tui::theme::Theme;
use chrono::{DateTime, Local};
use ratatui::{
	layout::{Constraint, Direction, Layout, Rect},
	style::{Modifier, Style},
	text::{Line, Span},
	widgets::{Block, Borders, Cell, Paragraph, Row, Table},
	Frame,
};

pub struct JournalSummary {
	ingestions: Vec<(Ingestion, Option<IngestionAnalysis>)>,
}

impl JournalSummary {

	pub fn render(&self, frame: &mut Frame, area: Rect) {
		let chunks = Layout::default()
			.direction(Direction::Vertical)
			.constraints([
				Constraint::Length(3),  // Title
				Constraint::Length(6),  // Today's summary
				Constraint::Min(10),    // Timeline chart
			])
			.split(area);

		// Render title
		let title = Paragraph::new("Journal Summary")
			.style(Style::default().fg(Theme::MAUVE).add_modifier(Modifier::BOLD))
			.alignment(ratatui::layout::Alignment::Center);
		frame.render_widget(title, chunks[0]);

		// Render today's summary
		self.render_summary(frame, chunks[1]);

		// Render timeline chart
		self.render_timeline(frame, chunks[2]);
	}

	fn render_summary(&self, frame: &mut Frame, area: Rect) {
		let today = Local::now().date_naive();
		let today_ingestions: Vec<_> = self.ingestions
			.iter()
			.filter(|(i, _)| i.ingestion_date.date_naive() == today)
			.collect();

		let active_count = today_ingestions
			.iter()
			.filter(|(_, a)| {
				a.as_ref().is_some_and(|analysis| {
					let now = Local::now();
					now >= analysis.ingestion_start && now <= analysis.ingestion_end
				})
			})
			.count();

		let summary_text = vec![
			Line::from(vec![
				Span::styled("Today's Ingestions: ", Style::default().fg(Theme::TEXT)),
				Span::styled(
					today_ingestions.len().to_string(),
					Style::default().fg(Theme::GREEN),
				),
			]),
			Line::from(vec![
				Span::styled("Currently Active: ", Style::default().fg(Theme::TEXT)),
				Span::styled(
					active_count.to_string(),
					Style::default().fg(Theme::YELLOW),
				),
			]),
		];

		let summary = Paragraph::new(summary_text)
			.block(Block::default().borders(Borders::ALL))
			.alignment(ratatui::layout::Alignment::Left);

		frame.render_widget(summary, area);
	}

	fn render_timeline(&self, frame: &mut Frame, area: Rect) {
		let today = Local::now().date_naive();
		let today_ingestions: Vec<_> = self.ingestions
			.iter()
			.filter(|(i, _)| i.ingestion_date.date_naive() == today)
			.collect();

		let timeline_block = Block::default()
			.borders(Borders::ALL)
			.title("Today's Timeline");

		let inner_area = timeline_block.inner(area);
		frame.render_widget(timeline_block, area);

		if today_ingestions.is_empty() {
			let empty_msg = Paragraph::new("No ingestions recorded today")
				.style(Style::default().fg(Theme::OVERLAY0))
				.alignment(ratatui::layout::Alignment::Center);
			frame.render_widget(empty_msg, inner_area);
			return;
		}

		let header = Row::new(vec!["Time", "Substance", "Status"])
			.style(Style::default().fg(Theme::TEXT));

		let rows: Vec<Row> = today_ingestions
			.iter()
			.map(|(ingestion, analysis)| {
				let time = ingestion.ingestion_date.format("%H:%M").to_string();
				let status = analysis.as_ref().map_or("Unknown", |a| {
					let now = Local::now();
					if now < a.ingestion_start {
						"Scheduled"
					} else if now > a.ingestion_end {
						"Completed"
					} else {
						"Active"
					}
				});

				let status_style = match status {
					"Active" => Style::default().fg(Theme::GREEN),
					"Completed" => Style::default().fg(Theme::OVERLAY0),
					"Scheduled" => Style::default().fg(Theme::BLUE),
					_ => Style::default().fg(Theme::TEXT),
				};

				Row::new(vec![
					Cell::from(time),
					Cell::from(ingestion.substance.clone()),
					Cell::from(status).style(status_style),
				])
			})
			.collect();

		let widths = &[
			Constraint::Length(8),
			Constraint::Percentage(60),
			Constraint::Percentage(20),
		];

		let table = Table::new(rows, widths)
			.header(header)
			.column_spacing(1);

		frame.render_widget(table, inner_area);
	}
}