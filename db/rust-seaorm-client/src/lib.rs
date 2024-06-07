//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.15
pub use sea_orm_migration::prelude::*;
pub mod prelude;
mod migrations;

pub mod account;
pub mod chemical_class;
pub mod effect;
pub mod ingestion;
pub mod psychoactive_class;
pub mod stash;
pub mod subject;
pub mod substance;
pub mod substance_interactions;
pub mod substance_route_of_administration;
pub mod substance_route_of_administration_dosage;
pub mod substance_route_of_administration_phase;
pub mod substance_synonym;
pub mod substance_tolerance;

#[derive(Debug)]
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(migrations::m20220101_000001_init::Migration),
        ]
    }
}