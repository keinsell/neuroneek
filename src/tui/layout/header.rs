use crate::core::config::VERSION;
use crate::tui::core::Renderable;
use crate::tui::events::Screen;
use crate::tui::widgets::EventHandler;
use crate::tui::widgets::Focusable;
use crate::tui::widgets::Stateful;
use crate::tui::Theme;
use crossterm::event::Event;
use crossterm::event::KeyCode;
use crossterm::event::KeyEvent;
use ratatui::layout::Alignment;
use ratatui::layout::Layout;
use ratatui::layout::Rect;
use ratatui::prelude::Direction;
use ratatui::prelude::Line;
use ratatui::prelude::*;
use ratatui::widgets::Block;
use ratatui::widgets::BorderType;
use ratatui::widgets::Borders;
use ratatui::widgets::Paragraph;
use ratatui::Frame;

#[derive(Debug, Clone)]
pub enum Message
{
    SetScreen(Screen),
    Noop,
}

pub struct Header
{
    current_screen: Screen,
    focused: bool,
}

impl Header
{
    pub fn new(current_screen: Screen) -> Self
    {
        Self {
            current_screen,
            focused: false,
        }
    }
}

impl Renderable for Header
{
    fn render(&self, area: Rect, frame: &mut Frame) -> miette::Result<()>
    {
        let app_version = VERSION;
        let header_height = 3;
        let header_area = Rect {
            x: area.x,
            y: area.y,
            width: area.width,
            height: header_height,
        };

        let header_block = Block::default()
            .borders(Borders::ALL)
            .border_type(BorderType::Rounded)
            .border_style(Style::default().fg(Theme::BORDER))
            .style(Style::default().bg(Theme::SURFACE0));

        frame.render_widget(header_block.clone(), header_area);
        let inner_area = header_block.inner(header_area);

        let chunks = Layout::default()
            .direction(Direction::Horizontal)
            .constraints([Constraint::Min(0), Constraint::Length(20)])
            .split(inner_area);

        let nav_items = Line::from(vec![
            Span::raw(" "),
            if matches!(self.current_screen, Screen::Home)
            {
                Span::styled("Home", Style::default().fg(Theme::BASE).bg(Theme::TEXT))
            }
            else
            {
                Span::styled("1", Style::default().fg(Theme::OVERLAY0))
            },
            if !matches!(self.current_screen, Screen::Home)
            {
                Span::styled(" Home", Style::default().fg(Theme::TEXT))
            }
            else
            {
                Span::raw("")
            },
            Span::raw(" "),
            Span::styled("│", Style::default().fg(Theme::OVERLAY1)),
            Span::raw(" "),
            if matches!(self.current_screen, Screen::ListIngestions)
            {
                Span::styled(
                    "Ingestions",
                    Style::default().fg(Theme::BASE).bg(Theme::TEXT),
                )
            }
            else
            {
                Span::styled("2", Style::default().fg(Theme::OVERLAY0))
            },
            if !matches!(self.current_screen, Screen::ListIngestions)
            {
                Span::styled(" Ingestions", Style::default().fg(Theme::TEXT))
            }
            else
            {
                Span::raw("")
            },
            Span::raw(" "),
            Span::styled("│", Style::default().fg(Theme::OVERLAY1)),
            Span::raw(" "),
            if matches!(self.current_screen, Screen::Settings)
            {
                Span::styled("Settings", Style::default().fg(Theme::BASE).bg(Theme::TEXT))
            }
            else
            {
                Span::styled("0", Style::default().fg(Theme::OVERLAY0))
            },
            if !matches!(self.current_screen, Screen::Settings)
            {
                Span::styled(" Settings", Style::default().fg(Theme::TEXT))
            }
            else
            {
                Span::raw("")
            },
        ]);

        let nav = Paragraph::new(nav_items)
            .style(Style::default().fg(Theme::TEXT))
            .alignment(Alignment::Left);
        frame.render_widget(nav, chunks[0]);

        let version = Paragraph::new(format!("v{}", app_version))
            .style(Style::default().fg(Theme::SUBTEXT0))
            .alignment(Alignment::Right);
        frame.render_widget(version, chunks[1]);

        Ok(())
    }
}

impl EventHandler for Header
{
    type Message = Message;

    fn handle_event(&mut self, event: Event) -> miette::Result<Option<Self::Message>>
    {
        if let Event::Key(KeyEvent { code, .. }) = event
        {
            match code
            {
                | KeyCode::Char('1') =>
                {
                    if self.current_screen != Screen::Welcome {
                        return Ok(Some(Message::SetScreen(Screen::Home)));
                    }
                }
                | KeyCode::Char('2') =>
                {
                    return Ok(Some(Message::SetScreen(Screen::ListIngestions)));
                }
                | KeyCode::Char('0') =>
                {
                    return Ok(Some(Message::SetScreen(Screen::Settings)));
                }
                | _ =>
                {}
            }
        }
        Ok(None)
    }
}

impl Stateful for Header
{
    type Message = Message;

    fn update(&mut self, msg: Self::Message) -> miette::Result<()>
    {
        match msg
        {
            | Message::SetScreen(screen) =>
            {
                self.current_screen = screen;
            }
            | Message::Noop =>
            {}
        }
        Ok(())
    }
}

impl Focusable for Header
{
    fn is_focused(&self) -> bool { self.focused }
    fn set_focus(&mut self, focused: bool) { self.focused = focused; }
}