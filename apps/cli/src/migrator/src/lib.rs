pub use sea_orm_migration::prelude::*;

mod m20220101_000001_init_db;
mod m20240530_215436_add_ingestion_route_of_administration;
mod m20240606_043946_baseline_checkpoint;

#[derive(Debug)]
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_init_db::Migration),
            Box::new(m20240530_215436_add_ingestion_route_of_administration::Migration),
            Box::new(m20240606_043946_baseline_checkpoint::Migration),
        ]
    }
}
