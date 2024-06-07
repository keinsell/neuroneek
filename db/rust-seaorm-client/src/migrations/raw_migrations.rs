use rust_embed::{Embed};
use sea_orm_migration::{prelude::*};

#[derive(Embed)]
#[folder = "public/"]
pub struct RawMigrations;

pub async fn execute_migration_from_file(
    manager: &SchemaManager<'_>,
    filename: &str,
) -> Result<(), DbErr> {
    let migration_sql = RawMigrations::get(filename)
        .ok_or_else(|| DbErr::Custom(format!("Migration file not found: {}", filename)))?;

    let connection = manager.get_connection();
    let sql_str = std::str::from_utf8(migration_sql.data.as_ref())
        .map_err(|e| DbErr::Custom(format!("Error decoding SQL: {}", e)))?;

    connection.execute_unprepared(sql_str).await?;

    Ok(())
}
