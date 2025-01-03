use crate::command;
use crate::lib::CommandHandler;
use crate::lib::Context;
use crate::lib::orm::substance;
use crate::view_model::substance::ViewModel;
use clap::Parser;
use log::info;
use log::warn;
use miette::IntoDiagnostic;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use sea_orm::prelude::async_trait::async_trait;
use tabled::Table;
use tabled::settings::Style;

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

#[async_trait]
impl CommandHandler for GetSubstance
{
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        let substances = substance::Entity::find()
            .filter(substance::Column::CommonNames.contains(&self.substance_name.to_lowercase()))
            .order_by_asc(substance::Column::Name)
            .all(context.database_connection)
            .await
            .into_diagnostic()?;

        if substances.is_empty()
        {
            warn!("No substances found for query '{}'.", self.substance_name);
            println!("No substances found for '{}'.", self.substance_name);
        }
        else
        {
            let table = Table::new(substances.into_iter().map(ViewModel::from))
                .with(Style::modern())
                .to_string();

            info!(
                "Found {} substances for query '{}'.",
                table.lines().count(),
                self.substance_name
            );
            println!("{}", table);
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests
{
    use super::*;
    use crate::OutputFormat;
    use crate::command::GetSubstance;
    use crate::lib::Context;
    use crate::lib::DATABASE_CONNECTION;
    use crate::lib::migrate_database;

    #[async_std::test]
    async fn should_return_caffeine()
    {
        migrate_database(&DATABASE_CONNECTION).await.unwrap();

        let context = Context {
            database_connection: &DATABASE_CONNECTION,
            stdout_format: OutputFormat::Pretty,
            is_interactive: false,
        };


        let command = GetSubstance {
            substance_name: "caffeine".to_string(),
        };

        let result = command.handle(context.clone()).await;
        assert!(result.is_ok(), "Query failed: {:?}", result);

        let matched_substances = substance::Entity::find()
            .filter(substance::Column::CommonNames.contains("caffeine"))
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

    // #[async_std::test]
    // async fn should_find_substance_by_alias_name()
    // {
    //     migrate_database(&DATABASE_CONNECTION).await.unwrap();
    //     let ctx = Context::from(Context { database_connection:
    // &DATABASE_CONNECTION });
    //
    //     let command = GetSubstance {
    //         substance_name: "vitamin d3".to_string(),
    //     };
    //
    //     // TODO: Define series of tests for substances that are known like
    // "D3 Vitamin"     // We currently do not have them in database but
    // pubchem seems to provide information     // about all of those.
    //
    //     todo!();
    //
    //     let result = command.handle(Context {
    //         database_connection: &DATABASE_CONNECTION,
    //     }).await;
    //     assert!(result.is_ok(), "Query failed: {:?}", result);
    //
    //     let matched_substances = substance::Entity::find()
    //         .filter(substance::Column::CommonNames.contains("vitamin d3"))
    //         .all(ctx.database_connection)
    //         .await
    //         .unwrap();
    //
    //     assert!(
    //         matched_substances
    //             .iter()
    //             .any(|s| s.id.starts_with("e30c6c")),
    //         "No substance with ID starting with 'e30c6c' found"
    //     );
    // }
}
