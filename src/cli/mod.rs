use crate::database::entities::ingestion::Column as IngestionColumn;
use crate::database::entities::ingestion::Entity as IngestionEntity;
use crate::database::entities::ingestion_phase::Column as IngestionPhaseColumn;
use crate::database::entities::ingestion_phase::Entity as IngestionPhaseEntity;
use atty::Stream;
use chrono::Duration;
use chrono::NaiveDateTime;
use chrono::Utc;
use clap::ColorChoice;
use clap::CommandFactory;
use clap::Parser;
use clap::Subcommand;
use ingestion::IngestionCommand;
use journal::ViewJournal;
use miette::IntoDiagnostic;
use sea_orm::prelude::*;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use std::collections::HashMap;
use substance::SubstanceCommand;
use textplots::Chart;
use textplots::Plot;
use textplots::Shape;

use crate::core::CommandHandler;
use crate::utils::AppContext;
pub mod formatter;
mod ingestion;
mod journal;
pub mod substance;

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

#[async_trait::async_trait]
impl CommandHandler for ApplicationCommands
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()>
    {
        match self
        {
            | ApplicationCommands::Ingestion(cmd) => cmd.handle(ctx).await,
            | ApplicationCommands::Substance(cmd) => cmd.handle(ctx).await,
            | ApplicationCommands::Journal(cmd) => cmd.handle(ctx).await,
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
    /// View today's ingestion journal
    Journal(ViewJournal),
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
