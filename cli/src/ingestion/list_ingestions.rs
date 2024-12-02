use clap::Parser;
use sea_orm::{DatabaseConnection, EntityTrait, QueryOrder};
use smol::block_on;
use tracing_attributes::instrument;
use crate::CommandHandler;
use crate::database;
use crate::database::prelude::Ingestion;
use tracing::Level;
use sea_orm_migration::MigratorTrait;
use cli_table::{print_stdout, Table, WithTitle};
use crate::ingestion::ViewModel;

#[derive(Parser, Debug)]
#[command(version, about = "List all ingestions", long_about)]
pub struct ListIngestions;

impl CommandHandler for crate::ingestion::list_ingestions::ListIngestions {
    #[instrument(name = "list_ingestions", level = Level::INFO)]
    fn handle(&self, database_connection: &DatabaseConnection) -> anyhow::Result<(), String> {
        let ingestions = block_on(async {
            Ingestion::find()
                .order_by_desc(database::ingestion::Column::IngestedAt)
                .all(database_connection)
                .await
                .map_err(|e| e.to_string())
        })?;

        let view_models: Vec<ViewModel> = ingestions.into_iter()
            .take(10)
            .map(|i| i.into())
            .collect();

        print_stdout(view_models.with_title()).map_err(|e| e.to_string())?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use chrono::{TimeZone, Utc};
    use sea_orm::{Database, Set, ActiveModelTrait};
    use crate::database::ingestion::ActiveModel;
    use tempfile::TempDir;

    #[test]
    fn test_list_ingestions() {
        // Create database connection with in-memory SQLite for testing
        let conn = block_on(async {
            Database::connect("sqlite::memory:").await.unwrap()
        });

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
        let ingestions = block_on(async {
            Ingestion::find()
                .all(&conn)
                .await
                .unwrap()
        });

        assert_eq!(ingestions.len(), 1);
        let ingestion = &ingestions[0];
        assert_eq!(ingestion.substance_name, "Test Substance");
        assert_eq!(ingestion.dosage, 100.0);
        assert_eq!(ingestion.dosage_unit, "mg");
        assert_eq!(ingestion.route_of_administration, "oral");
        assert_eq!(ingestion.ingested_at, test_date);
    }
}