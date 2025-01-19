use crate::tui::core::Renderable;
use crate::tui::events::AppEvent;
use crate::tui::events::AppMessage;
use crate::tui::events::EventHandler;
use crate::tui::events::Screen;
use crate::tui::layout::footer::Footer;
use crate::tui::layout::footer::StatusBarMsg;
use crate::tui::layout::header::Header;
use crate::tui::layout::header::Message;
use crate::tui::layout::help::Help;
use crate::tui::theme::Theme;
use crate::tui::views::ingestion::create_ingestion::CreateIngestionState;
use crate::tui::views::ingestion::get_ingestion::IngestionViewState;
use crate::tui::views::ingestion::list_ingestion::IngestionListState;
use crate::tui::views::loading::LoadingScreen;
use crate::tui::views::Welcome;
use crate::tui::widgets::EventHandler as WidgetEventHandler;
use crate::tui::widgets::Focusable;
use crate::tui::widgets::Navigable;
use crate::tui::widgets::Stateful;
use async_std::task;
use async_std::task::JoinHandle;
use crossterm::event as crossterm_event;
use crossterm::event::Event;
use crossterm::event::KeyCode;
use crossterm::event::KeyEvent;
use crossterm::event::MouseEvent;
use crossterm::execute;
use crossterm::terminal::disable_raw_mode;
use crossterm::terminal::enable_raw_mode;
use crossterm::terminal::EnterAlternateScreen;
use crossterm::terminal::LeaveAlternateScreen;
use futures::executor::block_on;
use futures::future::Future;
use futures::future::FutureExt;
use miette::IntoDiagnostic;
use miette::Result;
use ratatui::prelude::*;
use ratatui::widgets::block::Title;
use ratatui::widgets::Block;
use ratatui::widgets::BorderType;
use ratatui::widgets::Borders;
use ratatui::widgets::Clear;
use ratatui::widgets::Gauge;
use ratatui::widgets::Paragraph;
use std::collections::HashMap;
use std::io::stdout;
use std::io::Stdout;
use std::time::Duration;
use std::time::Instant;
use tracing::debug;
use tracing::error;

pub struct Application
{
    terminal: Terminal<CrosstermBackend<Stdout>>,
    event_handler: EventHandler,
    current_screen: Screen,
    last_tick: Instant,
    ingestion_details: IngestionViewState,
    ingestion_list: IngestionListState,
    create_ingestion: CreateIngestionState,
    header: Header,
    status_bar: Footer,
    help_page: Help,
    show_help: bool,
    target_screen: Option<Screen>,
    loading_screen: Option<LoadingScreen>,
    background_tasks: HashMap<String, (JoinHandle<Result<()>>, bool)>,
    data_cache: HashMap<String, Instant>,
}

impl Application
{
    pub async fn new() -> Result<Self>
    {
        let backend = CrosstermBackend::new(stdout());
        let terminal = Terminal::new(backend).into_diagnostic()?;

        let mut app = Self {
            terminal,
            event_handler: EventHandler::new(),
            current_screen: Screen::Welcome,
            last_tick: Instant::now(),
            ingestion_details: IngestionViewState::new(),
            ingestion_list: IngestionListState::new(),
            create_ingestion: CreateIngestionState::new(),
            header: Header::new(Screen::Welcome),
            status_bar: Footer::new(),
            help_page: Help::new(),
            show_help: false,
            target_screen: None,
            loading_screen: None,
            background_tasks: HashMap::new(),
            data_cache: HashMap::new(),
        };

        app.update_screen(app.current_screen).await?;
        Ok(app)
    }

    fn should_refresh_data(&self, key: &str) -> bool
    {
        if let Some(last_update) = self.data_cache.get(key)
        {
            last_update.elapsed() > Duration::from_secs(30) // Cache for 30 seconds
        }
        else
        {
            true
        }
    }

