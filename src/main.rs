#![allow(unused_imports)]
#[macro_use] extern crate log;
#[macro_use] extern crate serde_derive;
use self::core::error_handling::setup_diagnostics;
use self::core::logging::setup_logger;

use crate::cli::Cli;
use crate::utils::migrate_database;
use crate::utils::AppContext;
use crate::utils::DATABASE_CONNECTION;

use atty::Stream;
use clap::Parser;
use core::CommandHandler;
use miette::Result;
use std::env;

mod analyzer;
mod cli;
mod core;
mod database;
mod ingestion;
mod prelude;
mod substance;
mod tui;
mod utils;

#[async_std::main]
async fn main() -> Result<()>
{
    setup_diagnostics();
    setup_logger();

    migrate_database(&DATABASE_CONNECTION)
        .await
        .expect("Database database failed");

    // TODO: Perform a check of completion scripts existence and update them or
    // install them https://askubuntu.com/a/1188315
    // https://github.com/scop/bash-completion#faq
    // https://apple.github.io/swift-argument-parser/documentation/argumentparser/installingcompletionscripts/
    // https://unix.stackexchange.com/a/605051

    let no_args_provided = env::args().len() == 1;
    let is_interactive_terminal = atty::is(Stream::Stdout);

    if no_args_provided && is_interactive_terminal
    {
        return tui::tui().await.map_err(|e| miette::miette!(e.to_string()));
    }

    let cli = Cli::parse();

    let context = AppContext {
        database_connection: &DATABASE_CONNECTION,
        stdout_format: cli.format,
    };

    cli.command.handle(context).await
}
