use db::Migrator;
use log::debug;
use sea_orm::DatabaseConnection;
use sea_orm::*;
use sea_orm_migration::*;
use xdg::BaseDirectories;

use crate::orm;

lazy_static::lazy_static! {
    pub static ref DB_CONNECTION: DatabaseConnection = {
        async_std::task::block_on(async {
            Database::connect(locate_db_file()).await.unwrap()
        })
    };
}

/// Function will initialize database in the default location
/// relative to user's home directory and XDG_DATA_HOME.
/// Initialization of database will result in SQLite database
/// file being created in the default location that will be
/// later used with SeaORM to create database connection.
pub(super) fn locate_db_file() -> String {
    debug!("Initializing database");
    const SQLITE_FILE: &str = "db.sqlite";
    const APPLICATION_NAMESPACE: &str = "xyz.neuronek.cli";

    let xdg_dirs: BaseDirectories = BaseDirectories::with_prefix(APPLICATION_NAMESPACE).unwrap();

    let environment_relative_database_file_name = if cfg!(feature = "dev") {
        format!("dev-{}", SQLITE_FILE)
    } else {
        SQLITE_FILE.to_string()
    };

    let database_file = xdg_dirs
        .place_data_file(&environment_relative_database_file_name)
        .unwrap();

    if !database_file.exists() {
        debug!("Creating database in {:#?}", database_file);
        std::fs::create_dir_all(database_file.parent().unwrap()).unwrap();
        std::fs::File::create(&database_file).unwrap();
    }

    debug!("Database initialized");
    let path = database_file
        .parent()
        .unwrap()
        .join(&environment_relative_database_file_name);

    debug!("Database path: {:#?}", path);

    // Transform path into database connection string with sqlite dialect
    let database_url = format!("sqlite://{}?mode=rwc", path.display());
    debug!("Database connection string: {:#?}", database_url);

    database_url.clone()
}

pub(super) async fn setup_database() -> Result<DatabaseConnection, DbErr> {
    let db = Database::connect(locate_db_file()).await?;
    let db = match db.get_database_backend() {
        DbBackend::MySql => panic!("MySQL is not supported"),
        DbBackend::Postgres => panic!("PostgresSQL is not supported"),
        DbBackend::Sqlite => db,
    };
    Ok(db)
}

/// Get database file and create a snapshot of it by creating a copy with a timestamp
pub async fn snapshot_database() {
    let db_file = locate_db_file();
    let db_file = std::path::Path::new(&db_file);

    // Create database file if one does not exist
    if !db_file.exists() {
        debug!("Creating database in {:#?}", db_file);
        std::fs::create_dir_all(db_file.parent().unwrap()).unwrap();
        std::fs::File::create(db_file).unwrap();
    }

    let timestamp = chrono::Utc::now().format("%Y%m%d_%H%M%S").to_string();
    let snapshot_file = db_file.with_file_name(format!("snapshot_{}.sqlite", timestamp));

    debug!("Creating snapshot of database");

    match std::fs::copy(db_file, &snapshot_file) {
        Ok(_) => println!("Database snapshot created at: {:#?}", snapshot_file),
        Err(e) => eprintln!("Failed to create database snapshot: {:#?}", e),
    }

    println!("Database snapshot created at: {:#?}", snapshot_file);
}

pub async fn migrate_database(db: &DatabaseConnection) {
    let pending_migrations =
        match Migrator::get_pending_migrations(&db.into_schema_manager_connection()).await {
            Ok(pending_migrations) => pending_migrations,
            Err(error) => panic!("Could not get pending migrations: {}", error),
        };

    // Before applying migration perform snapshot of the database
    // This is done to prevent data loss in case of migration failure

    if !pending_migrations.is_empty() {
        orm::snapshot_database().await;
    }

    match Migrator::up(db.into_schema_manager_connection(), None).await {
        Ok(_) => debug!("Migrations applied"),
        Err(error) => panic!("Could not migrate database schema: {}", error),
    };
}

#[cfg(feature = "dev")]
pub async fn refresh_database_as_developer() {
    let db = match orm::setup_database().await {
        Ok(db) => db,
        Err(error) => panic!("Could not connect to database: {}", error),
    };

    match Migrator::fresh(db.into_schema_manager_connection()).await {
        Ok(_) => println!("Development database reset!"),
        Err(error) => panic!("Error applying migrations: {}", error),
    };
}