    pub async fn update_screen(&mut self, screen: Screen) -> Result<()>
    {
        match screen
        {
            | Screen::ListIngestions =>
            {
                if !self.should_refresh_data("ingestion_list")
                {
                    self.current_screen = Screen::ListIngestions;
                    self.header
                        .update(Message::SetScreen(Screen::ListIngestions))?;
                    return Ok(());
                }

                self.target_screen = Some(Screen::ListIngestions);
                self.current_screen = Screen::Loading;
                self.loading_screen = Some(LoadingScreen::new("ingestion list"));
                self.header.update(Message::SetScreen(Screen::Loading))?;

                // Update in place
                self.ingestion_list.update().await?;
                self.data_cache
                    .insert("ingestion_list".to_string(), Instant::now());
                self.current_screen = Screen::ListIngestions;
                self.loading_screen = None;
                self.header
                    .update(Message::SetScreen(Screen::ListIngestions))?;
            }
            | Screen::ViewIngestion =>
            {
                if let Some(ingestion) = self.ingestion_list.selected_ingestion()
                {
                    if let Some(id) = ingestion.id
                    {
                        let cache_key = format!("ingestion_details_{}", id);

                        if !self.should_refresh_data(&cache_key)
                        {
                            self.current_screen = Screen::ViewIngestion;
                            self.header
                                .update(Message::SetScreen(Screen::ViewIngestion))?;
                            return Ok(());
                        }

                        self.current_screen = Screen::Loading;
                        self.loading_screen = Some(LoadingScreen::new("ingestion details"));
                        self.header.update(Message::SetScreen(Screen::Loading))?;

                        // Update in place
                        self.ingestion_details
                            .load_ingestion(id.to_string())
                            .await?;
                        self.data_cache.insert(cache_key, Instant::now());
                        self.current_screen = Screen::ViewIngestion;
                        self.loading_screen = None;
                        self.header
                            .update(Message::SetScreen(Screen::ViewIngestion))?;
                    }
                }
            }
            | _ =>
            {
                self.current_screen = screen;
                self.loading_screen = None;
                self.header.update(Message::SetScreen(screen))?;
            }
        }

        self.status_bar.update(StatusBarMsg::UpdateScreen(screen))
    }

    fn centered_rect(width: u16, height: u16, area: Rect) -> Rect
    {
        let top_pad = (area.height - height) / 2;
        let left_pad = (area.width - width) / 2;
        Rect::new(area.left() + left_pad, area.top() + top_pad, width, height)
    }

