use crate::db;
use crate::db::Migrator;
use async_std::task::block_on;
use log::{debug, error, warn};
use miette::Result;
use sea_orm::Database;
use sea_orm_migration::async_trait::async_trait;
use sea_orm_migration::sea_orm::DatabaseConnection;
use sea_orm_migration::{IntoSchemaManagerConnection, MigratorTrait};
use std::env::temp_dir;
use std::path::PathBuf;

pub mod route_of_administration;
pub mod dosage;

#[derive(Debug)]
pub struct Context<'a> {
    pub(crate) database_connection: &'a DatabaseConnection,
}

#[async_trait]
pub trait CommandHandler: Sync {
    async fn handle<'a>(&self, context: Context<'a>) -> Result<()>;
}

#[derive(Debug, Clone)]
pub struct Config {
    pub journal_path: PathBuf,
}

impl Default for Config {
    fn default() -> Self {
        let mut journal_path = directories::ProjectDirs::from("com", "keinsell", "neuronek")
            .unwrap()
            .data_dir()
            .join("journal.db")
            .clone()
            .into();

        if cfg!(debug_assertions) || cfg!(test) {
            journal_path = temp_dir().join("journal.db");
        }

        dbg!(&journal_path);

        Config { journal_path }
    }
}

lazy_static::lazy_static! {
    #[derive(Clone, Debug)]
    pub static ref DATABASE_CONNECTION: DatabaseConnection = {
        let config = Config::default();
        let sqlite_path = format!("sqlite://{}", config.journal_path.clone().to_str().unwrap());

        // Try to open database connection
        debug!("Opening database connection to {}", sqlite_path);

        match block_on(async { Database::connect(&sqlite_path).await }) {
            Ok(connection) => {
                debug!("Database connection established successfully!");
                connection
            }
            Err(error) => {
                // If error was about being unable to open a database file, handle it
                if error.to_string().contains("unable to open database file") {
                    warn!("Database file not found or inaccessible at {}, attempting to initialize...", sqlite_path);

                    // Try to initialize the database
                    if let Err(init_error) = initialize_database(&config) {
                        // Log critical error if initialization fails
                        error!("Failed to initialize the database: {}", init_error);
                        panic!("Critical: Unable to initialize the database file at {}. Error: {}", sqlite_path, init_error);
                    }

                    // Retry connection after initialization
                    match block_on(async { Database::connect(&sqlite_path).await }) {
                        Ok(retry_connection) => {
                            debug!("Database connection established successfully after initialization!");
                            retry_connection
                        }
                        Err(retry_error) => {
                            // Log critical error if connection fails again
                            error!("Failed to connect to the database even after initialization: {}", retry_error);
                            panic!("Critical: Unable to establish database connection at {}. Error: {}", sqlite_path, retry_error);
                        }
                    }
                } else {
                    // Handle other database-related errors
                    error!("Unexpected database connection error: {}", error);
                    panic!("Critical: Unable to establish database connection. Error: {}", error);
                }
            }
        }
    };
}

fn initialize_database(config: &Config) -> std::result::Result<(), String> {
    // Create the database file if it doesn't exist
    let journal_path = config.journal_path.clone();
    if let Some(parent_dir) = journal_path.parent() {
        if !parent_dir.exists() {
            // Create parent directory
            std::fs::create_dir_all(parent_dir)
                .map_err(|e| format!("Failed to create database directory: {}", e))?;
            debug!("Created database directory at {}", parent_dir.display());
        }
    }

    // Attempt to create the database file
    std::fs::File::create(&journal_path)
        .map_err(|e| format!("Failed to create database file: {}", e))?;
    debug!("Created database file at {}", journal_path.display());

    Ok(())
}

pub async fn migrate_database(database_connection: &DatabaseConnection) {
    let pending_migrations =
        Migrator::get_pending_migrations(&database_connection.into_schema_manager_connection())
            .await
            .expect("Failed to read pending migrations");

    if !pending_migrations.is_empty() {
        println!("There are {} migrations pending.", pending_migrations.len());
        println!("Applying migrations...");
        Migrator::up(database_connection.into_schema_manager_connection(), None)
            .await
            .expect("Failed to apply migrations");
    }
}
