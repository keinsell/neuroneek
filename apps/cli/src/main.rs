#![feature(duration_constructors)]

mod cli;
mod core;
mod ingestion_analyzer;
mod orm;
mod service;
mod ingestion_intelligence;

fn main() {
    cli::bin::main()
}
