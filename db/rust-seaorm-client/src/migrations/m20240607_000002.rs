use sea_orm_migration::{prelude::*};
use crate::migrations::raw_migrations::{execute_migration_from_file};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        execute_migration_from_file(manager, "20240607182528.sql").await
    }

    async fn down(&self, _manager: &SchemaManager) -> Result<(), DbErr> {
        Ok(())
    }
}
