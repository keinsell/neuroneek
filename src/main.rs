use crate::lib::{CommandHandler, Context, DATABASE_CONNECTION};
use clap::{Parser, Subcommand};
use rust_embed::Embed;
use lib::migrate_database;
use sea_orm::prelude::async_trait::async_trait;

mod db;
mod ingestion;
mod lib;

#[derive(Embed)]
#[folder = "resources/"]
pub struct Resources;

#[derive(Parser)]
#[command(
    version = env!("CARGO_PKG_VERSION"),
    about = "Dosage journal that knows!",
    long_about = "🧬 Intelligent dosage tracker application with purpose to monitor supplements, nootropics and psychoactive substances along with their long-term influence on one's mind and body."
)]
pub struct CLI {
    #[command(subcommand)]
    pub command: ApplicationCommands,
}

#[derive(Subcommand)]
pub enum ApplicationCommands {
    Ingestion(ingestion::IngestionCommand),
}

#[async_trait]
impl CommandHandler for ApplicationCommands {
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()> {
        match self {
            ApplicationCommands::Ingestion(ingestion_command) => {
                ingestion_command.handle(context).await
            }
        }
    }
}

#[async_std::main]
async fn main() {
    miette::set_panic_hook();

    println!(
        "{}",
        figlet_rs::FIGfont::from_content(std::str::from_utf8(&*Resources::get("small.flf").expect("Font file not found").data).expect("REASON"))
            .unwrap()
            .convert("psylog")
            .unwrap()
    );

    let cli = CLI::parse();

    let context = Context {
        database_connection: &*DATABASE_CONNECTION,
    };

    migrate_database(&context.database_connection).await;

    cli.command.handle(context).await.unwrap();
}
