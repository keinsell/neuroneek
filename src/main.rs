extern crate chrono;
extern crate chrono_english;
extern crate date_time_parser;

use clap::command;
use clap::Args;
use clap::CommandFactory;
use clap::Parser;
use clap::Subcommand;
use lazy_static::lazy_static;
use lib::migrate_database;
use lib::setup_diagnostics;
use lib::setup_logger;
use lib::CommandHandler;
use lib::Context;
use lib::DATABASE_CONNECTION;
use rust_embed::Embed;
use sea_orm::prelude::async_trait::async_trait;
use std::string::ToString;
use atty::Stream;

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

fn default_output_format() -> OutputFormat {
    if atty::is(Stream::Stdout) {
        OutputFormat::Pretty
    } else {
        OutputFormat::Json
    }
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
    
    /// Output format for the command results
    #[arg(short = 'o', long = "output", value_enum, default_value_t = default_output_format())]
    pub output_format: OutputFormat,
    
    #[command(flatten)]
    verbose: clap_verbosity_flag::Verbosity,
}

#[derive(clap::ValueEnum, Clone, Debug)]
pub enum OutputFormat {
    /// Pretty printed tables
    Pretty,
    /// JSON formatted output
    Json,
}

fn default_complete_shell() -> clap_complete::Shell
{
    clap_complete::shells::Shell::from_env().unwrap()
}

#[derive(Debug, Parser)]
struct GenerateCompletion
{
    /// The shell to generate the completions for
    #[arg(value_enum, default_value_t=default_complete_shell())]
    shell: clap_complete::Shell,
}

#[async_trait]
impl CommandHandler for GenerateCompletion
{
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        clap_complete::generate(
            self.shell,
            &mut CLI::command(),
            "psylog",
            &mut std::io::stdout(),
        );
        Ok(())
    }
}

#[derive(Subcommand)]
pub enum ApplicationCommands
{
    Ingestion(ingestion::IngestionCommand),
    Substance(substance::SubstanceCommand),
    /// Generate shell completions
    Completions(GenerateCompletion),
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
            | ApplicationCommands::Completions(cmd) => cmd.handle(context).await,
        }
    }
}

#[async_std::main]
async fn main()
{
    setup_diagnostics();
    setup_logger();

    let cli = CLI::parse();

    // TODO: Perform a check of completion scripts existance and update them or install them
    // https://askubuntu.com/a/1188315
    // https://github.com/scop/bash-completion#faq
    // https://apple.github.io/swift-argument-parser/documentation/argumentparser/installingcompletionscripts/
    // https://unix.stackexchange.com/a/605051

    let context = Context {
        database_connection: &DATABASE_CONNECTION,
        output_format: cli.output_format,
    };

    migrate_database(context.database_connection)
        .await
        .expect("Database migration failed!");

    cli.command
        .handle(context)
        .await
        .expect("Failed to execute command!");
}
