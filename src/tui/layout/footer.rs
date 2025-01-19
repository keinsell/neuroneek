use crate::tui::core::Renderable;
use crate::tui::events::Screen;
use crate::tui::theme::Theme;
use crate::tui::widgets::EventHandler;
use crate::tui::widgets::Focusable;
use crate::tui::widgets::Stateful;
use crossterm::event::Event;
use crossterm::event::KeyCode;
use crossterm::event::KeyEvent;
use miette::Result;
use ratatui::layout::Flex;
use ratatui::prelude::*;
use ratatui::text::Line;
use ratatui::text::Span;

#[derive(Debug, Clone)]
pub enum StatusBarMsg
{
    /// Update the current screen
    UpdateScreen(Screen),

    /// Error message
    Error(String),

    /// No operation
    Noop,
}

#[derive(Debug, Default, Clone)]
pub struct StatusBarSection<'a>
{
    pre_separator: Option<Span<'a>>,
    content: Line<'a>,
    post_separator: Option<Span<'a>>,
}

impl<'a> StatusBarSection<'a>
{
    pub fn pre_separator(mut self, separator: impl Into<Span<'a>>) -> Self
    {
        self.pre_separator = Some(separator.into());
        self
    }

    pub fn content(mut self, content: impl Into<Line<'a>>) -> Self
    {
        self.content = content.into();
        self
    }

    pub fn post_separator(mut self, separator: impl Into<Span<'a>>) -> Self
    {
        self.post_separator = Some(separator.into());
        self
    }
}

impl<'a> From<Line<'a>> for StatusBarSection<'a>
{
    fn from(line: Line<'a>) -> Self
    {
        StatusBarSection {
            pre_separator: None,
            content: line,
            post_separator: None,
        }
    }
}

impl<'a> From<Span<'a>> for StatusBarSection<'a>
{
    fn from(span: Span<'a>) -> Self
    {
        StatusBarSection {
            pre_separator: None,
            content: span.into(),
            post_separator: None,
        }
    }
}

impl<'a> From<&'a str> for StatusBarSection<'a>
{
    fn from(s: &'a str) -> Self
    {
        StatusBarSection {
            pre_separator: None,
            content: s.into(),
            post_separator: None,
        }
    }
}

#[derive(Debug)]
pub struct Footer
{
    /// Current screen being displayed
    current_screen: Screen,

    /// Whether the widget is currently focused
    focused: bool,

    /// Sections of the status bar
    sections: Vec<StatusBarSection<'static>>,

    /// Layout flex mode
    flex: Flex,

    /// Spacing between sections
    spacing: u16,

    /// Error message
    error_message: Option<String>,
}

impl Footer
{
    /// Create a new status bar widget
    pub fn new() -> Self
    {
        let mut footer = Self {
            current_screen: Screen::ListIngestions,
            focused: false,
            sections: vec![StatusBarSection::default(); 2],
            flex: Flex::SpaceBetween,
            spacing: 1,
            error_message: None,
        };
        footer.update_sections();
        footer
    }

    /// Get help text based on current screen
    fn get_help_text(&self) -> Line<'static>
    {
        let help_spans = match self.current_screen
        {
            | Screen::Welcome => vec![
                Span::styled("?", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" Help ", Style::default().fg(Theme::TEXT)),
                Span::styled("│", Style::default().fg(Theme::OVERLAY1)),
                Span::styled("q", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" Quit ", Style::default().fg(Theme::TEXT)),
            ],
            | Screen::ListIngestions => vec![
                Span::styled(" ", Style::default()),
                Span::styled("n", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" New ", Style::default().fg(Theme::TEXT)),
                Span::styled("│", Style::default().fg(Theme::OVERLAY1)),
                Span::styled("l/Enter", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" Details ", Style::default().fg(Theme::TEXT)),
                Span::styled("│", Style::default().fg(Theme::OVERLAY1)),
                Span::styled("?", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" Help ", Style::default().fg(Theme::TEXT)),
                Span::styled("│", Style::default().fg(Theme::OVERLAY1)),
                Span::styled("q", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" Quit ", Style::default().fg(Theme::TEXT)),
            ],
            | Screen::CreateIngestion => vec![
                Span::styled(" ", Style::default()),
                Span::styled("↑/↓/Tab", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" Navigate ", Style::default().fg(Theme::TEXT)),
                Span::styled("│", Style::default().fg(Theme::OVERLAY1)),
                Span::styled("Enter", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" Edit ", Style::default().fg(Theme::TEXT)),
                Span::styled("│", Style::default().fg(Theme::OVERLAY1)),
                Span::styled("Ctrl+H", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" Help ", Style::default().fg(Theme::TEXT)),
            ],
            | Screen::ViewIngestion => vec![
                Span::styled(" ", Style::default()),
                Span::styled("h", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" Back ", Style::default().fg(Theme::TEXT)),
                Span::styled("│", Style::default().fg(Theme::OVERLAY1)),
                Span::styled("Esc", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" Close ", Style::default().fg(Theme::TEXT)),
                Span::styled("│", Style::default().fg(Theme::OVERLAY1)),
                Span::styled("?", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" Help ", Style::default().fg(Theme::TEXT)),
            ],
            | Screen::Settings => vec![
                Span::styled(" ", Style::default()),
                Span::styled("h", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" Back ", Style::default().fg(Theme::TEXT)),
                Span::styled("│", Style::default().fg(Theme::OVERLAY1)),
                Span::styled("Esc", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" Close ", Style::default().fg(Theme::TEXT)),
                Span::styled("│", Style::default().fg(Theme::OVERLAY1)),
                Span::styled("?", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" Help ", Style::default().fg(Theme::TEXT)),
            ],
            | Screen::Help => vec![
                Span::styled(" ", Style::default()),
                Span::styled("?", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" Close Help ", Style::default().fg(Theme::TEXT)),
            ],
            | Screen::Loading => vec![
                Span::styled(" ", Style::default()),
                Span::styled("q", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" Quit ", Style::default().fg(Theme::TEXT)),
            ],
        };

        Line::from(help_spans)
    }

    /// Get screen name
    fn get_screen_name(&self) -> &'static str
    {
        match self.current_screen
        {
            | Screen::Welcome => "Welcome",
            | Screen::ListIngestions => "Ingestions",
            | Screen::CreateIngestion => "Create Ingestion",
            | Screen::ViewIngestion => "Ingestion",
            | Screen::Settings => "Settings",
            | Screen::Help => "Help",
            | Screen::Loading => "Loading...",
        }
    }

    /// Update sections based on current state
    fn update_sections(&mut self)
    {
        let help_text = self.get_help_text();
        let screen_name = self.get_screen_name();

        self.sections[0] = help_text.into();
        self.sections[1] = Span::styled(screen_name, Style::default().fg(Theme::SUBTEXT0)).into();
    }
}

impl Renderable for Footer
{
    fn render(&self, area: Rect, frame: &mut Frame) -> Result<()>
    {
        if area.is_empty()
        {
            return Ok(());
        }

        let layout = Layout::horizontal(
            self.sections
                .iter()
                .map(|s| Constraint::Length(u16::try_from(s.content.width()).unwrap_or(0))),
        )
        .flex(self.flex)
        .spacing(self.spacing);

        let areas = layout.split(area);
        let areas = areas.as_ref();

        for (i, section) in self.sections.iter().enumerate()
        {
            if let Some(rect) = areas.get(i)
            {
                frame.buffer_mut().set_line(
                    rect.x,
                    rect.y,
                    &section.content,
                    u16::try_from(section.content.width()).unwrap_or(0),
                );
            }
        }

        Ok(())
    }
}

impl EventHandler for Footer
{
    type Message = StatusBarMsg;

    fn handle_event(&mut self, event: Event) -> Result<Option<Self::Message>>
    {
        if !self.focused
        {
            return Ok(None);
        }

        match event
        {
            | Event::Key(KeyEvent {
                code: KeyCode::Char('h'),
                ..
            }) => match self.current_screen
            {
                | Screen::ViewIngestion =>
                {
                    Ok(Some(StatusBarMsg::UpdateScreen(Screen::ListIngestions)))
                }
                | Screen::Settings => Ok(Some(StatusBarMsg::UpdateScreen(Screen::ListIngestions))),
                | _ => Ok(Some(StatusBarMsg::Noop)),
            },
            | Event::Key(KeyEvent {
                code: KeyCode::Char('n'),
                ..
            }) => match self.current_screen
            {
                | Screen::ListIngestions =>
                {
                    Ok(Some(StatusBarMsg::UpdateScreen(Screen::CreateIngestion)))
                }
                | _ => Ok(Some(StatusBarMsg::Noop)),
            },
            | Event::Key(KeyEvent {
                code: KeyCode::Char('l') | KeyCode::Enter,
                ..
            }) => match self.current_screen
            {
                | Screen::ListIngestions =>
                {
                    Ok(Some(StatusBarMsg::UpdateScreen(Screen::ViewIngestion)))
                }
                | _ => Ok(Some(StatusBarMsg::Noop)),
            },
            | _ => Ok(Some(StatusBarMsg::Noop)),
        }
    }
}

impl Stateful for Footer
{
    type Message = StatusBarMsg;

    fn update(&mut self, msg: Self::Message) -> Result<()>
    {
        match msg
        {
            | StatusBarMsg::UpdateScreen(screen) =>
            {
                self.current_screen = screen;
                self.update_sections();
                Ok(())
            }
            | StatusBarMsg::Error(error_msg) =>
            {
                self.error_message = Some(error_msg);
                Ok(())
            }
            | StatusBarMsg::Noop => Ok(()),
        }
    }
}

impl Focusable for Footer
{
    fn is_focused(&self) -> bool { self.focused }

    fn set_focus(&mut self, focused: bool) { self.focused = focused; }
}

impl Default for Footer
{
    fn default() -> Self { Self::new() }
}
