#![feature(duration_constructors)]

use async_std::task;

use crate::cli::main::cli;
use crate::core::dosage::test_measurements;

mod cli;
mod core;
mod ingestion_analyzer;
mod orm;
mod service;

fn main() {
    cli::bin::main()
}
