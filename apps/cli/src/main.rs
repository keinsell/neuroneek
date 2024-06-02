use crate::cli::main::cli;
use async_std::task;

mod cli;
mod core;
mod db;
mod ingestion;
mod ingestion_analyzer;
mod internal;
mod orm;
mod service;

fn main() {
    task::block_on(cli());
}
