use crate::analyzer::model::IngestionAnalysis;
use crate::core::QueryHandler;
use crate::ingestion::ListIngestions;
use crate::substance::repository;
use crate::substance::route_of_administration::phase::PhaseClassification;
use crate::tui::theme::Theme;
use crate::tui::widgets::dosage::dosage_dots;
use crate::utils::DATABASE_CONNECTION;
use chrono;
use chrono_humanize::HumanTime;
use miette::Result;
use ratatui::prelude::Alignment;
use ratatui::prelude::Color;
use ratatui::prelude::Constraint;
use ratatui::prelude::Direction;
use ratatui::prelude::Frame;
use ratatui::prelude::Layout;
use ratatui::prelude::Rect;
use ratatui::prelude::Style;
use ratatui::prelude::*;
use ratatui::widgets::Block;
use ratatui::widgets::BorderType;
use ratatui::widgets::Borders;
use ratatui::widgets::Cell;
use ratatui::widgets::Gauge;
use ratatui::widgets::Paragraph;
use ratatui::widgets::Row;
use ratatui::widgets::Table;
use ratatui::widgets::TableState;
use std::time::Instant;

const SPINNER_FRAMES: [&str; 10] = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

/// State for the ingestion list view, containing the list of ingestions and
/// their analyses, along with the current table selection state.
#[derive(Clone)]
pub struct IngestionListState
{
    /// Vector of tuples containing ingestions and their optional analyses
    ingestions: Vec<(
        crate::ingestion::model::Ingestion,
        Option<IngestionAnalysis>,
    )>,
    /// Current table selection state
    table_state: TableState,
    /// Loading state
    loading_state: LoadingState,
}

/// Loading state for the ingestion list
#[derive(Clone)]
struct LoadingState
{
    is_loading: bool,
    progress: f64,
    message: String,
    start_time: Option<Instant>,
}

impl LoadingState
{
    fn new() -> Self
    {
        Self {
            is_loading: true,
            progress: 0.0,
            message: "Preparing to load ingestions...".to_string(),
            start_time: Some(Instant::now()),
        }
    }
}

impl IngestionListState
{
    /// Creates a new empty ingestion list state
    pub fn new() -> Self
    {
        Self {
            ingestions: Vec::new(),
            table_state: TableState::default(),
            loading_state: LoadingState::new(),
        }
    }

    /// Updates the ingestion list by fetching current data and analyzing each
    /// ingestion
    pub async fn update(&mut self) -> Result<()>
    {
        self.loading_state.message = "Fetching ingestions...".to_string();
        self.loading_state.progress = 0.0;

        let ingestions = ListIngestions::default()
            .query()
            .await
            .map_err(|e| miette::miette!("Failed to fetch ingestions: {}", e))?;
        self.loading_state.progress = 0.2;
        self.loading_state.message = "Analyzing ingestions...".to_string();

        self.ingestions = Vec::new();
        let total_ingestions = ingestions.len();

        for (index, ingestion) in ingestions.into_iter().enumerate()
        {
            self.loading_state.message = format!(
                "Analyzing {} ({}/{})",
                ingestion.substance,
                index + 1,
                total_ingestions
            );
            self.loading_state.progress = 0.2 + (0.8 * (index as f64 / total_ingestions as f64));

            let substance = repository::get_substance(&ingestion.substance, &DATABASE_CONNECTION)
                .await
                .map_err(|e| miette::miette!("Failed to get substance: {}", e))?;

            let analysis = if let Some(substance_data) = substance
            {
                IngestionAnalysis::analyze(ingestion.clone(), substance_data)
                    .await
                    .map_err(|e| miette::miette!("Failed to analyze ingestion: {}", e))?
                    .into()
            }
            else
            {
                None
            };

            self.ingestions.push((ingestion, analysis));
        }

        if !self.ingestions.is_empty()
        {
            self.table_state.select(Some(0));
        }

        self.loading_state.is_loading = false;
        self.loading_state.start_time = None;
        Ok(())
    }

    /// Gets the current spinner frame based on elapsed time
    fn get_spinner_frame(&self) -> &'static str
    {
        if let Some(start_time) = self.loading_state.start_time
        {
            let elapsed = start_time.elapsed().as_millis() as usize;
            let frame_index = (elapsed / 80) % SPINNER_FRAMES.len();
            SPINNER_FRAMES[frame_index]
        }
        else
        {
            SPINNER_FRAMES[0]
        }
    }

