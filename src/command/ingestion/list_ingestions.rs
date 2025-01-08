use crate::lib::formatter::FormatterVector;
use crate::lib::orm::ingestion;
use crate::lib::orm::prelude::Ingestion;
use crate::lib::CommandHandler;
use crate::lib::Context;
use crate::view_model::ingestion::IngestionViewModel;
use crate::view_model::substance::ViewModel;
use async_std::task::block_on;
use clap::Parser;
use log::warn;
use sea_orm::prelude::async_trait::async_trait;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;
use sea_orm::QuerySelect;

#[derive(Parser, Debug)]
#[command(version, about = "List all ingestions", long_about)]
pub struct ListIngestion
{
    /// Defines the amount of ingestion to display
    #[arg(short = 'l', long, default_value_t = 10)]
    pub limit: u64,
    // TODO: Query order by field
    // TODO: Return format (JSON/Pretty)
}

#[async_trait]
impl CommandHandler for ListIngestion
{
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        let ingestions = block_on(async {
            Ingestion::find()
                .order_by_desc(ingestion::Column::IngestedAt)
                .limit(Some(self.limit))
                .all(context.database_connection)
                .await
                .map_err(|e| e.to_string())
        })
        .unwrap();

        if ingestions.is_empty()
        {
            warn!("No ingestions found.");
            return Ok(());
        }

        let view_models: Vec<IngestionViewModel> = ingestions
            .iter()
            .map(|i| IngestionViewModel::from(i.clone()))
            .collect();

        let formatted = FormatterVector::new(view_models).format(context.stdout_format);

        println!("{}", formatted);

        Ok(())
    }
}
