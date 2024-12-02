#![feature(register_tool)]
#![register_tool(tarpaulin)]

use sea_orm_migration::MigratorTrait;

use smol::block_on;

mod config;
use crate::state::DATABASE_CONNECTION;
use clap::Parser;
use clap::Subcommand;

mod database;
mod ingestion;
mod logging;
mod route_of_administration;
mod state;
use crate::ingestion::LogIngestion;
use neuronek_cli::CommandHandler;
use sea_orm_migration::IntoSchemaManagerConnection;
use crate::logging::setup_logging;

#[derive(Parser)]
#[command(
    version = env!("CARGO_PKG_VERSION"),
    about = "Dosage journal that knows!",
    long_about = "🧬 Intelligent dosage tracker application with purpose to monitor supplements, nootropics and psychoactive substances along with their long-term influence on one's mind and body."
)]
struct CommandLineInterface
{
    #[arg(short = 'v', long = "verbose", action = clap::ArgAction::Count, default_value_t=0)]
    verbosity: u8,

    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands
{
    Log(LogIngestion),
}

fn main()
{
    setup_logging().expect("failed to setup logging");

    let cli = CommandLineInterface::parse();
    let db_connection = &DATABASE_CONNECTION;


    block_on(async {
        let pending_migrations = database::Migrator::get_pending_migrations(
            &db_connection.into_schema_manager_connection(),
        )
            .await
            .expect("Failed to read pending migrations");

        if !pending_migrations.is_empty()
        {
            println!("There are {} migrations pending.", pending_migrations.len());
            // TODO: Do prejudicial backup of data
            println!("Applying migrations...");
            database::Migrator::up(db_connection.into_schema_manager_connection(), None)
                .await
                .expect("Failed to apply migrations");
        }
    });

    match &cli.command
    {
        | Some(Commands::Log(log_ingestion)) => log_ingestion.handle(db_connection).unwrap(),
        | _ => println!("No command provided"),
    }
}
