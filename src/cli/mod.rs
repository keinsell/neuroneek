use atty::Stream;
use clap::ColorChoice;
use clap::CommandFactory;
use clap::Parser;
use clap::Subcommand;
use ingestion::IngestionCommand;
use miette::IntoDiagnostic;
use sea_orm::prelude::async_trait::async_trait;
use substance::SubstanceCommand;
use std::path::PathBuf;

use crate::core::CommandHandler;
use crate::utils::AppContext;
use analyze::AnalyzeIngestion;
mod analyze;
mod ingestion;
mod stats;
pub mod substance;
pub mod formatter;

fn is_interactive() -> bool { atty::is(Stream::Stdout) }

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

impl Default for OutputFormat
{
    fn default() -> Self
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
    async fn handle<'a>(&self, _ctx: AppContext<'a>) -> miette::Result<()>
    {
        clap_complete::generate(
            self.shell,
            &mut Cli::command(),
            env!("CARGO_BIN_NAME"),
            &mut std::io::stdout(),
        );
        Ok(())
    }
}


#[async_trait]
impl CommandHandler for ApplicationCommands
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()>
    {
        match self
        {
            | ApplicationCommands::Ingestion(ingestion_command) =>
            {
                ingestion_command.handle(ctx).await
            }
            | ApplicationCommands::Substance(cmd) => cmd.handle(ctx).await,
            | ApplicationCommands::Completions(cmd) => cmd.handle(ctx).await,
            | ApplicationCommands::Analyzer(cmd) => cmd.handle(ctx).await,
            | ApplicationCommands::Stats(cmd) => cmd.handle(ctx).await,
        }
    }
}


#[derive(Subcommand)]
pub enum ApplicationCommands
{
    /// Manage ingestion entries
    Ingestion(IngestionCommand),
    /// Query substance.rs information
    Substance(SubstanceCommand),
    /// Analyze existing or non-existing ingestion
    Analyzer(AnalyzeIngestion),
    /// Generate shell completions
    Completions(GenerateCompletion),
    Stats(stats::GetStatistics),
}

/// 🧬 Intelligent dosage tracker application with purpose to monitor
/// supplements, nootropics and psychoactive substances along with their
/// long-term influence on one's mind and body.
#[derive(Parser)]
#[command(
    version = env!("CARGO_PKG_VERSION"),
    about = "🧬 Intelligent dosage tracker application with purpose to monitor supplements, nootropics and psychoactive substances along with their long-term influence on one's mind and body.",
    long_about,
    color = ColorChoice::Auto,
)]
pub struct Cli
{
    #[command(subcommand)]
    pub command: ApplicationCommands,

    /// Pretty-print or return raw version of data in JSON
    #[arg(short, long = "format", value_enum, default_value_t = OutputFormat::default())]
    pub format: OutputFormat,

    #[command(flatten)]
    verbose: clap_verbosity_flag::Verbosity,
}
