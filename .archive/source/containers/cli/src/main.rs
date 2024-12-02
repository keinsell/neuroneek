#![feature(duration_constructors)]

mod cli;
mod core;
mod ingestion;
mod ingestion_analyzer;
mod orm;
mod service;

fn main() {
    cli::bin::main()
}
