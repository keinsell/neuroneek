#![feature(register_tool)]
#![register_tool(tarpaulin)]

use sea_orm_migration::MigratorTrait;

use smol_macros::main;

mod config;
use crate::state::DATABASE_CONNECTION;
use clap::Args;
use clap::Parser;
use clap::Subcommand;

mod database;
mod ingestion;
mod lib;
mod logging;
mod route_of_administration;
mod state;

use crate::ingestion::DeleteIngestion;
use crate::ingestion::IngestionRouter;
use crate::ingestion::ListIngestions;
use crate::ingestion::LogIngestion;
use crate::ingestion::UpdateIngestion;
use crate::lib::CommandHandler;
use sea_orm_migration::IntoSchemaManagerConnection;
use state::*;
use tracing_attributes::instrument;

#[derive(Parser)]
#[command(
    version = env!("CARGO_PKG_VERSION"),
    about = "Dosage journal that knows!",
    long_about = "🧬 Intelligent dosage tracker application with purpose to monitor supplements, nootropics and psychoactive substances along with their long-term influence on one's mind and body."
)]
struct CommandLineInterface
{
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands
{
    Log(LogIngestion),
    List(ListIngestions),
    Delete(DeleteIngestion),
    Update(UpdateIngestion),
    Ingestion(IngestionRouter),
}

#[instrument(level = "trace")]
async fn migrate_database(db_connection: &DatabaseConnection)
{
    let pending_migrations =
        database::Migrator::get_pending_migrations(&db_connection.into_schema_manager_connection())
            .await
            .expect("Failed to read pending migrations");

    if !pending_migrations.is_empty()
    {
        println!("There are {} migrations pending.", pending_migrations.len());
        println!("Applying migrations...");
        database::Migrator::up(db_connection.into_schema_manager_connection(), None)
            .await
            .expect("Failed to apply migrations");
    }
}


main! {
async fn main()
{
    // setup_logging().expect("failed to setup logging");
    let cli = CommandLineInterface::parse();
    let db_connection = &DATABASE_CONNECTION;

    migrate_database(db_connection).await;

match &cli.command
{
    | Some(Commands::Log(log_ingestion)) =>
        {
            log_ingestion.handle(db_connection).await.unwrap_or_else(|e| {
                eprintln!("Error handling log command: {}", e);
                std::process::exit(1);
            });
        }
    | Some(Commands::List(list_ingestions)) =>
        {
            list_ingestions.handle(db_connection).await.unwrap_or_else(|e| {
                eprintln!("Error handling list command: {}", e);
                std::process::exit(1);
            });
        }
        | Some(Commands::Delete(delete_ingestion)) =>
        {
            delete_ingestion.handle(db_connection).await.unwrap_or_else(|e| {
                eprintln!("Error handling delete command: {}", e);
                std::process::exit(1);
            })
        }
    | Some(Commands::Update(update_ingestion)) =>
        {
            update_ingestion.handle(db_connection).await.unwrap_or_else(|e| {
                eprintln!("Error handling update command: {}", e);
                std::process::exit(1);
            })
        }
    | Some(Commands::Ingestion(ingestion_router)) =>
        {
            ingestion_router.handle(db_connection).await.unwrap_or_else(|e| {
                eprintln!("Error handling ingestion command: {}", e);
                std::process::exit(1);
            })
            }
    | None =>
        {
            println!("No command provided. Use --help for usage information.");
        }
    }
}
}
