// src/setup.rs

use ndb::{IntoSchemaManagerConnection, Migrator, MigratorTrait};
use sea_orm::*;

const DATABASE_URL: &str = "sqlite::memory:";
pub(super) async fn setup_database() -> Result<DatabaseConnection, DbErr> {
    let db = Database::connect(DATABASE_URL).await?;

    let db = match db.get_database_backend() {
        DbBackend::MySql => {
            panic!("MySql is not supported")
        }
        DbBackend::Postgres => {
            panic!("Postgres is not supported")
        }
        DbBackend::Sqlite => db,
    };

    match Migrator::refresh(db.into_schema_manager_connection()).await {
        Ok(_) => {
            println!("Database schema updated");
        }
        Err(error) => {
            println!("Error while updating database schema: {}", error);
            panic!("Could not migrate database schema: {}", error)
        }
    };

    Ok(db)
}
