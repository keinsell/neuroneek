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
