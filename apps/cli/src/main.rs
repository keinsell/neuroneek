use async_std::{task};
use sea_orm_migration::{IntoSchemaManagerConnection, MigratorTrait};
use structopt::StructOpt;
use crate::cli::main::cli;

mod cli;
mod orm;
mod db;
mod ingestion;
mod service;
mod core;
mod internal;
mod ingestion_analyzer;


fn main() {
    task::block_on(cli());
}
