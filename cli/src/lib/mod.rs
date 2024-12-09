mod dosage;

use async_trait::async_trait;
use sea_orm::DatabaseConnection;

#[async_trait]
pub trait CommandHandler: Sync
{
    async fn handle(&self, database_connection: &DatabaseConnection) -> Result<(), String>;
}
