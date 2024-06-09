use crate::migrations::raw_migrations::RawMigrations;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let connection = manager.get_connection();
        let migration_file = RawMigrations::get("20240607043921_init.sql").unwrap();
        let migration_sql = std::str::from_utf8(migration_file.data.as_ref()).unwrap();

        connection.execute_unprepared(migration_sql).await?;

        Ok(())
    }

    async fn down(&self, _manager: &SchemaManager) -> Result<(), DbErr> {
        Ok(())
    }
}
