extern crate chrono;
extern crate chrono_english;
extern crate date_time_parser;

use atty::Stream;
use clap::CommandFactory;
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

mod analyzer;
mod command;
mod ingestion;
mod lib;
pub(crate) mod substance;
mod view_model;

#[derive(Embed)]
#[folder = "resources/"]
pub struct Resources;

lazy_static! {
    pub static ref FIGFONT: figlet_rs::FIGfont = figlet_rs::FIGfont::from_content(
        std::str::from_utf8(&Resources::get("small.flf").unwrap().data).unwrap()
    )
    .unwrap();
    static ref FIGURE: figlet_rs::FIGure<'static> = FIGFONT.convert("neuronek").unwrap();
}

fn is_interactive() -> bool { atty::is(Stream::Stdout) }

fn default_output_format() -> OutputFormat
{
    if is_interactive()
    {
        OutputFormat::Pretty
    }
    else
    {
        OutputFormat::Json
    }
}

#[derive(clap::ValueEnum, Clone, Debug)]
/// The output format specifies how application data is presented:
///
/// - `Pretty`: Used in interactive shells to display data in a visually
///   appealing table format.
/// - `Json`: Used in non-interactive shells (e.g., scripts or when data is
///   piped) to provide raw JSON for automated parsing.
pub enum OutputFormat
{
    /// Pretty printed tables
    Pretty,
    /// JSON formatted output
    Json,
    // TODO: Application may support custom templates like liquidless or smth
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

    /// Pretty-print or return raw version of data in JSON
    #[arg(short, long = "format", value_enum, default_value_t = default_output_format())]
    pub format: OutputFormat,

    #[command(flatten)]
    verbose: clap_verbosity_flag::Verbosity,
}


fn default_complete_shell() -> clap_complete::Shell
{
    clap_complete::shells::Shell::from_env().unwrap_or(clap_complete::Shell::Bash)
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
            env!("CARGO_BIN_NAME"),
            &mut std::io::stdout(),
        );
        Ok(())
    }
}

#[derive(Subcommand)]
pub enum ApplicationCommands
{
    Ingestion(command::IngestionCommand),
    Substance(command::SubstanceCommand),
    Analyze(command::AnalyzeIngestion),
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
            | ApplicationCommands::Analyze(cmd) => cmd.handle(context).await,
            | _ => Ok(()),
        }
    }
}

#[async_std::main]
async fn main() -> miette::Result<()>
{
    setup_diagnostics();
    setup_logger();

    let cli = CLI::parse();

    migrate_database(&DATABASE_CONNECTION).await?;

    // TODO: Perform a check of completion scripts existance and update them or
    // install them https://askubuntu.com/a/1188315
    // https://github.com/scop/bash-completion#faq
    // https://apple.github.io/swift-argument-parser/documentation/argumentparser/installingcompletionscripts/
    // https://unix.stackexchange.com/a/605051

    let context = Context {
        database_connection: &DATABASE_CONNECTION,
        stdout_format: cli.format,
        is_interactive: is_interactive(),
    };

    cli.command.handle(context).await?;

    Ok(())
}
