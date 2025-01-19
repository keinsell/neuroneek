use crate::ingestion::command::LogIngestion;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::tui::core::Component;
use crate::tui::core::Renderable;
use crate::tui::events::AppEvent;
use crate::tui::events::AppMessage;
use crate::tui::events::Screen;
use crate::tui::theme::Theme;
use chrono::DateTime;
use chrono::Local;
use crossterm::event::KeyCode;
use crossterm::event::KeyModifiers;
use futures::executor::block_on;
use miette::Result;
use ratatui::layout::Constraint;
use ratatui::layout::Direction;
use ratatui::layout::Layout;
use ratatui::layout::Rect;
use ratatui::style::Modifier;
use ratatui::style::Style;
use ratatui::text::Line;
use ratatui::text::Span;
use ratatui::widgets::Block;
use ratatui::widgets::BorderType;
use ratatui::widgets::Borders;
use ratatui::widgets::Clear;
use ratatui::widgets::List;
use ratatui::widgets::ListItem;
use ratatui::widgets::ListState;
use ratatui::widgets::Paragraph;
use ratatui::Frame;
use ratatui_textarea::TextArea;
use regex::Regex;
use sea_orm::EntityTrait;
use std::str::FromStr;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum EditTarget
{
    SubstanceName,
    Dosage,
    RouteOfAdministration,
    Date,
    SaveButton,
    CancelButton,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum FormMode
{
    View,
    Edit(EditTarget),
}

#[derive(Clone)]
pub struct FormData
{
    pub substance_name: String,
    pub dosage_text: String,
    pub parsed_dosage: Option<Dosage>,
    pub date_text: String,
    pub parsed_date: Option<DateTime<Local>>,
    pub route_of_administration: RouteOfAdministrationClassification,
}

impl Default for FormData
{
    fn default() -> Self
    {
        Self {
            substance_name: String::new(),
            dosage_text: String::new(),
            parsed_dosage: None,
            date_text: String::from("now"),
            parsed_date: Some(Local::now()),
            route_of_administration: RouteOfAdministrationClassification::Oral,
        }
    }
}

#[derive(Clone)]
pub struct CreateIngestionState
{
    mode: FormMode,
    form_data: FormData,
    highlighted_field: EditTarget,
    edit_buffer: TextArea<'static>,
    route_dropdown_visible: bool,
    route_list_state: ListState,
    error_message: Option<String>,
    field_in_error: Option<EditTarget>,
    show_help: bool,
}

const ROUTES: &[RouteOfAdministrationClassification] = &[
    RouteOfAdministrationClassification::Oral,
    RouteOfAdministrationClassification::Inhaled,
    RouteOfAdministrationClassification::Insufflated,
    RouteOfAdministrationClassification::Sublingual,
    RouteOfAdministrationClassification::Buccal,
    RouteOfAdministrationClassification::Rectal,
    RouteOfAdministrationClassification::Smoked,
    RouteOfAdministrationClassification::Transdermal,
    RouteOfAdministrationClassification::Intravenous,
    RouteOfAdministrationClassification::Intramuscular,
];

impl Default for CreateIngestionState
{
    fn default() -> Self
    {
        let mut route_list_state = ListState::default();
        route_list_state.select(Some(0));

        Self {
            mode: FormMode::View,
            form_data: FormData::default(),
            highlighted_field: EditTarget::SubstanceName,
            edit_buffer: TextArea::default(),
            route_dropdown_visible: false,
            route_list_state,
            error_message: None,
            field_in_error: None,
            show_help: false,
        }
    }
}

fn preprocess_dosage_input(input: &str) -> String
{
    let re = Regex::new(r"^(\d+(?:\.\d+)?)([a-zA-Z]+)$").unwrap();
    if let Some(cap) = re.captures(input.trim())
    {
        return format!("{} {}", &cap[1], &cap[2]);
    }
    input.to_owned()
}

impl CreateIngestionState
{
    pub fn new() -> Self { Self::default() }

    fn try_save_ingestion(&mut self) -> Result<Option<AppMessage>>
    {
        if let Some(ingestion) = self.try_create_ingestion()
        {
            if let Err(e) = block_on(async {
                let active_model = crate::database::entities::ingestion::ActiveModel {
                    id: sea_orm::ActiveValue::NotSet,
                    substance_name: sea_orm::ActiveValue::Set(
                        ingestion.substance_name.to_lowercase(),
                    ),
                    route_of_administration: sea_orm::ActiveValue::Set(
                        serde_json::to_value(&ingestion.route_of_administration)
                            .unwrap()
                            .as_str()
                            .unwrap()
                            .to_string(),
                    ),
                    dosage: sea_orm::ActiveValue::Set(ingestion.dosage.as_base_units() as f32),
                    ingested_at: sea_orm::ActiveValue::Set(ingestion.ingestion_date.naive_utc()),
                    updated_at: sea_orm::ActiveValue::Set(chrono::Local::now().naive_utc()),
                    created_at: sea_orm::ActiveValue::Set(chrono::Local::now().naive_utc()),
                };
                crate::database::entities::ingestion::Entity::insert(active_model)
                    .exec(&*crate::utils::DATABASE_CONNECTION)
                    .await
            })
            {
                self.error_message = Some(format!("Failed to save ingestion: {}", e));
                return Ok(None);
            }
            return Ok(Some(AppMessage::NavigateToPage(Screen::ListIngestions)));
        }
        Ok(None)
    }

    pub fn handle_event(&mut self, event: AppEvent) -> Result<Option<AppMessage>>
    {
        match event
        {
            | AppEvent::Key(key_event) =>
            {
                if key_event.modifiers == KeyModifiers::CONTROL
                    && key_event.code == KeyCode::Char('h')
                {
                    self.show_help = !self.show_help;
                    return Ok(None);
                }

                if self.show_help
                {
                    if key_event.code == KeyCode::Esc
                    {
                        self.show_help = false;
                    }
                    return Ok(None);
                }

                match self.mode
                {
                    | FormMode::View => match key_event.code
                    {
                        | KeyCode::Esc =>
                        {
                            return Ok(Some(AppMessage::NavigateToPage(Screen::ListIngestions)));
                        }
                        | KeyCode::Enter => match self.highlighted_field
                        {
                            | EditTarget::SaveButton =>
                            {
                                return self.try_save_ingestion();
                            }
                            | EditTarget::CancelButton =>
                            {
                                return Ok(Some(AppMessage::NavigateToPage(
                                    Screen::ListIngestions,
                                )));
                            }
                            | _ =>
                            {
                                self.mode = FormMode::Edit(self.highlighted_field);
                                match self.highlighted_field
                                {
                                    | EditTarget::SubstanceName =>
                                    {
                                        self.edit_buffer = TextArea::default();
                                        self.edit_buffer.insert_str(&self.form_data.substance_name);
                                    }
                                    | EditTarget::Dosage =>
                                    {
                                        self.edit_buffer = TextArea::default();
                                        self.edit_buffer.insert_str(&self.form_data.dosage_text);
                                    }
                                    | EditTarget::RouteOfAdministration =>
                                    {
                                        self.route_dropdown_visible = true;
                                        if let Some(idx) = ROUTES.iter().position(|&r| {
                                            r == self.form_data.route_of_administration
                                        })
                                        {
                                            self.route_list_state.select(Some(idx));
                                        }
                                    }
                                    | EditTarget::Date =>
                                    {
                                        self.edit_buffer = TextArea::default();
                                        self.edit_buffer.insert_str(&self.form_data.date_text);
                                    }
                                    | _ =>
                                    {}
                                }
                            }
                        },
                        | KeyCode::Down | KeyCode::Tab =>
                        {
                            self.next_field();
                        }
                        | KeyCode::Up | KeyCode::BackTab =>
                        {
                            self.previous_field();
                        }
                        | KeyCode::Char('s') if key_event.modifiers == KeyModifiers::CONTROL =>
                        {
                            return self.try_save_ingestion();
                        }
                        | _ =>
                        {}
                    },
                    | FormMode::Edit(target) =>
                    {
                        if self.route_dropdown_visible
                        {
                            match key_event.code
                            {
                                | KeyCode::Esc =>
                                {
                                    self.route_dropdown_visible = false;
                                    self.mode = FormMode::View;
                                }
                                | KeyCode::Enter =>
                                {
                                    if let Some(idx) = self.route_list_state.selected()
                                    {
                                        self.form_data.route_of_administration = ROUTES[idx];
                                    }
                                    self.route_dropdown_visible = false;
                                    self.mode = FormMode::View;
                                    self.next_field();
                                }
                                | KeyCode::Up =>
                                {
                                    if let Some(idx) = self.route_list_state.selected()
                                    {
                                        if idx > 0
                                        {
                                            self.route_list_state.select(Some(idx - 1));
                                        }
                                    }
                                }
                                | KeyCode::Down =>
                                {
                                    if let Some(idx) = self.route_list_state.selected()
                                    {
                                        if idx < ROUTES.len() - 1
                                        {
                                            self.route_list_state.select(Some(idx + 1));
                                        }
                                    }
                                }
                                | _ =>
                                {}
                            }
                        }
                        else
                        {
                            match key_event.code
                            {
                                | KeyCode::Esc =>
                                {
                                    self.mode = FormMode::View;
                                }
                                | KeyCode::Enter =>
                                {
                                    let input = self.edit_buffer.lines().join("");
                                    match target
                                    {
                                        | EditTarget::SubstanceName =>
                                        {
                                            if !input.trim().is_empty()
                                            {
                                                self.form_data.substance_name = input;
                                                self.mode = FormMode::View;
                                                self.field_in_error = None;
                                                self.next_field();
                                            }
                                            else
                                            {
                                                self.error_message = Some(
                                                    "Substance name cannot be empty".to_string(),
                                                );
                                                self.field_in_error =
                                                    Some(EditTarget::SubstanceName);
                                            }
                                        }
                                        | EditTarget::Dosage =>
                                        {
                                            let processed = preprocess_dosage_input(&input);
                                            match Dosage::from_str(&processed)
                                            {
                                                | Ok(dosage) =>
                                                {
                                                    self.form_data.dosage_text = input;
                                                    self.form_data.parsed_dosage = Some(dosage);
                                                    self.mode = FormMode::View;
                                                    self.field_in_error = None;
                                                    self.next_field();
                                                }
                                                | Err(_) =>
                                                {
                                                    self.error_message =
                                                        Some("Invalid dosage format".to_string());
                                                    self.field_in_error = Some(EditTarget::Dosage);
                                                }
                                            }
                                        }
                                        | EditTarget::Date =>
                                        {
                                            if input == "now"
                                            {
                                                self.form_data.date_text = input;
                                                self.form_data.parsed_date = Some(Local::now());
                                                self.mode = FormMode::View;
                                                self.field_in_error = None;
                                                self.next_field();
                                            }
                                            else
                                            {
                                                match chrono_english::parse_date_string(
                                                    &input,
                                                    Local::now(),
                                                    chrono_english::Dialect::Us,
                                                )
                                                {
                                                    | Ok(date) =>
                                                    {
                                                        self.form_data.date_text = input;
                                                        self.form_data.parsed_date = Some(date);
                                                        self.mode = FormMode::View;
                                                        self.field_in_error = None;
                                                        self.next_field();
                                                    }
                                                    | Err(_) =>
                                                    {
                                                        self.error_message =
                                                            Some("Invalid date format".to_string());
                                                        self.field_in_error =
                                                            Some(EditTarget::Date);
                                                    }
                                                }
                                            }
                                        }
                                        | _ =>
                                        {}
                                    }
                                }
                                | KeyCode::Char(c) =>
                                {
                                    self.edit_buffer.insert_char(c);
                                }
                                | KeyCode::Backspace =>
                                {
                                    self.edit_buffer.delete_char();
                                }
                                | _ =>
                                {}
                            }
                        }
                    }
                }
            }
            | _ =>
            {}
        }
        Ok(None)
    }

    fn try_create_ingestion(&self) -> Option<LogIngestion>
    {
        if self.form_data.substance_name.trim().is_empty()
        {
            return None;
        }

        let dosage = self.form_data.parsed_dosage.clone()?;
        let date = self.form_data.parsed_date?;

        Some(LogIngestion {
            substance_name: self.form_data.substance_name.clone(),
            dosage,
            ingestion_date: date,
            route_of_administration: self.form_data.route_of_administration,
        })
    }

    fn next_field(&mut self)
    {
        self.highlighted_field = match self.highlighted_field
        {
            | EditTarget::SubstanceName => EditTarget::Dosage,
            | EditTarget::Dosage => EditTarget::RouteOfAdministration,
            | EditTarget::RouteOfAdministration => EditTarget::Date,
            | EditTarget::Date => EditTarget::SaveButton,
            | EditTarget::SaveButton => EditTarget::CancelButton,
            | EditTarget::CancelButton => EditTarget::SubstanceName,
        };
    }

    fn previous_field(&mut self)
    {
        self.highlighted_field = match self.highlighted_field
        {
            | EditTarget::SubstanceName => EditTarget::CancelButton,
            | EditTarget::Dosage => EditTarget::SubstanceName,
            | EditTarget::RouteOfAdministration => EditTarget::Dosage,
            | EditTarget::Date => EditTarget::RouteOfAdministration,
            | EditTarget::SaveButton => EditTarget::Date,
            | EditTarget::CancelButton => EditTarget::SaveButton,
        };
    }
}

impl Component for CreateIngestionState {}

impl Renderable for CreateIngestionState
{
    fn render(&self, area: Rect, frame: &mut Frame) -> Result<()>
    {
        let chunks = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Min(10),   // Form
                Constraint::Length(3), // Action buttons
                Constraint::Length(1), // Error message
            ])
            .split(area);

        let form_layout = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Length(3), // Substance
                Constraint::Length(3), // Dosage
                Constraint::Length(3), // ROA
                Constraint::Length(3), // Date
            ])
            .margin(1)
            .split(chunks[0]);

        self.render_field(
            frame,
            form_layout[0],
            EditTarget::SubstanceName,
            "Substance",
            &self.form_data.substance_name,
            "Enter substance name",
        );

        self.render_field(
            frame,
            form_layout[1],
            EditTarget::Dosage,
            "Dosage",
            if self.form_data.dosage_text.is_empty()
            {
                "Enter amount (e.g., 10mg, 0.5g)"
            }
            else
            {
                &self.form_data.dosage_text
            },
            "Enter dosage with units",
        );

        self.render_field(
            frame,
            form_layout[2],
            EditTarget::RouteOfAdministration,
            "Route",
            &self.form_data.route_of_administration.to_string(),
            "Select administration route",
        );

        self.render_field(
            frame,
            form_layout[3],
            EditTarget::Date,
            "When",
            &self.form_data.date_text,
            "'now' or time (e.g., today 2pm)",
        );

        self.render_action_buttons(frame, chunks[1]);

        if let Some(error) = &self.error_message
        {
            frame.render_widget(
                Paragraph::new(error.as_str())
                    .style(Style::default().fg(Theme::ERROR))
                    .alignment(ratatui::layout::Alignment::Center),
                chunks[2],
            );
        }

        if self.route_dropdown_visible
        {
            let popup_area = centered_rect(30, 50, area);
            frame.render_widget(Clear, popup_area);

            let items: Vec<ListItem> = ROUTES
                .iter()
                .enumerate()
                .map(|(i, route)| {
                    let is_selected = Some(i) == self.route_list_state.selected();
                    let style = if is_selected
                    {
                        Style::default().fg(Theme::TEXT).bg(Theme::SURFACE1)
                    }
                    else
                    {
                        Style::default().fg(Theme::TEXT)
                    };
                    ListItem::new(route.to_string()).style(style)
                })
                .collect();

            let list = List::new(items)
                .block(
                    Block::default()
                        .title("Select Route")
                        .borders(Borders::ALL)
                        .border_style(Style::default().fg(Theme::MAUVE)),
                )
                .highlight_style(Style::default().bg(Theme::SURFACE1));

            frame.render_stateful_widget(list, popup_area, &mut self.route_list_state.clone());
        }

        if let FormMode::Edit(target) = self.mode
        {
            if !self.route_dropdown_visible
            {
                let popup_area = centered_rect(40, 20, area);
                frame.render_widget(Clear, popup_area);

                let title = match target
                {
                    | EditTarget::SubstanceName => "Edit Substance Name",
                    | EditTarget::Dosage => "Edit Dosage",
                    | EditTarget::Date => "Edit Date",
                    | _ => "",
                };

                let input = Paragraph::new(self.edit_buffer.lines().join(""))
                    .block(
                        Block::default()
                            .title(title)
                            .borders(Borders::ALL)
                            .border_style(Style::default().fg(Theme::MAUVE)),
                    )
                    .style(Style::default().fg(Theme::TEXT));

                frame.render_widget(input, popup_area);
            }
        }

        Ok(())
    }
}

