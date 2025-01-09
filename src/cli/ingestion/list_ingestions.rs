use crate::cli::formatter::FormatterVector;
use crate::cli::ingestion::IngestionViewModel;
use crate::lib::CommandHandler;
use crate::lib::Context;
use crate::orm::ingestion;
use crate::orm::prelude::Ingestion;
use clap::Parser;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;
use sea_orm::QuerySelect;
use sea_orm::prelude::async_trait::async_trait;

#[derive(Parser, Debug)]
#[command(version, about = "List all ingestions", long_about, aliases = vec!["ls", "get"])]
pub struct ListIngestion
{
    /// Defines the amount of ingestion to display
    #[arg(short = 'l', long, default_value_t = 10)]
    pub limit: u64,
    // TODO: Query order by field
}

#[async_trait]
impl CommandHandler for ListIngestion
{
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        let ingestions = Ingestion::find()
            .order_by_desc(ingestion::Column::IngestedAt)
            .limit(Some(self.limit))
            .all(context.database_connection)
            .await
            .map_err(|e| e.to_string())
            .unwrap()
            .iter()
            .map(|i| IngestionViewModel::from(i.clone()))
            .collect();

        println!(
            "{}",
            FormatterVector::new(ingestions).format(context.stdout_format)
        );

        Ok(())
    }
}
