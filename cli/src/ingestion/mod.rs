use crate::database::ingestion;
use async_trait::async_trait;
use chrono::DateTime;
use chrono::Utc;
use clap::Args;
use clap::Parser;
use clap::Subcommand;
use clap::command;
use sea_orm::DatabaseConnection;
use serde::Deserialize;
use serde::Serialize;
use tabled::Tabled;
use thiserror::Error;

mod delete_ingestion;
mod list_ingestions;
mod log_ingestion;
mod update_ingestion;

use crate::lib::CommandHandler;
pub use delete_ingestion::DeleteIngestion;
pub use list_ingestions::ListIngestions;
pub use log_ingestion::LogIngestion;
pub use update_ingestion::UpdateIngestion;

#[derive(Debug, Serialize, Deserialize, Tabled)]
pub struct ViewModel
{
    pub id: i32,
    pub substance_name: String,
    pub route: String,
    pub amount: String,
    pub notes: String,
    pub taken_at: DateTime<Utc>,
}

#[derive(Error, Debug)]
pub enum IngestionError
{
    #[error("Ingestion not found")]
    NotFound(#[from] sea_orm::DbErr),
}

#[derive(Debug, Subcommand)]
pub enum IngestionCommands
{
    Log(LogIngestion),
    Update(UpdateIngestion),
    Delete(DeleteIngestion),
    List(ListIngestions),
}

#[derive(Debug, Args)]
#[command(name = "ingestion")]
pub struct IngestionRouter
{
    #[command(subcommand)]
    commands: IngestionCommands,
}

#[async_trait]
impl CommandHandler for IngestionRouter
{
    async fn handle(&self, database_connection: &DatabaseConnection) -> Result<(), String>
    {
        match &self.commands
        {
            | IngestionCommands::Log(command) => command.handle(database_connection).await,
            | IngestionCommands::Update(command) => command.handle(database_connection).await,
            | IngestionCommands::Delete(command) => command.handle(database_connection).await,
            | IngestionCommands::List(command) => command.handle(database_connection).await,
        }
    }
}

impl std::fmt::Display for ViewModel
{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result
    {
        write!(
            f,
            "{} {} {} {} {} {}",
            self.id, self.substance_name, self.route, self.amount, self.notes, self.taken_at
        )
    }
}

impl From<ingestion::Model> for ViewModel
{
    fn from(model: ingestion::Model) -> Self
    {
        Self {
            id: model.id,
            substance_name: model.substance_name,
            route: model.route_of_administration,
            amount: format!("{} {}", model.dosage, model.dosage_unit),
            notes: model.notes.unwrap_or("-".to_string()),
            taken_at: model.ingested_at,
        }
    }
}

fn display_option_string(opt: &Option<String>) -> String
{
    opt.as_deref().unwrap_or("-").to_string()
}
