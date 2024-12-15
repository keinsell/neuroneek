extern crate chrono;
extern crate chrono_english;
extern crate date_time_parser;

use clap::Parser;
use clap::Subcommand;
use clap::command;
use lazy_static::lazy_static;
use lib::CommandHandler;
use lib::Context;
use lib::DATABASE_CONNECTION;
use lib::migrate_database;
use lib::setup_diagnostics;
use lib::setup_logger;
use rust_embed::Embed;
use sea_orm::prelude::async_trait::async_trait;
use std::string::ToString;

mod command;
mod db;
mod ingestion;
mod lib;
mod orm;
mod substance;

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
    Substance(substance::SubstanceCommand),
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
            | ApplicationCommands::Substance(cmd) => cmd.handle(context).await,
        }
    }
}

#[async_std::main]
async fn main()
{
    setup_diagnostics();
    setup_logger();

    let cli = CLI::parse();

    // TODO: Perform a check of completion scripts existance and update them or
    // install them https://askubuntu.com/a/1188315
    // https://github.com/scop/bash-completion#faq
    // https://apple.github.io/swift-argument-parser/documentation/argumentparser/installingcompletionscripts/
    // https://unix.stackexchange.com/a/605051

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