    pub fn render(&mut self) -> Result<()>
    {
        let area = self.terminal.size().into_diagnostic()?;
        let current_screen = self.current_screen;
        let show_help = self.show_help;
        let should_show_size_warning = area.width < 80;

        self.terminal
            .draw(|frame| {
                if should_show_size_warning
                {
                    let msg_area = Self::centered_rect(60, 5, frame.size());
                    frame.render_widget(Clear, frame.size());
                    frame.render_widget(
                        Paragraph::new(
                            "Please increase your terminal size to at least 80 characters wide to \
                             view the Neuronek TUI",
                        )
                        .style(Style::default())
                        .alignment(Alignment::Center),
                        msg_area,
                    );
                    return;
                }

                let chunks = Layout::default()
                    .direction(Direction::Vertical)
                    .constraints([
                        Constraint::Length(3),
                        Constraint::Min(10),
                        Constraint::Length(3),
                    ])
                    .split(area);

                let _ = self.header.render(chunks[0], frame);

                if current_screen == Screen::Loading
                {
                    if let Some(loading_screen) = &self.loading_screen
                    {
                        let _ = loading_screen.render(chunks[1], frame);
                    }
                }
                else
                {
                    match current_screen
                    {
                        | Screen::Welcome =>
                        {
                            let block = Block::default()
                                .title("Home")
                                .borders(Borders::ALL)
                                .border_type(BorderType::Rounded)
                                .style(Style::default().bg(Theme::SURFACE0));

                            let home_area = block.inner(chunks[1]);
                            frame.render_widget(block, chunks[1]);
                            Welcome::default().render(home_area, frame).unwrap();
                        }
                        | Screen::CreateIngestion =>
                        {
                            let block = Block::default()
                                .title("New Ingestion")
                                .borders(Borders::ALL)
                                .border_type(BorderType::Rounded)
                                .style(Style::default().bg(Theme::SURFACE0));

                            let create_ingestion_area = block.inner(chunks[1]);
                            frame.render_widget(block, chunks[1]);
                            self.create_ingestion
                                .render(create_ingestion_area, frame)
                                .unwrap();
                        }
                        | Screen::ViewIngestion =>
                        {
                            let block = Block::default()
                                .title("Ingestion Details")
                                .borders(Borders::ALL)
                                .border_type(BorderType::Rounded)
                                .style(Style::default().bg(Theme::SURFACE0));

                            let ingestion_details_area = block.inner(chunks[1]);
                            frame.render_widget(block, chunks[1]);
                            self.ingestion_details.view(frame, ingestion_details_area);
                        }
                        | Screen::Settings =>
                        {
                            let block = Block::default()
                                .title("Settings")
                                .borders(Borders::ALL)
                                .border_type(BorderType::Rounded)
                                .style(Style::default().bg(Theme::SURFACE0));

                            let settings_area = block.inner(chunks[1]);
                            frame.render_widget(block, chunks[1]);

                            let settings_text = vec![
                                Line::from(vec![Span::styled(
                                    "Settings",
                                    Style::default()
                                        .fg(Theme::MAUVE)
                                        .add_modifier(Modifier::BOLD),
                                )]),
                                Line::from(""),
                                Line::from("No settings available yet."),
                            ];

                            let settings = Paragraph::new(settings_text)
                                .style(Style::default())
                                .alignment(Alignment::Center)
                                .block(Block::default());

                            frame.render_widget(settings, settings_area);
                        }
                        | Screen::Help =>
                        {}
                        | Screen::ListIngestions =>
                        {
                            let block = Block::default()
                                .title("Ingestions")
                                .borders(Borders::ALL)
                                .border_type(BorderType::Rounded)
                                .style(Style::default().bg(Theme::SURFACE0));

                            let ingestion_list_area = block.inner(chunks[1]);
                            frame.render_widget(block, chunks[1]);
                            let _ = self.ingestion_list.view(frame, ingestion_list_area);
                        }
                        | Screen::Loading =>
                        {
                            // This case is handled above
                        }
                    }
                }

                let _ = self.status_bar.render(chunks[2], frame);

                if show_help
                {
                    let _ = self.help_page.render(area, frame);
                }
            })
            .map_err(|e| miette::miette!("Failed to draw terminal: {}", e))?;

        Ok(())
    }

    async fn check_background_tasks(&mut self) -> Result<()>
    {
        let task_keys: Vec<String> = self.background_tasks.keys().cloned().collect();

        for key in task_keys
        {
            if let Some((task, completed)) = self.background_tasks.get_mut(&key)
            {
                if *completed
                {
                    continue; // Skip already completed tasks
                }

                if let Some(result) = task.now_or_never()
                {
                    match result
                    {
                        | Ok(_) =>
                        {
                            self.data_cache.insert(key.clone(), Instant::now());
                            *completed = true;

                            if let Some(target) = self.target_screen.take()
                            {
                                self.current_screen = target;
                                self.loading_screen = None;
                                self.header.update(Message::SetScreen(target))?;
                            }
                        }
                        | Err(e) =>
                        {
                            error!("Background task failed: {}", e);
                            self.status_bar.update(StatusBarMsg::Error(format!(
                                "Failed to load data: {}",
                                e
                            )))?;
                            *completed = true;
                        }
                    }
                }
            }
        }

        // Clean up completed tasks
        self.background_tasks
            .retain(|_, (_, completed)| !*completed);

        Ok(())
    }

