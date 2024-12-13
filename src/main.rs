extern crate chrono;
extern crate chrono_english;
extern crate date_time_parser;

use crate::lib::setup_diagnostics;
use crate::lib::setup_logger;
use crate::lib::CommandHandler;
use crate::lib::Context;
use crate::lib::DATABASE_CONNECTION;
use clap::command;
use clap::Parser;
use clap::Subcommand;
use lazy_static::lazy_static;
use lib::migrate_database;
use rust_embed::Embed;
use sea_orm::prelude::async_trait::async_trait;
use std::string::ToString;

mod db;
mod ingestion;
pub mod lib;

#[derive(Embed)]
#[folder = "resources/"]
pub struct Resources;

lazy_static! {
    static ref FIGFONT: figlet_rs::FIGfont = figlet_rs::FIGfont::from_content(
        std::str::from_utf8(&Resources::get("small.flf").unwrap().data).unwrap()
    )
    .unwrap();
    static ref FIGURE: figlet_rs::FIGure<'static> = FIGFONT.convert("psylog").unwrap();
}

#[derive(Parser)]
#[command(
    version = env!("CARGO_PKG_VERSION"),
    about = "🧬 Intelligent dosage tracker application with purpose to monitor supplements, nootropics and psychoactive substances along with their long-term influence on one's mind and body.",
    long_about = FIGURE.to_string()
)]
pub struct CLI
{
    #[command(subcommand)]
    pub command: ApplicationCommands,
    #[command(flatten)]
    verbose: clap_verbosity_flag::Verbosity,
}

#[derive(Subcommand)]
pub enum ApplicationCommands
{
    Ingestion(ingestion::IngestionCommand),
}

#[async_trait]
impl CommandHandler for ApplicationCommands
{
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        match self
        {
            | ApplicationCommands::Ingestion(ingestion_command) =>
            {
                ingestion_command.handle(context).await
            }
        }
    }
}

#[async_std::main]
async fn main()
{
    setup_diagnostics();
    setup_logger();

    let cli = CLI::parse();

    let context = Context {
        database_connection: &DATABASE_CONNECTION,
    };

    migrate_database(context.database_connection)
        .await
        .expect("Database migration failed!");
    cli.command
        .handle(context)
        .await
        .expect("Failed to execute command!");
}
