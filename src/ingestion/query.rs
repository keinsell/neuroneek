use crate::database::entities::ingestion;
use crate::ingestion::model::Ingestion;
use crate::utils::DATABASE_CONNECTION;
use async_trait::async_trait;
use clap::Parser;
use miette::IntoDiagnostic;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;
use sea_orm::QuerySelect;
use sea_orm::prelude::async_trait;
use sea_orm::prelude::*;
use sea_orm_migration::IntoSchemaManagerConnection;
use typed_builder::TypedBuilder;

#[derive(Parser, Debug, Copy, Clone, Serialize, Deserialize, TypedBuilder)]
#[command(version, about = "Query ingestions", long_about, aliases = vec!["ls", "get"])]
pub struct ListIngestion
{
    /// Defines the amount of ingestion to display
    #[arg(short = 'l', long, default_value_t = 10)]
    pub limit: u64,
}

impl std::default::Default for ListIngestion
{
    fn default() -> Self { Self::builder().limit(100).build() }
}


#[async_trait]
impl crate::core::QueryHandler<Vec<Ingestion>> for ListIngestion
{
    async fn query(&self) -> miette::Result<Vec<Ingestion>>
    {
        let ingestions = crate::database::entities::prelude::Ingestion::find()
            .order_by_desc(ingestion::Column::IngestedAt)
            .limit(Some(self.limit))
            .all(&DATABASE_CONNECTION.into_schema_manager_connection())
            .await
            .into_diagnostic()?
            .iter()
            .map(|i| Ingestion::from(i.clone()))
            .collect();

        Ok(ingestions)
    }
}