    pub async fn run(&mut self) -> Result<()>
    {
        enable_raw_mode().into_diagnostic()?;
        execute!(stdout(), EnterAlternateScreen).into_diagnostic()?;

        loop
        {
            self.render()?;
            self.check_background_tasks().await?;

            if crossterm_event::poll(Duration::from_millis(250)).into_diagnostic()?
            {
                let event = crossterm_event::read().into_diagnostic()?;

                // Handle quit key, but not when editing in the create ingestion form
                if let Event::Key(key_event) = event
                {
                    if key_event.code == KeyCode::Char('q')
                    {
                        match self.current_screen
                        {
                            | Screen::CreateIngestion =>
                            {
                                // Only quit if we're not in edit mode
                                if let Some(msg) = self
                                    .create_ingestion
                                    .handle_event(AppEvent::Key(key_event))?
                                {
                                    self.update(msg).await?;
                                }
                                continue;
                            }
                            | _ => break,
                        }
                    }
                }
                if let Event::Key(KeyEvent {
                    code: KeyCode::Char('?'),
                    ..
                }) = event
                {
                    self.show_help = !self.show_help;
                    if self.show_help
                    {
                        self.help_page.set_focus(true);
                    }
                    else
                    {
                        self.help_page.set_focus(false);
                    }
                    continue;
                }

                if self.show_help
                {
                    if let Event::Key(key) = event
                    {
                        match key.code
                        {
                            | KeyCode::Esc | KeyCode::Char('?') =>
                            {
                                self.show_help = false;
                                self.help_page.set_focus(false);
                            }
                            | _ =>
                            {
                                let _ = self.help_page.handle_event(event);
                            }
                        }
                    }
                    continue;
                }

                match event
                {
                    | Event::Key(key) =>
                    {
                        // Handle numeric input in create ingestion form first
                        if self.current_screen == Screen::CreateIngestion
                        {
                            if let Some(msg) =
                                self.create_ingestion.handle_event(AppEvent::Key(key))?
                            {
                                self.update(msg).await?;
                            }
                            continue;
                        }

                        // Then check if the header wants to handle this event
                        if let Some(msg) = self.header.handle_event(event)?
                        {
                            match msg
                            {
                                | Message::SetScreen(screen) =>
                                {
                                    self.update_screen(screen).await?;
                                }
                                | Message::Noop =>
                                {}
                            }
                            continue;
                        }

                        // Then handle screen-specific events
                        match self.current_screen
                        {
                            | Screen::ListIngestions => match key.code
                            {
                                | KeyCode::Char('j') | KeyCode::Down =>
                                {
                                    self.ingestion_list.next();
                                }
                                | KeyCode::Char('k') | KeyCode::Up =>
                                {
                                    self.ingestion_list.previous();
                                }
                                | KeyCode::Char('l') | KeyCode::Right | KeyCode::Enter =>
                                {
                                    if let Some(ingestion) =
                                        self.ingestion_list.selected_ingestion()
                                    {
                                        if let Some(id) = ingestion.id
                                        {
                                            block_on(async {
                                                self.ingestion_details
                                                    .load_ingestion(id.to_string())
                                                    .await
                                                    .map_err(|e| {
                                                        miette::miette!(
                                                            "Failed to load ingestion: {}",
                                                            e
                                                        )
                                                    })
                                            })?;
                                            self.update_screen(Screen::ViewIngestion).await?;
                                        }
                                    }
                                }
                                | KeyCode::Char('n') =>
                                {
                                    self.update_screen(Screen::CreateIngestion).await?;
                                }
                                | _ =>
                                {}
                                | KeyCode::Char('j') | KeyCode::Down =>
                                {
                                    self.ingestion_list.next();
                                }
                                | KeyCode::Char('k') | KeyCode::Up =>
                                {
                                    self.ingestion_list.previous();
                                }
                                | KeyCode::Char('l') | KeyCode::Right | KeyCode::Enter =>
                                {
                                    if let Some(ingestion) =
                                        self.ingestion_list.selected_ingestion()
                                    {
                                        if let Some(id) = ingestion.id
                                        {
                                            self.ingestion_details
                                                .load_ingestion(id.to_string())
                                                .await
                                                .map_err(|e| {
                                                    miette::miette!(
                                                        "Failed to load ingestion: {}",
                                                        e
                                                    )
                                                })?;
                                            self.update_screen(Screen::ViewIngestion).await?;
                                        }
                                    }
                                }
                                | KeyCode::Char('n') =>
                                {
                                    self.update_screen(Screen::CreateIngestion).await?;
                                }
                                | _ =>
                                {}
                            },
                            | Screen::ViewIngestion => match key.code
                            {
                                | KeyCode::Char('h') | KeyCode::Left | KeyCode::Esc =>
                                {
                                    self.update_screen(Screen::ListIngestions).await?;
                                }
                                | _ =>
                                {}
                            },
                            | Screen::CreateIngestion =>
                            {
                                // Handle create ingestion form events
                                if let Some(msg) =
                                    self.create_ingestion.handle_event(AppEvent::Key(key))?
                                {
                                    self.update(msg).await?;
                                }
                            }
                            | Screen::ViewIngestion => match key.code
                            {
                                | KeyCode::Char('h') | KeyCode::Left | KeyCode::Esc =>
                                {
                                    self.update_screen(Screen::ListIngestions).await?;
                                }
                                | _ =>
                                {}
                            },
                            | Screen::CreateIngestion =>
                            {
                                // Handle create ingestion form events
                                if let Some(msg) =
                                    self.create_ingestion.handle_event(AppEvent::Key(key))?
                                {
                                    self.update(msg).await?;
                                }
                            }
                            | _ =>
                            {}
                        }
                    }
                    | _ =>
                    {}
                }
            }

            if self.last_tick.elapsed() >= Duration::from_secs(1)
            {
                self.event_handler.push(AppEvent::Tick);
                self.last_tick = Instant::now();
            }
        }

        disable_raw_mode().into_diagnostic()?;
        execute!(stdout(), LeaveAlternateScreen).into_diagnostic()?;

        Ok(())
    }