    /// Renders the loading screen
    fn render_loading_screen(&self, frame: &mut Frame, area: Rect)
    {
        let loading_area = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Percentage(35),
                Constraint::Length(3),
                Constraint::Length(3),
                Constraint::Length(2),
                Constraint::Percentage(35),
            ])
            .split(area);

        // Title with spinner
        let spinner = self.get_spinner_frame();
        let title = Paragraph::new(format!("{} Loading Ingestions", spinner))
            .alignment(Alignment::Center)
            .style(Style::default().fg(Color::Yellow));
        frame.render_widget(title, loading_area[1]);

        // Progress bar
        let gauge = Gauge::default()
            .block(
                Block::default()
                    .borders(Borders::ALL)
                    .border_type(BorderType::Rounded),
            )
            .gauge_style(Style::default().fg(Color::Yellow))
            .ratio(self.loading_state.progress)
            .label(format!("{:.0}%", self.loading_state.progress * 100.0));
        frame.render_widget(gauge, loading_area[2]);

        // Loading message
        let message = Paragraph::new(self.loading_state.message.clone())
            .alignment(Alignment::Center)
            .style(Style::default().fg(Color::Gray));
        frame.render_widget(message, loading_area[3]);
    }

    /// Renders the ingestion list view
    pub fn view(&mut self, frame: &mut Frame, area: Rect) -> Result<()>
    {
        if self.loading_state.is_loading
        {
            self.render_loading_screen(frame, area);
            return Ok(());
        }

        if self.ingestions.is_empty()
        {
            return self.render_empty_state(frame, area);
        }

        let table_data = self
            .ingestions
            .iter()
            .map(|(ingestion, analysis)| {
                let phase = analysis.as_ref().and_then(|a| a.current_phase);
                let progress = self.calculate_progress(analysis);
                let is_completed = progress >= 1.0;

                let phase_text = self.format_phase_text(phase, is_completed);
                let progress_bar = self.create_progress_bar(phase, is_completed);
                let phase_style = self.get_phase_style(phase, is_completed);
                let row_style = self.get_row_style(is_completed);

                let cells = vec![
                    Cell::from(ingestion.id.unwrap_or(0).to_string()).style(row_style),
                    Cell::from(ingestion.substance.to_string()).style(row_style),
                    Cell::from(ingestion.route.to_string()).style(row_style),
                    Cell::from(self.format_dosage(ingestion, analysis)).style(row_style),
                    Cell::from(Line::from(vec![
                        Span::styled(format!("{} ", phase_text), phase_style),
                        Span::styled(progress_bar, phase_style),
                    ])),
                    Cell::from(HumanTime::from(ingestion.ingestion_date).to_string())
                        .style(row_style),
                ];
                Row::new(cells).bottom_margin(1)
            })
            .collect::<Vec<Row>>();

        let table_area = self.create_margins(area);
        let header = Row::new(
            ["ID", "Substance", "ROA", "Dosage", "Phase", "Time"]
                .iter()
                .map(|h| Cell::from(*h).style(Style::default().fg(Color::Yellow))),
        )
        .style(Style::default())
        .bottom_margin(1);

        frame.render_stateful_widget(
            Table::default()
                .rows(table_data)
                .header(header)
                .widths(&[
                    Constraint::Length(5),
                    Constraint::Length(20),
                    Constraint::Length(10),
                    Constraint::Length(25),
                    Constraint::Length(25),
                    Constraint::Length(20),
                ])
                .highlight_style(
                    Style::default()
                        .add_modifier(Modifier::BOLD)
                        .bg(Color::DarkGray),
                ),
            table_area,
            &mut self.table_state,
        );
        Ok(())
    }

    /// Renders the empty state message when no ingestions exist
    fn render_empty_state(&self, frame: &mut Frame, area: Rect) -> Result<()>
    {
        let no_ingestions = Paragraph::new(vec![
            Line::from(Span::styled(
                "No ingestions found",
                Style::default().fg(Color::Gray),
            )),
            Line::from(Span::styled(
                "Press 'n' to create a new ingestion",
                Style::default().fg(Color::DarkGray),
            )),
        ])
        .alignment(Alignment::Center);
        frame.render_widget(no_ingestions, area);
        Ok(())
    }

    /// Creates margins around the table area
    fn create_margins(&self, area: Rect) -> Rect
    {
        let vertical_margins = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Length(1), // Top margin
                Constraint::Min(0),    // Content
                Constraint::Length(1), // Bottom margin
            ])
            .split(area)[1];

        Layout::default()
            .direction(Direction::Horizontal)
            .constraints([
                Constraint::Length(2), // Left margin
                Constraint::Min(0),    // Content
                Constraint::Length(2), // Right margin
            ])
            .split(vertical_margins)[1]
    }

    /// Calculates the progress of an ingestion
    fn calculate_progress(&self, analysis: &Option<IngestionAnalysis>) -> f64
    {
        analysis
            .as_ref()
            .map(|a| {
                let now = chrono::Local::now();
                let total_duration = a.ingestion_end - a.ingestion_start;
                let elapsed_time = if now < a.ingestion_start
                {
                    chrono::Duration::zero()
                }
                else if now > a.ingestion_end
                {
                    total_duration
                }
                else
                {
                    now - a.ingestion_start
                };
                (elapsed_time.num_seconds() as f64 / total_duration.num_seconds() as f64)
                    .clamp(0.0, 1.0)
            })
            .unwrap_or(0.0)
    }

    /// Formats the phase text based on current state
    fn format_phase_text(&self, phase: Option<PhaseClassification>, is_completed: bool) -> String
    {
        match (phase, is_completed)
        {
            | (Some(p), _) => format!("{:?}", p),
            | (None, true) => "Completed".to_string(),
            | (None, false) => "Unknown".to_string(),
        }
    }

    /// Creates the progress bar based on current phase
    fn create_progress_bar(&self, phase: Option<PhaseClassification>, is_completed: bool)
    -> String
    {
        if is_completed
        {
            return "▰".repeat(5);
        }

        let phase_blocks = match phase
        {
            | Some(PhaseClassification::Onset) => 1,
            | Some(PhaseClassification::Comeup) => 2,
            | Some(PhaseClassification::Peak) => 3,
            | Some(PhaseClassification::Comedown) => 4,
            | Some(PhaseClassification::Afterglow) => 5,
            | Some(PhaseClassification::Unknown) | None => 0,
        };

        "▰".repeat(phase_blocks) + &"▱".repeat(5 - phase_blocks)
    }

    /// Gets the style for the phase text and progress bar
    fn get_phase_style(&self, phase: Option<PhaseClassification>, is_completed: bool) -> Style
    {
        match phase
        {
            | Some(PhaseClassification::Onset) => Style::default().fg(Theme::BLUE),
            | Some(PhaseClassification::Comeup) => Style::default().fg(Theme::GREEN),
            | Some(PhaseClassification::Peak) => Style::default().fg(Theme::RED),
            | Some(PhaseClassification::Comedown) => Style::default().fg(Theme::YELLOW),
            | Some(PhaseClassification::Afterglow) => Style::default().fg(Theme::SUBTEXT0),
            | Some(PhaseClassification::Unknown) => Style::default().fg(Theme::OVERLAY0),
            | None if is_completed => Style::default()
                .fg(Theme::OVERLAY0)
                .add_modifier(Modifier::DIM),
            | None => Style::default().fg(Theme::OVERLAY0),
        }
    }

    /// Gets the style for the entire row
    fn get_row_style(&self, is_completed: bool) -> Style
    {
        if is_completed
        {
            Style::default()
                .fg(Theme::OVERLAY0)
                .add_modifier(Modifier::DIM)
        }
        else
        {
            Style::default()
        }
    }

    /// Formats the dosage text with classification
    fn format_dosage(
        &self,
        ingestion: &crate::ingestion::model::Ingestion,
        analysis: &Option<IngestionAnalysis>,
    ) -> String
    {
        let dosage_classification = analysis.as_ref().and_then(|a| a.dosage_classification);
        match dosage_classification
        {
            | Some(classification) =>
            {
                format!(
                    "{} {}",
                    ingestion.dosage.to_string(),
                    dosage_dots(classification)
                )
            }
            | None => ingestion.dosage.to_string(),
        }
    }

    /// Moves the selection to the next item
    pub fn next(&mut self)
    {
        if !self.ingestions.is_empty()
        {
            let i = match self.table_state.selected()
            {
                | Some(i) =>
                {
                    if i >= self.ingestions.len() - 1
                    {
                        0
                    }
                    else
                    {
                        i + 1
                    }
                }
                | None => 0,
            };
            self.table_state.select(Some(i));
        }
    }

    /// Moves the selection to the previous item
    pub fn previous(&mut self)
    {
        if !self.ingestions.is_empty()
        {
            let i = match self.table_state.selected()
            {
                | Some(i) =>
                {
                    if i == 0
                    {
                        self.ingestions.len() - 1
                    }
                    else
                    {
                        i - 1
                    }
                }
                | None => 0,
            };
            self.table_state.select(Some(i));
        }
    }

    /// Returns the currently selected ingestion
    pub fn selected_ingestion(&self) -> Option<&crate::ingestion::model::Ingestion>
    {
        if self.ingestions.is_empty()
        {
            return None;
        }
        self.table_state
            .selected()
            .and_then(|i| self.ingestions.get(i))
            .map(|(ingestion, _)| ingestion)
    }
}
