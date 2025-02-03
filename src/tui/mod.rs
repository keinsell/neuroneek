mod components;

use crate::analyzer::model::{IngestionAnalysis, IngestionPhase};
use crate::ingestion::model::Ingestion;
use crate::substance::route_of_administration::phase::{PhaseClassification, PHASE_ORDER};
use crate::substance::DurationRange;
use chrono::{DateTime, Duration, Local, Timelike, Utc};
use ratatui::backend::Backend;
use ratatui::layout::{Constraint, Direction, Layout, Rect, Alignment};
use ratatui::style::{Color, Modifier, Style};
use ratatui::text::{Line, Span, Text};
use ratatui::widgets::{Block, Borders, Paragraph, List, ListItem};
use ratatui::Terminal;
use std::io;
use std::time::Duration as StdDuration;
use crate::core::QueryHandler;
use crossterm::{
    event::{self, Event, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::Frame;
use crate::tui::components::intensity_plot::IntensityPlot;

pub struct IngestionTui {
    ingestions: Vec<IngestionAnalysis>,
}

impl IngestionTui {
    pub fn new(ingestions: Vec<IngestionAnalysis>) -> Self {
        Self { ingestions }
    }

    fn ui(&self, frame: &mut Frame) {
        let size = frame.size();

        // Create main vertical layout
        let main_chunks = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Length(3),  // Title
                Constraint::Min(0),     // Main content
                Constraint::Length(3),  // Footer
            ])
            .split(size);

        // Render title
        let title = Paragraph::new(Text::styled(
            "🧬 Neuronek - Active Ingestions Monitor",
            Style::default()
                .fg(Color::Cyan)
                .add_modifier(Modifier::BOLD)
        ))
        .block(Block::default()
            .borders(Borders::ALL)
            .border_style(Style::default().fg(Color::Cyan)));
        frame.render_widget(title, main_chunks[0]);

        // Split main content into left and right sections
        let content_chunks = Layout::default()
            .direction(Direction::Horizontal)
            .constraints([
                Constraint::Percentage(50), // Left side - Ingestion list
                Constraint::Percentage(50), // Right side - Charts
            ])
            .split(main_chunks[1]);

        // Split right section into upper and lower parts
        let right_chunks = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Percentage(50), // Upper chart
                Constraint::Percentage(50), // Lower chart (intensity plot)
            ])
            .split(content_chunks[1]);

        // Render ingestion list (left)
        let ingestion_list = List::new(vec![
            ListItem::new("Ingestion List Placeholder")
        ])
        .block(Block::default()
            .title("Active Ingestions")
            .borders(Borders::ALL));
        frame.render_widget(ingestion_list, content_chunks[0]);

        // Render upper right placeholder
        let placeholder_upper = Paragraph::new("Upper Chart Placeholder")
            .alignment(Alignment::Center)
            .block(Block::default()
                .title("Statistics")
                .borders(Borders::ALL));
        frame.render_widget(placeholder_upper, right_chunks[0]);

        // Render intensity plot (lower right)
        let mut plot = IntensityPlot::new(&self.ingestions);
        frame.render_widget(plot.render(), right_chunks[1]);

        // Render footer
        let footer = Paragraph::new(Text::from(vec![
            Line::from(vec![
                Span::styled("q", Style::default().fg(Color::Yellow)),
                Span::raw(" to quit")
            ])
        ]))
        .alignment(Alignment::Center)
        .block(Block::default().borders(Borders::ALL));
        frame.render_widget(footer, main_chunks[2]);
    }

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
    let ingestions = match crate::ingestion::query::ListIngestion::default().query().await {
        Ok(ingestions) => {
            let mut analyzed_ingestions = Vec::new();
            for ingestion in ingestions {
                match crate::substance::repository::get_substance(&ingestion.substance, &crate::utils::DATABASE_CONNECTION).await {
                    Ok(Some(substance)) => {
                        match crate::analyzer::model::IngestionAnalysis::analyze(ingestion, &substance).await {
                            Ok(analysis) => {
                                analyzed_ingestions.push(analysis);
                            }
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

