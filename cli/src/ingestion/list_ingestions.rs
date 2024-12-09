use crate::database;
use crate::database::prelude::Ingestion;
use crate::ingestion::ViewModel;
use crate::lib::CommandHandler;
use async_trait::async_trait;
use clap::Parser;
use sea_orm::DatabaseConnection;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;
use sea_orm::QuerySelect;
use smol::block_on;
use tabled::Table;
use tracing_attributes::instrument;

#[derive(Parser, Debug)]
#[command(version, about = "List all ingestions", long_about)]
pub struct ListIngestions
{
    /// Defines the amount of ingestion to display
    #[arg(short = 'l', long, default_value_t = 10)]
    pub limit: u64,
    // TODO: Query order by field
    // TODO: Return format (JSON/Pretty)
}


#[async_trait]
impl CommandHandler for ListIngestions
{
    #[instrument(level = Level::INFO, skip(database_connection), nane = "ListIngestions")]
    async fn handle(&self, database_connection: &DatabaseConnection) -> anyhow::Result<(), String>
    {
        let ingestions = block_on(async {
            Ingestion::find()
                .order_by_desc(database::ingestion::Column::IngestedAt)
                .limit(Some(self.limit))
                .all(database_connection)
                .await
                .map_err(|e| e.to_string())
        })?;

        if ingestions.is_empty()
        {
            println!("No ingestions found.");
            return Ok(());
        }

        let table = Table::new(ingestions.iter().map(|i| ViewModel::from(i.clone())))
            .with(tabled::settings::Style::modern())
            .to_string();

        println!("{}", table);

        Ok(())
    }
}
