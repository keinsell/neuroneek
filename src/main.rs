#![allow(unused_imports)]
extern crate chrono;
extern crate chrono_english;
extern crate date_time_parser;
#[macro_use] extern crate log;
use prelude::*;

use crate::cli::Cli;
use crate::utils::AppContext;
use crate::utils::CommandHandler;
use crate::utils::DATABASE_CONNECTION;
use crate::utils::migrate_database;
use crate::utils::setup_diagnostics;
use crate::utils::setup_logger;
use atty::Stream;
use clap::Parser;
use std::env;

mod analyzer;
mod cli;
pub mod formatter;
mod ingestion;
mod journal;
mod migration;
pub mod orm;
mod prelude;
mod substance;
mod tui;
mod utils;

#[async_std::main]
async fn main() -> miette::Result<()>
{
    setup_diagnostics();
    setup_logger();

    migrate_database(&DATABASE_CONNECTION)
        .await
        .expect("Database migration failed");

    // TODO: Perform a check of completion scripts existence and update them or
    // install them https://askubuntu.com/a/1188315
    // https://github.com/scop/bash-completion#faq
    // https://apple.github.io/swift-argument-parser/documentation/argumentparser/installingcompletionscripts/
    // https://unix.stackexchange.com/a/605051

    let no_args_provided = env::args().len() == 1;
    let is_interactive_terminal = atty::is(Stream::Stdout);

    // By default, application should use TUI if no arguments are provided
    // and the output is a terminal, otherwise it should use CLI.
    if no_args_provided && is_interactive_terminal && cfg!(feature = "experimental-tui")
    {
        tui::tui()?;
        Ok(())
    }
    else
    {
        let cli = Cli::parse();

        let context = AppContext {
            database_connection: &DATABASE_CONNECTION,
            stdout_format: cli.format,
        };

        cli.command.handle(context).await
    }
}
