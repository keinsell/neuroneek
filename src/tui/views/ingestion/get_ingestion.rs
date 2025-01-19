use crate::analyzer::model::IngestionAnalysis;
use crate::ingestion::model::Ingestion;
use crate::substance::Substance;
use crate::tui::theme::Theme;
use chrono::Local;
use miette::Result;
use ratatui::layout::Alignment;
use ratatui::layout::Constraint;
use ratatui::layout::Direction;
use ratatui::layout::Layout;
use ratatui::layout::Rect;
use ratatui::style::Modifier;
use ratatui::style::Style;
use ratatui::text::Line;
use ratatui::text::Span;
use ratatui::widgets::Block;
use ratatui::widgets::BorderType;
use ratatui::widgets::Borders;
use ratatui::widgets::Paragraph;
use ratatui::Frame;
use tracing::debug;

#[derive(Clone)]
pub struct IngestionViewState
{
    ingestion: Option<Ingestion>,
    analysis: Option<IngestionAnalysis>,
    substance: Option<Substance>,
}

impl IngestionViewState
{
    pub fn new() -> Self
    {
        debug!("Initializing new IngestionDetailsState");
        Self {
            ingestion: None,
            analysis: None,
            substance: None,
        }
    }

    pub async fn load_ingestion(&mut self, _id: String) -> Result<()> { Ok(()) }

    pub fn view(&self, frame: &mut Frame, area: Rect)
    {
        let border = Block::default()
            .title_alignment(Alignment::Left)
            .borders(Borders::ALL)
            .border_type(BorderType::Rounded)
            .style(Style::default().fg(Theme::BORDER));


        frame.render_widget(border.clone(), area);

        let inner_area = border.inner(area);

        let chunks = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Percentage(30),
                Constraint::Percentage(30),
                Constraint::Percentage(40),
            ])
            .split(inner_area);

        let wip_message = Paragraph::new(vec![
            Line::from(vec![Span::styled(
                "🚧 Work in Progress 🚧",
                Style::default()
                    .fg(Theme::YELLOW)
                    .add_modifier(Modifier::BOLD),
            )]),
            Line::from(vec![Span::styled(
                "Ingestion Details View is currently under development",
                Style::default().fg(Theme::SUBTEXT0),
            )]),
        ])
        .alignment(Alignment::Center)
        .block(
            Block::default()
                .title("Status")
                .borders(Borders::ALL)
                .border_type(BorderType::Rounded),
        );

        frame.render_widget(wip_message, chunks[0]);


        let features = Paragraph::new(vec![
            Line::from(vec![Span::styled(
                "Planned Features:",
                Style::default()
                    .fg(Theme::GREEN)
                    .add_modifier(Modifier::BOLD),
            )]),
            Line::from(vec![Span::styled(
                "✓ Detailed Substance Information",
                Style::default().fg(Theme::BLUE),
            )]),
            Line::from(vec![Span::styled(
                "✓ Comprehensive Phase Timeline",
                Style::default().fg(Theme::BLUE),
            )]),
            Line::from(vec![Span::styled(
                "✓ Dosage and Route Analysis",
                Style::default().fg(Theme::BLUE),
            )]),
            Line::from(vec![Span::styled(
                "✓ Progress Tracking",
                Style::default().fg(Theme::BLUE),
            )]),
        ])
        .alignment(Alignment::Left)
        .block(
            Block::default()
                .title("Upcoming Enhancements")
                .borders(Borders::ALL)
                .border_type(BorderType::Rounded),
        );
        frame.render_widget(features, chunks[1]);
    }
}
