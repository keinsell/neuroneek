use log::debug;
use sea_orm::DatabaseConnection;
use sea_orm::*;
use sea_orm_migration::*;
use xdg::BaseDirectories;

/// Function will initialize database in the default location
/// relative to user's home directory and XDG_DATA_HOME.
/// Initialization of database will result in SQLite database
/// file being created in the default location that will be
/// later used with SeaORM to create database connection.
fn locate_db_file() -> String {
    debug!("Initializing database");
    let xdg_dirs = BaseDirectories::with_prefix("xyz.neuronek.cli").unwrap();
    let database_file = xdg_dirs.place_data_file("db.sqlite").unwrap();

    if !database_file.exists() {
        debug!("Creating database in {:#?}", database_file);
        std::fs::create_dir_all(database_file.parent().unwrap()).unwrap();
        std::fs::File::create(&database_file).unwrap();
    }

    debug!("Database initialized");
    let path = database_file.parent().unwrap().join("db.sqlite");

    debug!("Database path: {:#?}", path);

    // Transform path into database connection string with sqlite dialect
    let database_url = format!("sqlite://{}?mode=rwc", path.display());
    debug!("Database connection string: {:#?}", database_url);

    return database_url.clone();
}

pub(super) async fn setup_database() -> Result<DatabaseConnection, DbErr> {
    let db = Database::connect(locate_db_file()).await?;

    let db = match db.get_database_backend() {
        DbBackend::MySql => panic!("MySQL is not supported"),
        DbBackend::Postgres => panic!("PostgreSQL is not supported"),
        DbBackend::Sqlite => db,
    };

    Ok(db)
}