    pub async fn update(&mut self, message: AppMessage) -> miette::Result<()>
    {
        match message
        {
            | AppMessage::Quit =>
            {}
            | AppMessage::NavigateToPage(screen) =>
            {
                // After creating an ingestion, we want to refresh the list
                if screen == Screen::ListIngestions
                    && self.current_screen == Screen::CreateIngestion
                {
                    // Force a refresh by removing from cache
                    self.data_cache.remove("ingestion_list");
                }
                self.update_screen(screen).await?;
            }
            | AppMessage::SelectNext => match self.current_screen
            {
                | Screen::ListIngestions => self.ingestion_list.next(),
                | _ =>
                {}
            },
            | AppMessage::SelectPrevious => match self.current_screen
            {
                | Screen::ListIngestions => self.ingestion_list.previous(),
                | _ =>
                {}
            },
            | AppMessage::SelectNext => match self.current_screen
            {
                | Screen::ListIngestions => self.ingestion_list.next(),
                | _ =>
                {}
            },
            | AppMessage::SelectPrevious => match self.current_screen
            {
                | Screen::ListIngestions => self.ingestion_list.previous(),
                | _ =>
                {}
            },
            | AppMessage::LoadData =>
            {
                // Force a refresh by removing from cache
                self.data_cache.remove("ingestion_list");
                self.update_screen(Screen::ListIngestions).await?;
            }
            | AppMessage::CreateIngestion =>
            {
                self.update_screen(Screen::CreateIngestion).await?;
            }
            | AppMessage::CreateIngestion =>
            {
                self.update_screen(Screen::CreateIngestion).await?;
            }
            | _ =>
            {}
        }

        Ok(())
    }
}
