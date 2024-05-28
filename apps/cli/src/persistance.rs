use std::path::Path;
use xdg::BaseDirectories;


/// Function will initialize database in the default location
/// relative to user's home directory and XDG_DATA_HOME.
/// Initialization of database will result in SQLite database
/// file being created in the default location that will be
/// later used with SeaORM to create database connection.
pub fn initialize_database() -> std::path::PathBuf {
    let xdg_dirs = BaseDirectories::with_prefix("xyz.neuronek.cli").unwrap();
    let database_file = xdg_dirs.place_data_file("db.sqlite").unwrap();

    if !database_file.exists() {
        println!("Creating database in {:#?}", database_file);
        std::fs::create_dir_all(database_file.parent().unwrap()).unwrap();
        std::fs::File::create(&database_file).unwrap();
    }

    let path = database_file.parent().unwrap().join("db.sqlite");

    path
}

pub async fn get_database_connection() -> sea_orm::DatabaseConnection {
    let database_path = initialize_database();
    let database_url = format!("sqlite::{:?}?mode=rwc", database_path.as_path());

    let connection_options = sea_orm::ConnectOptions::new(database_url);
    let future_connection = sea_orm::Database::connect(connection_options);

    let connection_result = future_connection.await;

    println!("Connected to database");

    match connection_result {
        Ok(connection) => connection,

        // When error happens this may be because database file is not found
        // in this case we should handle it with retry (like create database file)
        // or just panic.
        Err(error) => panic!("Error connecting to database: {}", error),
    }
}