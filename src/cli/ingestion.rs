use crate::cli::formatter::Formatter;
use crate::cli::formatter::FormatterVector;
use crate::cli::OutputFormat;
use crate::core::CommandHandler;
use crate::core::QueryHandler;
use crate::database::entities::ingestion;
use crate::database::entities::ingestion::Entity as Ingestion;
use crate::database::entities::ingestion::Model;
use crate::database::entities::ingestion_phase;
use crate::database::entities::ingestion_phase::Entity as IngestionPhase;
use crate::ingestion::command::LogIngestion;
use crate::ingestion::query::AnalyzeIngestion;
use crate::substance::repository::get_substance;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::utils::parse_date_string;
use crate::utils::AppContext;
use crate::utils::DATABASE_CONNECTION;
use async_std::task;
use async_trait::async_trait;
use chrono::DateTime;
use chrono::Duration;
use chrono::Local;
use chrono::TimeZone;
use chrono_humanize::Accuracy;
use chrono_humanize::HumanTime;
use chrono_humanize::Humanize;
use chrono_humanize::Tense;
use clap::Parser;
use clap::Subcommand;
use log::info;
use miette::miette;
use miette::IntoDiagnostic;
use owo_colors::style;
use owo_colors::OwoColorize;
use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use sea_orm::QuerySelect;
use sea_orm_migration::IntoSchemaManagerConnection;
use serde::Deserialize;
use serde::Serialize;
use std::collections::BTreeMap;
use std::fmt::Debug;
use std::fmt::Display;
use std::str::FromStr;
use tabled::Tabled;
use termimad::rgb;
use termimad::MadSkin;
use textplots::Chart;
use textplots::Plot;
use textplots::Shape;
use tracing::event;
use tracing::Level;
use typed_builder::TypedBuilder;
use uuid::Uuid;

#[derive(Debug, Serialize, TypedBuilder)]
pub struct IngestionPhaseViewModel
{
    pub classification: String,
    pub start_time: String,
    pub end_time: String,
    pub duration: String,
}

#[async_trait]
impl CommandHandler for LogIngestion
{
    async fn handle<'a>(&self, context: AppContext<'a>) -> miette::Result<()>
    {
        let substance_name = pubchem::Compound::with_name(&self.substance_name)
            .title()
            .into_diagnostic()
            .unwrap_or(self.substance_name.clone());

        let ingestion = Ingestion::insert(ingestion::ActiveModel {
            id: ActiveValue::default(),
            substance_name: ActiveValue::Set(substance_name.to_lowercase().clone()),
            route_of_administration: ActiveValue::Set(
                serde_json::to_value(self.route_of_administration)
                    .unwrap()
                    .as_str()
                    .unwrap()
                    .to_string(),
            ),
            dosage: ActiveValue::Set(self.dosage.as_base_units() as f32),
            dosage_classification: ActiveValue::NotSet,
            ingested_at: ActiveValue::Set(self.ingestion_date.to_utc().naive_local()),
            updated_at: ActiveValue::Set(Local::now().to_utc().naive_local()),
            created_at: ActiveValue::Set(Local::now().to_utc().naive_local()),
        })
        .exec_with_returning(context.database_connection)
        .await
        .into_diagnostic()?;

        event!(name: "ingestion_logged", Level::INFO, ingestion=?&ingestion);

        let analysis_query = AnalyzeIngestion::builder()
            .substance(self.substance_name.clone())
            .date(self.ingestion_date)
            .dosage(self.dosage)
            .roa(self.route_of_administration)
            .ingestion_id(Some(ingestion.id))
            .build();

        match analysis_query.query().await
        {
            | Ok(analysis) =>
            {
                let mut analysis = analysis;
                analysis.id = Some(ingestion.id);
                println!(
                    "{}",
                    IngestionViewModel::from(analysis.clone()).format(context.stdout_format)
                );

                if analysis.dosage_classification.is_some()
                {
                    let update_model = ingestion::ActiveModel {
                        id: ActiveValue::Set(ingestion.id),
                        dosage_classification: ActiveValue::Set(
                            analysis.dosage_classification.map(|d| d.to_string()),
                        ),
                        ..Default::default()
                    };

                    update_model
                        .update(context.database_connection)
                        .await
                        .into_diagnostic()?;

                    if !analysis.phases.is_empty()
                    {
                        let phase_models = analysis
                            .phases
                            .clone()
                            .into_iter()
                            .map(|phase| ingestion_phase::ActiveModel {
                                id: ActiveValue::Set(Uuid::new_v4().to_string()),
                                ingestion_id: ActiveValue::Set(ingestion.id),
                                classification: ActiveValue::Set(phase.class.to_string()),
                                start_date_min: ActiveValue::Set(
                                    phase.start_time.start.naive_utc(),
                                ),
                                start_date_max: ActiveValue::Set(phase.start_time.end.naive_utc()),
                                end_date_min: ActiveValue::Set(phase.end_time.start.naive_utc()),
                                end_date_max: ActiveValue::Set(phase.end_time.end.naive_utc()),
                                common_dosage_weight: ActiveValue::Set(
                                    self.dosage.as_base_units() as i32
                                ),
                                duration_min: ActiveValue::Set(
                                    phase.duration.start.num_minutes() as i32
                                ),
                                duration_max: ActiveValue::Set(
                                    phase.duration.end.num_minutes() as i32
                                ),
                                notes: ActiveValue::NotSet,
                                created_at: ActiveValue::Set(Local::now().to_string()),
                                updated_at: ActiveValue::Set(Local::now().to_string()),
                            })
                            .collect::<Vec<_>>();

                        IngestionPhase::insert_many(phase_models)
                            .exec(context.database_connection)
                            .await
                            .into_diagnostic()?;

                        event!(
                            name: "ingestion_analyzed",
                            Level::INFO,
                            ingestion = ?&analysis,
                        );
                    }
                }
            }
            | Err(e) =>
            {
                event!(
                    name: "ingestion_analysis_failed",
                    Level::WARN,
                    error = ?e,
                    ingestion_id = ingestion.id
                );
            }
        }

        Ok(())
    }
}

