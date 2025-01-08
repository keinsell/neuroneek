use crate::lib::CommandHandler;
use crate::lib::Context;
use clap::Parser;
use clap::Subcommand;
use sea_orm::prelude::async_trait::async_trait;

mod delete_ingestion;
mod list_ingestions;
mod log_ingestion;
mod update_ingestion;

#[derive(Debug, Subcommand)]
pub enum IngestionCommands
{
    Log(log_ingestion::LogIngestion),
    List(list_ingestions::ListIngestion),
    Delete(delete_ingestion::DeleteIngestion),
    Update(update_ingestion::UpdateIngestion),
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
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        match &self.commands
        {
            | IngestionCommands::Log(log_ingestion) => log_ingestion.handle(context).await,
            | IngestionCommands::List(list_ingestions) => list_ingestions.handle(context).await,
            | IngestionCommands::Delete(delete_ingestion) => delete_ingestion.handle(context).await,
            | IngestionCommands::Update(update_ingestion) => update_ingestion.handle(context).await,
        }
    }
}

use crate::cli::formatter::Formatter;
use crate::lib::dosage::Dosage;
use crate::lib::orm::ingestion;
use crate::lib::route_of_administration::RouteOfAdministrationClassification;
use chrono::DateTime;
use chrono::Local;
use chrono::TimeZone;
use chrono_humanize::HumanTime;
use core::convert::From;
use serde::Deserialize;
use serde::Serialize;
use std::fmt::Debug;
use tabled::Tabled;
use typed_builder::TypedBuilder;

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

// TODO: Rethink need for view models
// Direct implementation of display functions
// can be added to domain model which would replace
// view model completely
impl From<ingestion::Model> for IngestionViewModel
{
    fn from(model: ingestion::Model) -> Self
    {
        let dosage = Dosage::from_base_units(model.dosage.into());
        let route_enum: RouteOfAdministrationClassification =
            model.route_of_administration.parse().unwrap_or_default();
        let local_ingestion_date =
            chrono::Local::from_utc_datetime(&chrono::Local, &model.ingested_at);

        Self::builder()
            .id(model.id)
            .substance_name(model.substance_name)
            .route(RouteOfAdministrationClassification::to_string(&route_enum))
            .dosage(dosage.to_string())
            .ingested_at(local_ingestion_date)
            .build()
    }
}
