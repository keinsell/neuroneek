use crossterm::event::Event;
use crossterm::event::KeyCode;
use crossterm::event::KeyEvent;
use miette::Result;
use ratatui::prelude::*;
use ratatui::style::Modifier;
use ratatui::style::Style;
use ratatui::widgets::Block;
use ratatui::widgets::BorderType;
use ratatui::widgets::Borders;
use ratatui::widgets::Clear;
use ratatui::widgets::Paragraph;
use ratatui::widgets::Scrollbar;
use ratatui::widgets::ScrollbarOrientation;
use ratatui::widgets::ScrollbarState;
use ratatui::widgets::Wrap;

use crate::tui::core::Renderable;
use crate::tui::theme::Theme;
use crate::tui::widgets::EventHandler;
use crate::tui::widgets::Focusable;
use crate::tui::widgets::Stateful;

fn fancy_help_content() -> Text<'static>
{
    let mut text = Text::default();

    text.extend(vec![
        Line::from(vec![Span::styled(
            "DISCLAIMER",
            Style::default().fg(Theme::RED).add_modifier(Modifier::BOLD),
        )])
        .alignment(Alignment::Center),
        Line::default(),
        Line::from(
            "This application is a toy—built for playing with datasets and research related to \
             neuroscience and pharmacology found in the wild. You should not threat it as holy \
             grail of knowledge (because it's not).",
        ),
        Line::default(),
        Line::from(vec![Span::from(
            "Any information here might be wrong, misleading, or outright dangerous.",
        )]),
        Line::default(),
        Line::from(vec![Span::from(
            "Maintainers aren't responsible for harm caused by \"this app\" as at the end that's \
             you who's pulling the strings, use for your own benefit if you see any or just do \
             not touch it.",
        )]),
        Line::default(),
        Line::from(vec![Span::from(
            "Proceed with caution or abandon hope entirely. (as maintainers did, for this whole \
             development process)",
        )]),
        Line::default(),
        Line::default(),
        Line::from(vec![
            Span::styled(
                "This application is still in development, so expect bugs and crashes. \n",
                Style::default().fg(Theme::YELLOW),
            ),
            Span::styled(
                "It's actually my favourite excuse for not-resolving issues and building record \
                 backlog...",
                Style::default()
                    .fg(Theme::YELLOW)
                    .add_modifier(Modifier::ITALIC),
            ),
        ])
        .alignment(Alignment::Center),
        Line::default(),
        Line::from("━".repeat(50)).alignment(Alignment::Center),
        Line::default(),
        Line::from(vec![Span::styled(
            "CREATE INGESTION FORM",
            Style::default().add_modifier(Modifier::BOLD),
        )]),
        Line::from(vec![
            Span::styled("• ", Style::default().fg(Theme::BLUE)),
            Span::from("Quick Navigation:"),
        ]),
        Line::from(vec![
            Span::styled("  ", Style::default()),
            Span::from("- Tab/↓: Next field • Shift+Tab/↑: Previous field"),
        ]),
        Line::from(vec![
            Span::styled("  ", Style::default()),
            Span::from("- Enter: Edit field or activate button"),
        ]),
        Line::from(vec![
            Span::styled("  ", Style::default()),
            Span::from("- Ctrl+S: Quick save • Esc: Quick cancel"),
        ]),
        Line::from(vec![
            Span::styled("• ", Style::default().fg(Theme::BLUE)),
            Span::from("Smart Input:"),
        ]),
        Line::from(vec![
            Span::styled("  ", Style::default()),
            Span::from("Substance: Any name (e.g., 'Caffeine', 'Vitamin C')"),
        ]),
        Line::from(vec![
            Span::styled("  ", Style::default()),
            Span::from("Dosage: Natural input (e.g., '10mg', '0.5g', '100mcg')"),
        ]),
        Line::from(vec![
            Span::styled("  ", Style::default()),
            Span::from("Route: Scrollable dropdown (↑/↓ to select)"),
        ]),
        Line::from(vec![
            Span::styled("  ", Style::default()),
            Span::from("Date: 'now' or natural (e.g., 'today 10am', 'yesterday 2pm')"),
        ]),
        Line::from(vec![
            Span::styled("• ", Style::default().fg(Theme::BLUE)),
            Span::from("Quick Tips:"),
        ]),
        Line::from(vec![
            Span::styled("  ", Style::default()),
            Span::from("- Enter confirms each field and moves to next"),
        ]),
        Line::from(vec![
            Span::styled("  ", Style::default()),
            Span::from("- Use arrow keys to navigate the form quickly"),
        ]),
        Line::from(vec![
            Span::styled("  ", Style::default()),
            Span::from("- Tab through fields to reach Save/Cancel buttons"),
        ]),
        Line::default(),
        Line::from("━".repeat(50)),
        Line::default(),
        Line::from(vec![Span::styled(
            "NAVIGATION",
            Style::default().add_modifier(Modifier::BOLD),
        )]),
        Line::from(vec![
            Span::styled("j / ↓", Style::default().fg(Theme::BLUE)),
            Span::styled(" .......... ", Style::default().fg(Theme::OVERLAY0)),
            Span::from("Move down"),
        ]),
        Line::from(vec![
            Span::styled("k / ↑", Style::default().fg(Theme::BLUE)),
            Span::styled(" .......... ", Style::default().fg(Theme::OVERLAY0)),
            Span::from("Move up"),
        ]),
        Line::from(vec![
            Span::styled("l / → / Enter", Style::default().fg(Theme::BLUE)),
            Span::styled(" .. ", Style::default().fg(Theme::OVERLAY0)),
            Span::from("Select / View details"),
        ]),
        Line::from(vec![
            Span::styled("h / ←", Style::default().fg(Theme::BLUE)),
            Span::styled(" .......... ", Style::default().fg(Theme::OVERLAY0)),
            Span::from("Go back"),
        ]),
        Line::from(vec![
            Span::styled("?", Style::default().fg(Theme::BLUE)),
            Span::styled(" .............. ", Style::default().fg(Theme::OVERLAY0)),
            Span::from("Toggle help page"),
        ]),
        Line::from(vec![
            Span::styled("q", Style::default().fg(Theme::BLUE)),
            Span::styled(" .............. ", Style::default().fg(Theme::OVERLAY0)),
            Span::from("Quit application"),
        ]),
        Line::default(),
        Line::from("━".repeat(50)).alignment(Alignment::Center),
        Line::default(),
        Line::default(),
        Line::from(vec![
            Span::styled(
                "\"If you think this app will help you in life, well,\n",
                Style::default().fg(Theme::GREEN),
            ),
            Span::styled(
                "  you're an optimist. That, or you'll abandon it when it crashes\n",
                Style::default().fg(Theme::GREEN),
            ),
            Span::styled(
                " after 10 minutes. Either way, life is fleeting.\"\n",
                Style::default().fg(Theme::GREEN),
            ),
            Span::styled(
                " ~ One and only maintainer",
                Style::default()
                    .fg(Theme::GREEN)
                    .add_modifier(Modifier::ITALIC),
            ),
        ]),
    ]);

    text
}