#[derive(Parser, Debug)]
#[command(version, about = "Update an existing ingestion", aliases = vec![ "edit"])]
pub struct UpdateIngestion
{
    /// ID of the ingestion to update
    #[arg(index = 1, value_name = "INGESTION_ID")]
    pub ingestion_identifier: i32,

    /// New name of the substance.rs (optional)
    #[arg(short = 'n', long = "name", value_name = "SUBSTANCE_NAME")]
    pub substance_name: Option<String>,

    /// New dosage (optional, e.g., 20 mg)
    #[arg(short = 'd', long = "dosage", value_name = "DOSAGE", value_parser=Dosage::from_str)]
    pub dosage: Option<Dosage>,

    /// New ingestion date (optional, e.g., "today 10:00")
    #[arg(short = 't', long = "date", value_name = "INGESTION_DATE", value_parser=parse_date_string)]
    pub ingestion_date: Option<DateTime<Local>>,

    /// New route of administration (optional, defaults to "oral")
    #[arg(short = 'r', long = "roa", value_enum)]
    pub route_of_administration: Option<RouteOfAdministrationClassification>,
}

#[async_trait]
impl CommandHandler for UpdateIngestion
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()>
    {
        if Ingestion::find_by_id(self.ingestion_identifier)
            .one(ctx.database_connection)
            .await
            .into_diagnostic()?
            .is_none()
        {
            return Err(miette!(
                "Ingestion with ID {} not found",
                self.ingestion_identifier
            ));
        }

        let updated_model = ingestion::ActiveModel {
            id: ActiveValue::Set(self.ingestion_identifier),
            substance_name: self
                .substance_name
                .as_ref()
                .map(|name| ActiveValue::Set(name.clone()))
                .unwrap_or(ActiveValue::NotSet),
            dosage: self
                .dosage
                .as_ref()
                .map(|dosage| ActiveValue::Set(dosage.as_base_units() as f32))
                .unwrap_or(ActiveValue::NotSet),
            route_of_administration: self
                .route_of_administration
                .as_ref()
                .map(|roa| ActiveValue::Set(serde_json::to_string(roa).unwrap()))
                .unwrap_or(ActiveValue::NotSet),
            ingested_at: self
                .ingestion_date
                .as_ref()
                .map(|date| ActiveValue::Set(date.to_utc().naive_local()))
                .unwrap_or(ActiveValue::NotSet),
            updated_at: ActiveValue::Set(Local::now().to_utc().naive_local()),
            ..Default::default()
        };

        let updated_record = updated_model
            .update(ctx.database_connection)
            .await
            .into_diagnostic()?;

        info!(
            "Successfully updated ingestion with ID {}.",
            self.ingestion_identifier
        );

        println!(
            "{}",
            IngestionViewModel::from(updated_record).format(ctx.stdout_format)
        );

        Ok(())
    }
}

