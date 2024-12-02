use neuronek_cli::database::Migrator;
use sea_orm_migration::MigratorTrait;
use std::env;
use tempfile::TempDir;

#[test]
fn test_database_migration_on_startup() {
    unsafe {
        env::set_var("NEURONEK_ENV", "test");
    }

    let temp_dir = TempDir::new().unwrap();
    let db_path = temp_dir.path().join("test.db");

    // Ensure parent directory exists
    if let Some(parent) = db_path.parent()
    {
        std::fs::create_dir_all(parent).unwrap();
    }

    // Create empty database file
    std::fs::write(&db_path, "").unwrap();

    unsafe {
        std::env::set_var("DATABASE_PATH", db_path.to_str().unwrap());
    }

    smol::block_on(async {
        let db_url = format!("sqlite:{}", db_path.to_str().unwrap());
        let conn = sea_orm::Database::connect(&db_url)
            .await
            .expect("Failed to connect to database");

        // Apply migrations
        Migrator::up(&conn, None)
            .await
            .expect("Failed to run migrations");

        // Verify database exists
        assert!(db_path.exists(), "Database file was not created");
    });
}
