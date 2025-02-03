use crate::cli::OutputFormat;
use crate::core::CommandHandler;
use async_trait::async_trait;
use crate::database::entities::ingestion;
use crate::database::entities::ingestion::Entity as Ingestion;
use crate::database::entities::ingestion::Model;
use crate::cli::formatter::Formatter;
use crate::cli::formatter::FormatterVector;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::utils::{parse_date_string, DATABASE_CONNECTION};
use crate::utils::AppContext;
use chrono::DateTime;
use chrono::Local;
use chrono::TimeZone;
use chrono_humanize::HumanTime;
use clap::Parser;
use clap::Subcommand;
use log::info;
use miette::miette;
use miette::IntoDiagnostic;
use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;
use sea_orm::QuerySelect;
use serde::Deserialize;
use serde::Serialize;
use std::str::FromStr;
use sea_orm_migration::IntoSchemaManagerConnection;
use tabled::Tabled;
use tracing::event;
use tracing::Level;
use typed_builder::TypedBuilder;
use crate::analyzer::model::IngestionAnalysis;
use crate::analyzer::repository::save_ingestion_analysis;
use crate::substance::repository::get_substance;

/**
# Log Ingestion

The `Log Ingestion` feature is the core functionality of neuronek, enabling users to record
information about any substances they consume.
This feature is designed for tracking supplements, medications, nootropics,
or any psychoactive substances in a structured and organized way.

By logging ingestion, users can provide details such as the substance.rs name, dosage, and the time of ingestion.
This data is stored in a low-level database that serves as the foundation for further features,
such as journaling, analytics, or integrations with external tools.
While power users may prefer to work directly with this raw data,
many user-friendly abstractions are planned to make this process seamless,
such as simplified commands (e.g., `neuronek a coffee`) for quicker entries.

Logging ingestion's not only serves the purpose of record-keeping
but also helps users build a personalized database of their consumption habits.
This database can be used to analyze trends over time,
providing insights into the long-term effects of different substances on physical and mental well-being.
*/
#[derive(Parser, Debug)]
#[command(
    version,
    about = "Create a new ingestion record",
    long_about,
    aliases = vec!["create", "add", "make", "new", "mk"]
)]
pub struct LogIngestion
{
    /// Name of substance.rs that is being ingested, e.g. "Paracetamol"
    #[arg(value_name = "SUBSTANCE", required = true)]
    pub substance_name: String,
    /// Dosage of given substance.rs provided as string with unit (e.g., 10 mg)
    #[arg(
        value_name = "DOSAGE",
        required = true,
        value_parser = Dosage::from_str
    )]
    pub dosage: Dosage,
    /// Date of ingestion, by default current date is used if not provided.
    ///
    /// Date can be provided as timestamp and in human-readable format such as
    /// "today 10:00", "yesterday 13:00", "monday 15:34" which will be later
    /// parsed into proper timestamp.
    #[arg(
        short='t',
        long="date",
        default_value = "now",
        value_parser=parse_date_string
    )]
    pub ingestion_date: DateTime<Local>,
    /// Route of administration related to given ingestion (defaults to "oral")
    #[arg(short = 'r', long = "roa", default_value = "oral", value_enum)]
    pub route_of_administration: RouteOfAdministrationClassification,
}

#[async_trait]
impl CommandHandler for LogIngestion
{
    async fn handle<'a>(&self, context: AppContext<'a>) -> miette::Result<()>
    {
        // Substance name powered by PubChem API, fallback to user input
        let substance_name = pubchem::Compound::with_name(&self.substance_name)
            .title()
            .into_diagnostic()
            .unwrap_or(self.substance_name.clone());

        let ingestion = Ingestion::insert(ingestion::ActiveModel {
            id: ActiveValue::default(),
            substance_name: ActiveValue::Set(substance_name.to_lowercase()),
            route_of_administration: ActiveValue::Set(
                serde_json::to_value(self.route_of_administration)
                    .unwrap()
                    .as_str()
                    .unwrap()
                    .to_string(),
            ),
            dosage: ActiveValue::Set(self.dosage.as_base_units() as f32),
            ingested_at: ActiveValue::Set(self.ingestion_date.to_utc().naive_local()),
            updated_at: ActiveValue::Set(Local::now().to_utc().naive_local()),
            created_at: ActiveValue::Set(Local::now().to_utc().naive_local()),
        })
        .exec_with_returning(context.database_connection)
        .await
        .into_diagnostic()?;

        event!(Level::INFO, "Ingestion logged | {:#?}", ingestion.clone());

        println!(
            "{}",
            IngestionViewModel::from(ingestion.clone()).format(context.stdout_format)
        );

        let substance = crate::substance::repository::get_substance(substance_name.as_str(), context.database_connection).await?;

        if substance.is_some() {
            let ingestion: crate::ingestion::model::Ingestion = ingestion.into();
            let substance = substance.unwrap();
            let analysis = IngestionAnalysis::analyze(ingestion, &substance).await;
            if analysis.is_ok() {
                save_ingestion_analysis(analysis.unwrap()).await?;
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
    #[arg(short = 't', long = "date", value_name = "INGESTION_DATE", value_parser=parse_date_string
    )]
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
    // TODO: Query order by field
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

#[derive(Debug, Serialize, Deserialize, Tabled, TypedBuilder)]
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
}

impl Formatter for IngestionViewModel {}
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
            .build()
    }
}

impl From<crate::ingestion::model::Ingestion> for IngestionViewModel
{
    fn from(model: crate::ingestion::model::Ingestion) -> Self
    {
        let dosage = model.dosage;
        Self::builder()
            .id(model.id.unwrap_or(0))
            .substance_name(model.substance)
            .route(RouteOfAdministrationClassification::to_string(&model.route))
            .dosage(dosage.to_string())
            .ingested_at(model.ingestion_date)
            .build()
    }
}