#[derive(Parser, Debug)]
#[command(version, about = "List all ingestions", long_about, aliases = vec!["ls", "get"])]
pub struct ListIngestion
{
    /// Defines the amount of ingestion to display
    #[arg(short = 'l', long, default_value_t = 10)]
    pub limit: u64,
}

#[async_trait]
impl CommandHandler for ListIngestion
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()>
    {
        let ingestions = Ingestion::find()
            .order_by_desc(ingestion::Column::IngestedAt)
            .limit(Some(self.limit))
            .all(ctx.database_connection)
            .await
            .map_err(|e| e.to_string())
            .unwrap()
            .iter()
            .map(|i| IngestionViewModel::from(i.clone()))
            .collect();

        println!(
            "{}",
            FormatterVector::new(ingestions).format(ctx.stdout_format)
        );

        Ok(())
    }
}

#[derive(Parser, Debug)]
#[command(version, about = "Delete selected ingestion", long_about, aliases = vec!["rm", "del",
                                                                                   "remove"])]
pub struct DeleteIngestion
{
    #[arg(
        index = 1,
        value_name = "INGESTION_ID",
        help = "ID of the ingestion to delete"
    )]
    pub ingestion_id: i32,
}

#[async_trait]
impl CommandHandler for DeleteIngestion
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()>
    {
        let delete_ingestion = Ingestion::delete_by_id(self.ingestion_id)
            .exec(ctx.database_connection)
            .await;

        if delete_ingestion.is_err()
        {
            return Err(miette!(
                "Failed to delete ingestion: {}",
                &delete_ingestion.unwrap_err()
            ));
        }

        info!(
            "Successfully deleted ingestion with ID {}.",
            self.ingestion_id
        );

        Ok(())
    }
}

#[derive(Debug, Subcommand)]
pub enum IngestionCommands
{
    Log(LogIngestion),
    List(ListIngestion),
    Delete(DeleteIngestion),
    Update(UpdateIngestion),
}

#[derive(Debug, Parser)]
pub struct IngestionCommand
{
    #[command(subcommand)]
    commands: IngestionCommands,
}

#[async_trait]
impl CommandHandler for IngestionCommand
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()>
    {
        match &self.commands
        {
            | IngestionCommands::Log(log_ingestion) => log_ingestion.handle(ctx).await,
            | IngestionCommands::List(list_ingestions) => list_ingestions.handle(ctx).await,
            | IngestionCommands::Delete(delete_ingestion) => delete_ingestion.handle(ctx).await,
            | IngestionCommands::Update(update_ingestion) => update_ingestion.handle(ctx).await,
        }
    }
}

fn display_date(date: &DateTime<Local>) -> String { HumanTime::from(*date).to_string() }

#[derive(Debug, Serialize, Tabled, TypedBuilder)]
pub struct IngestionViewModel
{
    #[tabled(rename = "ID")]
    pub id: i32,
    #[tabled(rename = "Substance")]
    pub substance_name: String,
    #[tabled(rename = "ROA")]
    pub route: String,
    #[tabled(rename = "Dosage")]
    pub dosage: String,
    #[tabled(rename = "Ingestion Date")]
    #[tabled(display_with = "display_date")]
    pub ingested_at: DateTime<Local>,
    #[tabled(rename = "Dosage Classification")]
    pub dosage_classification: String,
    #[tabled(skip)]
    pub phases: Vec<IngestionPhaseViewModel>,
}

