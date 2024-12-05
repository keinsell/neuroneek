mod dosage;

use sea_orm::DatabaseConnection;

pub trait CommandHandler
{
    fn handle(&self, database_connection: &DatabaseConnection) -> Result<(), String>;
}
