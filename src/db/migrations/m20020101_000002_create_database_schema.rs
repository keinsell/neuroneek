use crate::db::migrations::execute_migration_from_file;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration
{
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr>
    {
        execute_migration_from_file(manager, "20240607182528.sql").await
    }

    async fn down(&self, _manager: &SchemaManager) -> Result<(), DbErr> { Ok(()) }
}
