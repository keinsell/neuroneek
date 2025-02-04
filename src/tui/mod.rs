mod components;

use crate::analyzer::model::{IngestionAnalysis, IngestionPhase};
use crate::core::foundation::QueryHandler;
use crate::ingestion::model::Ingestion;
use crate::substance::route_of_administration::phase::{PhaseClassification, PHASE_ORDER};
use crate::substance::DurationRange;
use chrono::Local;
use ratatui::backend::Backend;
use ratatui::layout::{Alignment, Constraint, Direction, Layout, Rect};
use ratatui::style::{Color, Style};
use ratatui::text::{Line, Span, Text};
use ratatui::widgets::{Block, Borders, Paragraph};
use ratatui::Terminal;
use std::io;
use crossterm::{
    event::{self, Event, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::Frame;
use crate::tui::components::intensity_plot::IntensityPlot;
// Removed unused components (e.g. visual_stats)

/// IngestionTui contains analyzed ingestion data and is responsible for drawing the dashboard.
pub struct IngestionTui {
    ingestions: Vec<IngestionAnalysis>,
}

impl IngestionTui {
    pub fn new(ingestions: Vec<IngestionAnalysis>) -> Self {
        Self { ingestions }
    }

    // The ui function builds a simplified dashboard layout.
    // It now only displays the dashboard title at the top,
    // the intensity timeline in the main content area,
    // and the footer at the bottom.
    fn ui(&self, frame: &mut Frame) {
        let size = frame.size();
        if size.width < 50 || size.height < 20 {
            let warning = Paragraph::new("Terminal too small!")
                .alignment(Alignment::Center)
                .block(Block::default().borders(Borders::ALL));
            frame.render_widget(warning, size);
            return;
        }

        // Main vertical layout: Title, Main Content, Footer.
        let main_area = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Length(3),    // Title
                Constraint::Min(5),       // Main content
                Constraint::Length(3),    // Footer
            ])
            .margin(1)
            .split(size);

        // Title section
        let title = Paragraph::new("Ingestion Dashboard")
            .alignment(Alignment::Center)
            .block(Block::default().borders(Borders::ALL));
        frame.render_widget(title, main_area[0]);

        // Main content area: use entire width for the Intensity Timeline.
        let content_area = main_area[1];  // no horizontal splitting

        if self.ingestions.is_empty() {
            let placeholder = Paragraph::new("No intensity data available")
                .alignment(Alignment::Center)
                .block(Block::default().borders(Borders::ALL).title("Intensity Timeline"))
                .style(Style::default().fg(Color::Red));
            frame.render_widget(placeholder, content_area);
        } else {
            let mut plot = IntensityPlot::new(&self.ingestions);
            let plot_widget = plot.render()
                .block(Block::default()
                    .title("Intensity Timeline")
                    .title_alignment(Alignment::Center)
                    .borders(Borders::ALL)
                    .border_style(Style::default().fg(Color::Magenta)));
            frame.render_widget(plot_widget, content_area);
        }

        // Footer section
        let footer = Paragraph::new(Text::from(vec![
            Line::from(vec![
                Span::styled("q", Style::default().fg(Color::Yellow)),
                Span::raw(" to quit"),
            ]),
        ]))
        .alignment(Alignment::Center)
        .block(Block::default().borders(Borders::ALL));
        frame.render_widget(footer, main_area[2]);
    }

    // run() sets up raw mode, enters the alternate screen, and runs the render loop.
    pub fn run(&mut self) -> std::io::Result<()> {
        enable_raw_mode()?;
        let mut stdout = io::stdout();
        execute!(stdout, EnterAlternateScreen)?;
        let backend = ratatui::backend::CrosstermBackend::new(stdout);
        let mut terminal = Terminal::new(backend)?;

        let result = self.render_loop(&mut terminal);

        disable_raw_mode()?;
        execute!(terminal.backend_mut(), LeaveAlternateScreen)?;
        terminal.show_cursor()?;
        result
    }

    // render_loop() re-draws the UI and reads key events.
    fn render_loop(&mut self, terminal: &mut Terminal<ratatui::backend::CrosstermBackend<io::Stdout>>) -> std::io::Result<()> {
        loop {
            terminal.draw(|frame| self.ui(frame))?;
            if let Event::Key(key) = event::read()? {
                if matches!(key.code, KeyCode::Char('q') | KeyCode::Esc) {
                    break;
                }
            }
        }
        Ok(())
    }
}

pub async fn tui() -> std::io::Result<()> {
    // Query ingestions (or use fallback empty vector)
    let ingestions = match crate::ingestion::query::ListIngestion::default().query().await {
        Ok(ingestions) => {
            let mut analyzed_ingestions = Vec::new();
            for ingestion in ingestions {
                match crate::substance::repository::get_substance(&ingestion.substance, &crate::utils::DATABASE_CONNECTION).await {
                    Ok(Some(substance)) => {
                        match crate::analyzer::model::IngestionAnalysis::analyze(ingestion, &substance).await {
                            Ok(analysis) => analyzed_ingestions.push(analysis),
                            Err(e) => eprintln!("Failed to analyze ingestion: {}", e),
                        }
                    }
                    Ok(None) => eprintln!("Substance not found for ingestion: {}", ingestion.substance),
                    Err(e) => eprintln!("Error fetching substance: {}", e),
                }
            }
            analyzed_ingestions
        }
        Err(e) => {
            eprintln!("Failed to load ingestions: {}", e);
            Vec::new()
        }
    };

    let mut tui = IngestionTui::new(ingestions);
    tui.run()
}
