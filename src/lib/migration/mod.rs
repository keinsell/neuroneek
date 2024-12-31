pub use sea_orm_migration::prelude::*;

mod m20020101_000002_create_database_schema;
mod m20220101_000001_create_table;

pub struct Migrator;

use rust_embed::Embed;

#[derive(Embed)]
#[folder = "src/lib/migration/sql"]
pub struct Migrations;

pub async fn execute_migration_from_file(
    manager: &SchemaManager<'_>,
    filename: &str,
) -> Result<(), DbErr>
{
    let migration_sql = Migrations::get(filename)
        .ok_or_else(|| DbErr::Custom(format!("Migration file not found: {}", filename)))?;

    let connection = manager.get_connection();
    let sql_str = std::str::from_utf8(migration_sql.data.as_ref())
        .map_err(|e| DbErr::Custom(format!("Error decoding SQL: {}", e)))?;

    connection.execute_unprepared(sql_str).await?;

    Ok(())
}

#[async_trait::async_trait]
impl MigratorTrait for Migrator
{
    fn migrations() -> Vec<Box<dyn MigrationTrait>>
    {
        vec![
            Box::new(m20220101_000001_create_table::Migration),
            Box::new(m20020101_000002_create_database_schema::Migration),
        ]
    }
}
