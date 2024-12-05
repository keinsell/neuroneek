use crate::CommandHandler;
use crate::database;
use crate::database::prelude::Ingestion;
use crate::ingestion::IngestionError;
use clap::Parser;
use sea_orm::DatabaseConnection;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;
use smol::block_on;

#[derive(Parser, Debug)]
#[command(version, about = "Update ingestion", long_about)]
pub struct DeleteIngestion
{
    /// Identificator of the ingestion to be deleted
    #[arg(short = 'i', long = "id")]
    pub ingestion_id: i32,
}

impl CommandHandler for DeleteIngestion
{
    fn handle(&self, database_connection: &DatabaseConnection) -> Result<(), String>
    {
        let rows_affected = block_on(async {
            Ingestion::delete_by_id(self.ingestion_id)
                .exec(database_connection)
                .await
                .expect("Error deleting ingestion")
        })
        .rows_affected;

        if rows_affected == 1
        {
            println!("Ingestion deleted");
        }
        else
        {
            println!("Ingestion not found");
        }

        Ok(())
    }
}