impl CreateIngestionState
{
    fn render_field(
        &self,
        frame: &mut Frame,
        area: Rect,
        field_id: EditTarget,
        label: &str,
        value: &str,
        hint: &str,
    )
    {
        let border_color = if Some(field_id) == self.field_in_error
        {
            Theme::ERROR
        }
        else if self.highlighted_field == field_id
        {
            Theme::MAUVE
        }
        else
        {
            Theme::BORDER
        };

        let block = Block::default()
            .borders(Borders::ALL)
            .border_style(Style::default().fg(border_color));

        let inner_area = block.inner(area);
        frame.render_widget(block, area);

        let text = vec![Line::from(vec![
            Span::styled(
                format!("{}: ", label),
                Style::default().fg(
                    if self.highlighted_field == field_id
                    {
                        Theme::MAUVE
                    }
                    else
                    {
                        Theme::TEXT
                    },
                ),
            ),
            Span::styled(
                if value.is_empty() { hint } else { value },
                if value.is_empty()
                {
                    Style::default()
                        .fg(Theme::OVERLAY0)
                        .add_modifier(Modifier::ITALIC)
                }
                else
                {
                    Style::default().fg(Theme::TEXT)
                },
            ),
        ])];

        frame.render_widget(Paragraph::new(text), inner_area);
    }