impl Formatter for IngestionViewModel
{
    fn pretty(&self) -> String
    {
        let mut skin = MadSkin::default_dark();
        skin.set_fg(rgb(205, 214, 244));
        skin.bold.set_fg(rgb(166, 227, 161));
        skin.italic.set_fg(rgb(250, 179, 135));
        skin.headers[0].set_fg(rgb(198, 160, 246));
        skin.headers[1].set_fg(rgb(245, 224, 220));
        skin.headers[2].set_fg(rgb(242, 205, 205));
        skin.paragraph.set_fg(rgb(198, 208, 245));

        let mut md = String::new();

        md.push_str(&format!("# Ingestion #{}\n", self.id));
        md.push_str(&format!("**Substance**: {}\n", self.substance_name));
        md.push_str(&format!("**Route of Administration**: {}\n", self.route));
        md.push_str(&format!(
            "**Dosage**: {} ({})\n",
            self.dosage, self.dosage_classification
        ));

        let time_since = HumanTime::from(self.ingested_at);
        md.push_str(&format!(
            "**Ingested**: {} ({})\n\n",
            self.ingested_at.format("%Y-%m-%d %H:%M:%S"),
            time_since.to_string()
        ));

        if !self.phases.is_empty()
        {
            md.push_str(&format!("## Ingestion's Phases\n\n"));

            for phase in &self.phases
            {
                let phase_icon = match phase.classification.as_str()
                {
                    | "Onset" => "─",
                    | "Comeup" => "△",
                    | "Peak" => "◆",
                    | "Comedown" => "▽",
                    | "Afterglow" => "○",
                    | _ => "•",
                };
                md.push_str(&format!("### {} {}\n", phase_icon, phase.classification));

                let duration_mins = phase
                    .duration
                    .trim_end_matches(" minutes")
                    .parse::<i64>()
                    .unwrap_or(0);
                let duration_formatted = if duration_mins >= 60
                {
                    format!("{:02}h {:02}m", duration_mins / 60, duration_mins % 60)
                }
                else
                {
                    format!("{}m", duration_mins)
                };

                md.push_str(&format!("- **Duration**: {}\n", duration_formatted));
                md.push_str(&format!("- **Start**: {}\n", phase.start_time));
                md.push_str(&format!("- **End**: {}\n", phase.end_time));
            }
        }

        skin.text(&md, None).to_string()
    }
}

impl From<Model> for IngestionViewModel
{
    fn from(model: Model) -> Self
    {
        let dosage = Dosage::from_base_units(model.dosage.into());
        let route_enum: RouteOfAdministrationClassification =
            model.route_of_administration.parse().unwrap_or_default();
        let local_ingestion_date = Local::from_utc_datetime(&Local, &model.ingested_at);

        Self::builder()
            .id(model.id)
            .substance_name(model.substance_name)
            .route(RouteOfAdministrationClassification::to_string(&route_enum))
            .dosage(dosage.to_string())
            .ingested_at(local_ingestion_date)
            .dosage_classification(
                model
                    .dosage_classification
                    .map_or("n/a".to_string(), |c| c.to_string()),
            )
            .phases(vec![])
            .build()
    }
}

impl From<crate::ingestion::model::Ingestion> for IngestionViewModel
{
    fn from(model: crate::ingestion::model::Ingestion) -> Self
    {
        let dosage = model.dosage;
        let route_enum = model.route;

        let phases = model
            .phases
            .into_iter()
            .map(|phase| {
                IngestionPhaseViewModel::builder()
                    .classification(phase.class.to_string())
                    .start_time(
                        phase
                            .start_time
                            .start
                            .format("%Y-%m-%d %H:%M:%S")
                            .to_string(),
                    )
                    .end_time(phase.end_time.start.format("%Y-%m-%d %H:%M:%S").to_string())
                    .duration(format!("{} minutes", phase.duration.start.num_minutes()))
                    .build()
            })
            .collect();

        Self::builder()
            .id(model.id.unwrap_or(0))
            .substance_name(model.substance_name)
            .route(RouteOfAdministrationClassification::to_string(&route_enum))
            .dosage(dosage.to_string())
            .ingested_at(model.ingestion_date)
            .dosage_classification(
                model
                    .dosage_classification
                    .map_or("n/a".to_string(), |c| c.to_string()),
            )
            .phases(phases)
            .build()
    }
}
