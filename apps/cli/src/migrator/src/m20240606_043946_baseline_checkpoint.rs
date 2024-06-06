use std::fmt::Error;
use std::fs::{read, read_to_string};

use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();

        let mut sql_migration = match read_to_string("src/migrations/rebase.sql") {
            Ok(content) => content,
            Err(e) => {
                println!("Error reading file: {}", e);
                panic!("sadasad")
            }
        };

        db.execute_unprepared(&sql_migration).await.unwrap();

        // sql_migration = read_to_string("src/migrations/checkpoint.sql").unwrap_or_else(|e| {
        //     println!("Error reading file: {}", e);
        //     panic!("sadasad")
        // });
        //
        // db.execute_unprepared(&sql_migration).await.unwrap();

        return Ok(());
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        todo!();

        manager
            .drop_table(Table::drop().table(Post::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Post {
    Table,
    Id,
    Title,
    Text,
}
