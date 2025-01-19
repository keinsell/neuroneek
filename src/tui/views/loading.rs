use crate::tui::core::Renderable;
use crate::tui::theme::Theme;
use miette::Result;
use ratatui::prelude::*;
use ratatui::widgets::Paragraph;
use std::time::Instant;

pub struct LoadingScreen
{
    start_time: Instant,
    context: String,
}

impl LoadingScreen
{
    pub fn new(context: impl Into<String>) -> Self
    {
        Self {
            start_time: Instant::now(),
            context: context.into(),
        }
    }

    fn get_random_quote(&self) -> &'static str
    {
        const QUOTES: &[&str] = &["\"When you see this message, your computer sucks.\" — \
                                   Incompetent programmer of this app"];
        let index = (self.start_time.elapsed().as_secs() / 5) as usize % QUOTES.len();
        QUOTES[index]
    }
}

impl Renderable for LoadingScreen
{
    fn render(&self, area: Rect, frame: &mut Frame) -> Result<()>
    {
        let loading_area = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Percentage(35), // Top spacing
                Constraint::Length(7),      // Loading animation
                Constraint::Length(2),      // Message
                Constraint::Length(2),      // Quote
                Constraint::Percentage(35), // Bottom spacing
            ])
            .split(area);

        // Create a spinning ring animation
        let time = self.start_time.elapsed().as_millis() as usize;

        // Define the ring characters
        let outer_ring = ['◜', '◠', '◝', '◞', '◡', '◟'];
        let middle_ring = ['◴', '◷', '◶', '◵'];
        let inner_ring = ['◐', '◓', '◑', '◒'];
        let center_dots = ['◌', '◍', '◎', '●'];

        // Calculate rotation for each ring
        let outer_idx = (time / 100) % outer_ring.len();
        let middle_idx = (time / 150) % middle_ring.len();
        let inner_idx = (time / 200) % inner_ring.len();
        let center_idx = (time / 250) % center_dots.len();

        // Create the animation frame
        let frame_lines = [
            String::from("       "),
            format!("   {}   ", outer_ring[outer_idx]),
            format!(
                "  {} {}  ",
                middle_ring[middle_idx],
                middle_ring[(middle_idx + 2) % middle_ring.len()]
            ),
            format!(
                " {} {} {} ",
                inner_ring[inner_idx],
                center_dots[center_idx],
                inner_ring[(inner_idx + 2) % inner_ring.len()]
            ),
            format!(
                "  {} {}  ",
                middle_ring[(middle_idx + 1) % middle_ring.len()],
                middle_ring[(middle_idx + 3) % middle_ring.len()]
            ),
            format!("   {}   ", outer_ring[(outer_idx + 3) % outer_ring.len()]),
            String::from("       "),
        ];

        let colors = [Theme::BLUE, Theme::SAPPHIRE, Theme::LAVENDER, Theme::MAUVE];

        let animation_text: Vec<Line> = frame_lines
            .iter()
            .enumerate()
            .map(|(i, line)| {
                Line::from(vec![Span::styled(
                    line,
                    Style::default()
                        .fg(colors[i.min(colors.len() - 1)])
                        .add_modifier(Modifier::BOLD),
                )])
            })
            .collect();

        let animation_widget = Paragraph::new(animation_text).alignment(Alignment::Center);
        frame.render_widget(animation_widget, loading_area[1]);

        let pulse = (time / 500) % 2 == 0;
        let message_style = Style::default().fg(Theme::TEXT).add_modifier(
            if pulse
            {
                Modifier::BOLD
            }
            else
            {
                Modifier::empty()
            },
        );

        let message = Paragraph::new(format!("Loading {}", self.context))
            .alignment(Alignment::Center)
            .style(message_style);
        frame.render_widget(message, loading_area[2]);

        let quote = Paragraph::new(self.get_random_quote())
            .alignment(Alignment::Center)
            .style(Style::default().fg(Theme::OVERLAY0).italic());
        frame.render_widget(quote, loading_area[3]);

        Ok(())
    }
}
