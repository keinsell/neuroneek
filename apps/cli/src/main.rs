#![feature(duration_constructors)]

mod cli;
mod core;
mod ingestion_analyzer;
mod ingestion_intelligence;
mod orm;
mod service;

fn main() {
    cli::bin::main()
}
