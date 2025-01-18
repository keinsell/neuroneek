use crossterm::event::Event;
use crossterm::event::KeyCode;
use crossterm::event::KeyEvent;
use crossterm::event::{self};
use crossterm::execute;
use crossterm::terminal::EnterAlternateScreen;
use crossterm::terminal::LeaveAlternateScreen;
use crossterm::terminal::disable_raw_mode;
use crossterm::terminal::enable_raw_mode;
use miette::IntoDiagnostic;
use miette::Result;
use ratatui::Frame;
use ratatui::Terminal;
use ratatui::backend::CrosstermBackend;
use ratatui::layout::Constraint;
use ratatui::layout::Direction;
use ratatui::layout::Layout;
use ratatui::layout::Rect;
use ratatui::prelude::Alignment;
use ratatui::style::Color;
use ratatui::style::Style;
use ratatui::widgets::Block;
use ratatui::widgets::Borders;
use ratatui::widgets::block::Title;
use std::io;
use std::io::Stdout;

pub(super) fn header() -> Block<'static>
{
    let app_name = env!("CARGO_PKG_NAME");
    let app_version = env!("CARGO_PKG_VERSION");

    Block::default()
        .borders(Borders::ALL)
        .style(Style::default().fg(Color::White).bg(Color::Blue))
        .title(Title::from(format!("{}-v{}", app_name, app_version)).alignment(Alignment::Left))
}

pub(super) fn footer() -> Block<'static>
{
    Block::default()
        .title("Controls: [q]uit")
        .borders(Borders::NONE)
        .style(Style::default().fg(Color::Blue))
}

fn render_main_content(frame: &mut Frame, area: Rect)
{
    frame.render_widget(
        Block::default().title("Main Content").borders(Borders::ALL),
        area,
    );
}

fn render(frame: &mut Frame)
{
    let layout = Layout::default()
        .direction(Direction::Vertical)
        .constraints(
            [
                Constraint::Length(3),
                Constraint::Min(1),
                Constraint::Length(3),
            ]
            .as_ref(),
        )
        .split(frame.size());

    let body_layout = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([Constraint::Length(20), Constraint::Min(1)].as_ref())
        .split(layout[1]);

    frame.render_widget(header(), layout[0]);
    frame.render_widget(footer(), layout[2]);
    render_main_content(frame, body_layout[0]);
}

pub(super) fn application_loop(terminal: &mut Terminal<CrosstermBackend<Stdout>>) -> Result<()>
{
    loop
    {
        terminal.draw(render).into_diagnostic()?;
        match event::read().into_diagnostic()?
        {
            | Event::Key(KeyEvent { code, .. }) => match code
            {
                | KeyCode::Char('q') | KeyCode::Esc => break Ok(()),
                | _ =>
                {}
            },
            | _ =>
            {}
        }
    }
}

pub fn tui() -> Result<()>
{
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen).into_diagnostic()?;
    enable_raw_mode().into_diagnostic()?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend).into_diagnostic()?;
    let result = application_loop(&mut terminal);
    disable_raw_mode().into_diagnostic()?;
    execute!(terminal.backend_mut(), LeaveAlternateScreen).into_diagnostic()?;
    terminal.show_cursor().into_diagnostic()?;
    result
}
