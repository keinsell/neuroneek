use sea_orm::DatabaseConnection;

pub mod config;
pub mod database;
pub mod state;
pub mod ingestion;
pub mod route_of_administration;

pub trait CommandHandler  {
    fn handle(&self, database_connection: &DatabaseConnection) -> Result<(), String>;
}
