use crate::database;
use crate::database::prelude::Ingestion;
use crate::ingestion::ViewModel;
use crate::lib::CommandHandler;
use clap::Parser;
use sea_orm::DatabaseConnection;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;
use sea_orm_migration::MigratorTrait;
use smol::block_on;
use tabled::Table;
use tabled::Tabled;
use tracing_attributes::instrument;

#[derive(Parser, Debug)]
#[command(version, about = "List all ingestions", long_about)]
pub struct ListIngestions
{
    /// Defines the number of ingestions to display
    #[arg(short = 'l', long, default_value_t = 10)]
    pub linit: i32,
    // TODO: Query order by field
    // TODO: Return format (JSON/Pretty)
}

impl CommandHandler for crate::ingestion::list_ingestions::ListIngestions
{
    #[instrument(name = "list_ingestions", level = Level::INFO)]
    fn handle(&self, database_connection: &DatabaseConnection) -> anyhow::Result<(), String>
    {
        let ingestions = block_on(async {
            Ingestion::find()
                .order_by_desc(database::ingestion::Column::IngestedAt)
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

#[cfg(test)]
mod tests
{
    use super::*;
    use crate::database::ingestion::ActiveModel;
    use chrono::TimeZone;
    use chrono::Utc;
    use sea_orm::ActiveModelTrait;
    use sea_orm::Database;
    use sea_orm::Set;

    #[test]
    fn test_list_ingestions()
    {
        // Create database connection with in-memory SQLite for testing
        let conn = block_on(async { Database::connect("sqlite::memory:").await.unwrap() });

        // Run migrations
        block_on(async {
            crate::database::Migrator::up(&conn, None)
                .await
                .expect("Failed to run migrations");
        });

        // Insert test data
        let test_date = Utc.with_ymd_and_hms(2023, 1, 1, 12, 0, 0).unwrap();
        let test_ingestion = ActiveModel {
            substance_name: Set("Test Substance".to_string()),
            route_of_administration: Set("oral".to_string()),
            dosage: Set(100.0),
            dosage_unit: Set("mg".to_string()),
            ingested_at: Set(test_date),
            notes: Set(None),
            updated_at: Set(test_date),
            created_at: Set(test_date),
            ..Default::default()
        };

        block_on(async {
            test_ingestion.insert(&conn).await.unwrap();
        });

        // Test listing ingestions
        let list_command = ListIngestions;
        let result = list_command.handle(&conn);
        assert!(result.is_ok());

        // Verify the ingestion exists in database
        let ingestions = block_on(async { Ingestion::find().all(&conn).await.unwrap() });

        assert_eq!(ingestions.len(), 1);
        let ingestion = &ingestions[0];
        assert_eq!(ingestion.substance_name, "Test Substance");
        assert_eq!(ingestion.dosage, 100.0);
        assert_eq!(ingestion.dosage_unit, "mg");
        assert_eq!(ingestion.route_of_administration, "oral");
        assert_eq!(ingestion.ingested_at, test_date);
    }
}
