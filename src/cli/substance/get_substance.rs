use crate::lib::CommandHandler;
use crate::lib::Context;
use clap::Parser;
use sea_orm::prelude::async_trait::async_trait;

#[derive(Parser, Debug)]
#[command(
    version,
    about = "Name of substance to query",
    long_about,
    aliases = vec!["create", "add"]
)]
pub struct GetSubstance
{
    #[arg(index = 1, value_name = "SUBSTANCE", required = true)]
    pub substance_name: String,
}

use crate::lib::substance::repository::get_substance_by_name;
use miette::Result;

#[async_trait]
impl CommandHandler<crate::lib::substance::Substance> for GetSubstance
{
    async fn handle<'a>(&self, context: Context<'a>) -> Result<crate::lib::substance::Substance>
    {
        let substance =
            get_substance_by_name(&self.substance_name, context.database_connection).await?;

        print!("{}", &substance.to_string());
        Ok(substance)
    }
}

#[cfg(test)]
mod tests
{
    use super::*;
    use crate::cli::GetSubstance;
    use crate::cli::OutputFormat;
    use crate::lib::Context;
    use crate::lib::DATABASE_CONNECTION;
    use crate::lib::migrate_database;
    use crate::orm::substance::Column;
    use crate::orm::substance::Entity;
    use sea_orm::ColumnTrait;
    use sea_orm::EntityTrait;
    use sea_orm::QueryFilter;

    #[async_std::test]
    async fn should_return_caffeine()
    {
        migrate_database(&DATABASE_CONNECTION).await.unwrap();

        let context = Context {
            database_connection: &DATABASE_CONNECTION,
            stdout_format: OutputFormat::Pretty,
        };

        let command = GetSubstance {
            substance_name: "caffeine".to_string(),
        };

        let result = command.handle(context.clone()).await;
        assert!(result.is_ok(), "Query failed: {:?}", result);

        let matched_substances = Entity::find()
            .filter(Column::CommonNames.contains("caffeine"))
            .all(context.database_connection)
            .await
            .unwrap();

        assert!(
            matched_substances
                .iter()
                .any(|s| s.id.starts_with("e30c6c")),
            "No substance with ID starting with 'e30c6c' found"
        );
    }
}
