extern crate chrono;
extern crate chrono_english;
extern crate date_time_parser;

use crate::cli::CLI;
use clap::CommandFactory;
use clap::Parser;
use lib::CommandHandler;
use lib::Context;
use lib::DATABASE_CONNECTION;
use lib::migrate_database;
use lib::setup_diagnostics;
use lib::setup_logger;

mod cli;
mod lib;


#[async_std::main]
async fn main() -> miette::Result<()>
{
    setup_diagnostics();
    setup_logger();

    let cli = CLI::parse();

    migrate_database(&DATABASE_CONNECTION).await?;

    // TODO: Perform a check of completion scripts existence and update them or
    // install them https://askubuntu.com/a/1188315
    // https://github.com/scop/bash-completion#faq
    // https://apple.github.io/swift-argument-parser/documentation/argumentparser/installingcompletionscripts/
    // https://unix.stackexchange.com/a/605051

    let context = Context {
        database_connection: &DATABASE_CONNECTION,
        stdout_format: cli.format,
    };

    cli.command.handle(context).await?;

    Ok(())
}
