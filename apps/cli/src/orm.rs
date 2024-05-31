use log::debug;
use sea_orm::DatabaseConnection;
use sea_orm::*;
use sea_orm_migration::*;
use xdg::BaseDirectories;

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
