use sea_orm_migration::{IntoSchemaManagerConnection, MigratorTrait};
use structopt::StructOpt;
use crate::cli::main::cli;

mod cli;
mod orm;
mod db;
mod ingestion;
mod service;

#[tokio::main]
async fn main() {
    cli().await;
}
