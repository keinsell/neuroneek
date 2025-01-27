use crate::tui::core::Renderable;
use crate::tui::Theme;
use ratatui::layout::*;
use ratatui::prelude::*;
use ratatui::widgets::*;
use ratatui::Frame;

const LOGO: &str = r#"
 ███▄    █ ▓█████  █    ██  ██▀███   ▒█████   ███▄    █ ▓█████  ██ ▄█▀
 ██ ▀█   █ ▓█   ▀  ██  ▓██▒▓██ ▒ ██▒▒██▒  ██▒ ██ ▀█   █ ▓█   ▀  ██▄█▒ 
▓██  ▀█ ██▒▒███   ▓██  ▒██░▓██ ░▄█ ▒▒██░  ██▒▓██  ▀█ ██▒▒███   ▓███▄░ 
▓██▒  ▐▌██▒▒▓█  ▄ ▓▓█  ░██░▒██▀▀█▄  ▒██   ██░▓██▒  ▐▌██▒▒▓█  ▄ ▓██ █▄ 
▒██░   ▓██░░▒████▒▒▒█████▓ ░██▓ ▒██▒░ ████▓▒░▒██░   ▓██░░▒████▒▒██▒ █▄
░ ▒░   ▒ ▒ ░░ ▒░ ░░▒▓▒ ▒ ▒ ░ ▒▓ ░▒▓░░ ▒░▒░▒░ ░ ▒░   ▒ ▒ ░░ ▒░ ░▒ ▒▒ ▓▒
"#;

pub struct Welcome;

impl Default for Welcome {
    fn default() -> Self {
        Self
    }
}

impl Renderable for Welcome {
    fn render(&self, area: Rect, frame: &mut Frame) -> miette::Result<()> {
        if frame.size().width < 80 {
            let msg = "Please increase your terminal size to at least 80 characters wide";
            let msg_area = centered_rect(60, 5, area);
            frame.render_widget(Clear, area);
            frame.render_widget(
                Paragraph::new(msg).alignment(Alignment::Center),
                msg_area,
            );
            return Ok(());
        }

        let chunks = Layout::default()
            .direction(Direction::Vertical)
            .margin(2)
            .constraints([
                Constraint::Length(8),  // Logo
                Constraint::Length(1),  // Spacing
                Constraint::Length(6),  // Navigation help
            ])
            .split(area);

        // Logo
        let logo = Paragraph::new(LOGO)
            .style(Style::default().fg(Theme::MAUVE))
            .alignment(Alignment::Center);
        frame.render_widget(logo, chunks[0]);

        // Navigation help
        let welcome_text = vec![
            Line::from(vec![
                Span::styled("Press ", Style::default().fg(Theme::TEXT)),
                Span::styled("1", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" to see dashboard", Style::default().fg(Theme::TEXT)),
            ]),
            Line::from(vec![
                Span::styled("Press ", Style::default().fg(Theme::TEXT)),
                Span::styled("2", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" to manage ingestions", Style::default().fg(Theme::TEXT)),
            ]),
            Line::from(vec![
                Span::styled("Press ", Style::default().fg(Theme::TEXT)),
                Span::styled("0", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" to access settings", Style::default().fg(Theme::TEXT)),
            ]),
            Line::from(vec![
                Span::styled("Press ", Style::default().fg(Theme::TEXT)),
                Span::styled("?", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" for help", Style::default().fg(Theme::TEXT)),
            ]),
        ];

        let help = Paragraph::new(welcome_text)
            .style(Style::default())
            .alignment(Alignment::Center);

        frame.render_widget(help, chunks[2]);

        Ok(())
    }
}

fn centered_rect(width: u16, height: u16, area: Rect) -> Rect {
    let top_pad = (area.height - height) / 2;
    let left_pad = (area.width - width) / 2;
    Rect::new(area.left() + left_pad, area.top() + top_pad, width, height)
}