pub enum HelpMessage
{
    ScrollUp,
    ScrollDown,
    PageUp,
    PageDown,
    Noop,
}

pub struct Help
{
    scroll: u16,
    max_scroll: u16,
    focused: bool,
}

impl Help
{
    pub fn new() -> Self
    {
        Self {
            scroll: 0,
            max_scroll: 0,
            focused: false,
        }
    }

    fn scroll_up(&mut self)
    {
        if self.scroll > 0
        {
            self.scroll -= 1;
        }
    }

    fn scroll_down(&mut self)
    {
        if self.scroll < self.max_scroll
        {
            self.scroll += 1;
        }
    }

    fn page_up(&mut self)
    {
        if self.scroll > 10
        {
            self.scroll -= 10;
        }
        else
        {
            self.scroll = 0;
        }
    }

    fn page_down(&mut self)
    {
        if self.scroll + 10 < self.max_scroll
        {
            self.scroll += 10;
        }
        else
        {
            self.scroll = self.max_scroll;
        }
    }
}

impl Renderable for Help
{
    fn render(&self, area: Rect, frame: &mut Frame) -> Result<()>
    {
        let popup_area = centered_rect(50, 70, area);

        frame.render_widget(Clear, popup_area);

        let block = Block::default()
            .title(" Help ")
            .borders(Borders::ALL)
            .border_type(BorderType::Rounded)
            .style(Style::default().bg(Theme::SURFACE0));

        let inner_area = block.inner(popup_area);

        frame.render_widget(block, popup_area);

        let content_area = Rect {
            x: inner_area.x + 2,
            y: inner_area.y + 1,
            width: inner_area.width.saturating_sub(4),
            height: inner_area.height.saturating_sub(2),
        };

        let text = fancy_help_content();
        let scroll_state =
            ScrollbarState::new(text.height() as usize).position(self.scroll as usize);

        let paragraph = Paragraph::new(text)
            .style(Style::default().bg(Theme::SURFACE0))
            .scroll((self.scroll, 0))
            .wrap(Wrap { trim: true });

        frame.render_widget(paragraph, content_area);

        frame.render_stateful_widget(
            Scrollbar::new(ScrollbarOrientation::VerticalRight)
                .style(Style::default().fg(Theme::OVERLAY0)),
            popup_area,
            &mut scroll_state.clone(),
        );

        Ok(())
    }
}

impl Focusable for Help
{
    fn is_focused(&self) -> bool { self.focused }

    fn set_focus(&mut self, focused: bool) { self.focused = focused; }
}

impl EventHandler for Help
{
    type Message = ();

    fn handle_event(&mut self, event: Event) -> Result<Option<Self::Message>>
    {
        match event
        {
            | Event::Key(KeyEvent { code, .. }) => match code
            {
                | KeyCode::Char('j') | KeyCode::Down =>
                {
                    self.scroll = self.scroll.saturating_add(1);
                }
                | KeyCode::Char('k') | KeyCode::Up =>
                {
                    self.scroll = self.scroll.saturating_sub(1);
                }
                | _ =>
                {}
            },
            | _ =>
            {}
        }
        Ok(None)
    }
}

impl Stateful for Help
{
    type Message = ();

    fn update(&mut self, _message: Self::Message) -> Result<()> { Ok(()) }
}

fn centered_rect(percent_x: u16, percent_y: u16, r: Rect) -> Rect
{
    let popup_layout = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Percentage((100 - percent_y) / 2),
            Constraint::Percentage(percent_y),
            Constraint::Percentage((100 - percent_y) / 2),
        ])
        .split(r);

    Layout::default()
        .direction(Direction::Horizontal)
        .constraints([
            Constraint::Percentage((100 - percent_x) / 2),
            Constraint::Percentage(percent_x),
            Constraint::Percentage((100 - percent_x) / 2),
        ])
        .split(popup_layout[1])[1]
}
