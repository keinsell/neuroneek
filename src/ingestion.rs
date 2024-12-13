use crate::db::ingestion;
use crate::db::prelude::Ingestion;
use crate::lib::dosage::parse_dosage;
use crate::lib::dosage::Dosage;
use crate::lib::parse_date_string;
use crate::lib::route_of_administration::RouteOfAdministrationClassification;
use crate::lib::CommandHandler;
use crate::lib::Context;
use async_std::task::block_on;
use chrono::DateTime;
use chrono::Local;
use chrono_humanize::HumanTime;
use clap::Parser;
use clap::Subcommand;
use log::error;
use log::warn;
use measurements::Measurement;
use miette::IntoDiagnostic;
use sea_orm::{ActiveModelTrait, ActiveValue};
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;
use sea_orm::QuerySelect;
use sea_orm_migration::async_trait::async_trait;
use serde::Deserialize;
use serde::Serialize;
use std::fmt::Debug;
use std::fmt::Display;
use tabled::Table;
use tabled::Tabled;
use typed_builder::TypedBuilder;

#[derive(Debug, Serialize, Deserialize, Tabled, TypedBuilder)]
pub struct ViewModel
{
    pub id: i32,
    pub substance_name: String,
    pub route: String,
    pub dosage: String,
    pub ingested_at: String,
}

impl From<ingestion::Model> for ViewModel
{
    fn from(model: ingestion::Model) -> Self
    {
        Self::builder()
            .id(model.id)
            .substance_name(model.substance_name)
            .route(model.route_of_administration)
            .dosage(Dosage::from_base_units(model.dosage).to_string())
            .ingested_at(HumanTime::from(model.ingested_at.to_utc()).to_string())
            .build()
    }
}

impl Display for ViewModel
{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result
    {
        let table = Table::new(vec![self]).to_string();
        f.write_str(table.as_ref())
    }
}

#[derive(Parser, Debug)]
#[command(version, about = "Store information about new ingestion", long_about)]
pub struct LogIngestion
{
    /// Name of the substance ingested.
    #[arg(short = 's', long)]
    pub substance_name: String,
    /// Dosage in general
    #[arg(short = 'd', long, value_parser=parse_dosage)]
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
        default_value_t=Local::now(),
        value_parser=parse_date_string
    )]
    pub ingestion_date: DateTime<Local>,
    #[arg(short = 'r', long, default_value = "oral", value_enum)]
    pub route_of_administration: RouteOfAdministrationClassification,
}

#[async_trait]
impl CommandHandler for LogIngestion
{
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        let pubchem = pubchem::Compound::with_name(&self.substance_name)
            .title()
            .into_diagnostic()?;
        let created_ingestion = Ingestion::insert(ingestion::ActiveModel {
            id: ActiveValue::default(),
            substance_name: ActiveValue::Set(pubchem.to_lowercase()),
            route_of_administration: ActiveValue::Set(
                serde_json::to_string(&self.route_of_administration).unwrap(),
            ),
            dosage: ActiveValue::Set(self.dosage.as_base_units()),
            ingested_at: ActiveValue::Set(self.ingestion_date.to_utc()),
            updated_at: ActiveValue::Set(Local::now().to_utc()),
            created_at: ActiveValue::Set(Local::now().to_utc()),
        })
            .exec_with_returning(context.database_connection)
            .await
            .into_diagnostic();

        if let Err(e) = created_ingestion
        {
            error!("Failed to create ingestion: {}", e);
            return Err(e);
        }

        println!("{}", ViewModel::from(created_ingestion?).to_string());

        Ok(())
    }
}

#[derive(Parser, Debug)]
#[command(version, about = "List all ingestions", long_about)]
pub struct ListIngestion
{
    /// Defines the amount of ingestion to display
    #[arg(short = 'l', long, default_value_t = 10)]
    pub limit: u64,
    // TODO: Query order by field
    // TODO: Return format (JSON/Pretty)
}

#[async_trait]
impl CommandHandler for ListIngestion
{
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        let ingestions = block_on(async {
            Ingestion::find()
                .order_by_desc(ingestion::Column::IngestedAt)
                .limit(Some(self.limit))
                .all(context.database_connection)
                .await
                .map_err(|e| e.to_string())
        })
            .unwrap();

        if ingestions.is_empty()
        {
            warn!("No ingestions found.");
            return Ok(());
        }

        let table = Table::new(ingestions.iter().map(|i| ViewModel::from(i.clone())))
            .with(tabled::settings::Style::modern())
            .to_string();

        println!("{}", table);

        Ok(())
    }
}

#[derive(Parser, Debug)]
#[command(version, about = "Update an existing ingestion")]
pub struct UpdateIngestion
{
    /// ID of the ingestion to update
    #[arg(index = 1, value_name = "INGESTION_ID")]
    pub ingestion_identifier: i32,

    /// New name of the substance (optional)
    #[arg(short = 'n', long = "name", value_name = "SUBSTANCE_NAME")]
    pub substance_name: Option<String>,

    /// New dosage (optional, e.g., 20 mg)
    #[arg(short = 'd', long = "dosage", value_name = "DOSAGE", value_parser=parse_dosage)]
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
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        // Attempt to fetch the record by ID
        if Ingestion::find_by_id(self.ingestion_identifier)
            .one(context.database_connection)
            .await
            .into_diagnostic()?
            .is_none()
        {
            return Err(miette!(
                "Ingestion with ID {} not found",
                self.ingestion_identifier
            ));
        }

        // Create an ActiveModel with only the fields to be updated
        let mut updated_model = ingestion::ActiveModel {
            id: ActiveValue::Set(self.ingestion_identifier), // ID must always be set for updates
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
            .update(context.database_connection)
            .await
            .into_diagnostic()?;

        info!(
            "Successfully updated ingestion with ID {}.",
            self.ingestion_identifier
        );

        println!("{}", ViewModel::from(updated_record));

        Ok(())
    }
}

#[derive(Parser, Debug)]
#[command(version, about = "Manage ingestions", long_about)]
pub struct DeleteIngestion
{
    #[arg(short, long, help = "ID of the ingestion to delete")]
    pub id: i32,
}

#[async_trait]
impl CommandHandler for DeleteIngestion
{
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        Ingestion::delete_by_id(self.id)
            .exec(context.database_connection)
            .await
            .into_diagnostic()?;
        Ok(())
    }
}

#[derive(Debug, Subcommand)]
pub(super) enum IngestionCommands
{
    Log(LogIngestion),
    List(ListIngestion),
    Delete(DeleteIngestion),
    Update(UpdateIngestion),
}

#[derive(Debug, Parser)]
pub(super) struct IngestionCommand
{
    #[command(subcommand)]
    commands: IngestionCommands,
}

#[async_trait]
impl CommandHandler for IngestionCommand
{
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        match &self.commands
        {
            | IngestionCommands::Log(log_ingestion) => log_ingestion.handle(context).await,
            | IngestionCommands::List(list_ingestions) => list_ingestions.handle(context).await,
            | IngestionCommands::Delete(delete_ingestion) => delete_ingestion.handle(context).await,
            | IngestionCommands::Update(update_ingestion) => update_ingestion.handle(context).await
        }
    }
}
