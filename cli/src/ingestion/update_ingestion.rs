use crate::lib::CommandHandler;
use clap::Parser;
use sea_orm::DatabaseConnection;

#[derive(Parser, Debug)]
#[command(version, about = "Update ingestion", long_about)]
pub struct UpdateIngestion {}

impl CommandHandler for UpdateIngestion
{
    fn handle(&self, database_connection: &DatabaseConnection) -> Result<(), String> { todo!() }
}
