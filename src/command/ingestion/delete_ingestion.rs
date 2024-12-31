use crate::lib::CommandHandler;
use crate::lib::Context;
use crate::lib::orm::prelude::Ingestion;
use clap::Parser;
use log::info;
use miette::miette;
use sea_orm::EntityTrait;
use sea_orm::prelude::async_trait::async_trait;

#[derive(Parser, Debug)]
#[command(version, about = "Manage ingestions", long_about)]
pub struct DeleteIngestion
{
    #[arg(
        index = 1,
        value_name = "INGESTION_ID",
        help = "ID of the ingestion to delete"
    )]
    pub ingestion_identifier: i32,
}

#[async_trait]
impl CommandHandler for DeleteIngestion
{
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        let delete_ingestion = Ingestion::delete_by_id(self.ingestion_identifier)
            .exec(context.database_connection)
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
            self.ingestion_identifier
        );

        Ok(())
    }
}
