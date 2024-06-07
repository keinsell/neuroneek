use async_std::task;

use crate::cli::main::cli;

mod cli;
mod core;
mod ingestion;
mod ingestion_analyzer;
mod orm;
mod service;

fn main() {
    task::block_on(cli());
}