    fn render_action_buttons(&self, frame: &mut Frame, area: Rect)
    {
        let button_layout = Layout::default()
            .direction(Direction::Horizontal)
            .constraints([Constraint::Percentage(50), Constraint::Percentage(50)])
            .margin(1)
            .split(area);

        let save_block = Block::default()
            .title(Line::from(vec![
                Span::styled(" Save ", Style::default().fg(Theme::TEXT)),
                Span::styled("(Ctrl+S)", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" ", Style::default()),
            ]))
            .borders(Borders::ALL)
            .border_type(BorderType::Rounded)
            .border_style(
                if self.highlighted_field == EditTarget::SaveButton
                {
                    Style::default().fg(Theme::MAUVE)
                }
                else
                {
                    Style::default().fg(Theme::BORDER)
                },
            );

        let cancel_block = Block::default()
            .title(Line::from(vec![
                Span::styled(" Cancel ", Style::default().fg(Theme::TEXT)),
                Span::styled("(Esc)", Style::default().fg(Theme::OVERLAY0)),
                Span::styled(" ", Style::default()),
            ]))
            .borders(Borders::ALL)
            .border_type(BorderType::Rounded)
            .border_style(
                if self.highlighted_field == EditTarget::CancelButton
                {
                    Style::default().fg(Theme::MAUVE)
                }
                else
                {
                    Style::default().fg(Theme::BORDER)
                },
            );

        frame.render_widget(save_block, button_layout[0]);
        frame.render_widget(cancel_block, button_layout[1]);
    }
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
