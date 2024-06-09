use human_panic::setup_panic;
use log::*;
use structopt::clap::Shell;
use structopt::StructOpt;

use crate::cli::ingestion::create_ingestion::handle_create_ingestion;
use crate::cli::ingestion::delete_ingestion::delete_ingestion;
use crate::cli::ingestion::IngestionCommand;
use crate::cli::ingestion::plan_ingestion::handle_plan_ingestion;
use crate::cli::substance::list_substances::list_substances;
use crate::ingestion::list_ingestion;
use crate::orm;
use crate::orm::migrate_database;

#[derive(StructOpt, Debug)]
#[structopt(
    name = "neuronek",
    about = "Minimal visible product of neuronek which have pure local functionality without prettifiers."
)]
struct CommandLineInterface {
    #[structopt(subcommand)]
    command: Commands,
}

#[derive(StructOpt, Debug)]
enum Commands {
    #[structopt(
        name = "substance",
        about = "Get information about substances.",
        alias = "s"
    )]
    Substance(SubstanceCommand),
    #[structopt(
        name = "ingestion",
        about = "Manipulate, view and delete ingestions.",
        alias = "i"
    )]
    Ingestion(IngestionCommand),
}

#[derive(StructOpt, Debug)]
enum SubstanceCommand {
    #[structopt(name = "list")]
    ListSubstances {},
}

#[derive(StructOpt, Debug)]
enum DataManagementCommand {
    #[structopt(name = "path", about = "Returns the path to the data file")]
    Path {},
    #[structopt(
        name = "refresh-substances",
        about = "Refreshes local database with cloud datasource"
    )]
    RefreshDatasource {},
}

pub async fn cli() {
    // Initialize panic hook
    setup_panic!();
    // Initialize logger
    stderrlog::new()
        // .module(module_path!())
        .show_level(true)
        .verbosity(2)
        .show_module_names(true)
        .init()
        .unwrap();

    info!("Starting neuronek CLI");
    info!("Version: {}", env!("CARGO_PKG_VERSION"));

    let db = match orm::setup_database().await {
        Ok(db) => db,
        Err(error) => panic!("Could not locate database file: {}", error),
    };

    CommandLineInterface::clap().gen_completions(env!("CARGO_PKG_NAME"), Shell::Bash, "target");

    let cli = CommandLineInterface::from_args();

    #[cfg(feature = "dev")]
    {
        use crate::orm::refresh_database_as_developer;
        refresh_database_as_developer().await;
    }

    migrate_database(&db).await;

    match cli.command {
        Commands::Ingestion(ingestion) => match ingestion {
            IngestionCommand::Create(create_ingestion_command) => {
                handle_create_ingestion(create_ingestion_command, &db).await
            }
            IngestionCommand::IngestionDelete(delete_ingestion_command) => {
                delete_ingestion(&db, delete_ingestion_command.ingestion_id).await
            }
            IngestionCommand::IngestionList { .. } => list_ingestion(&db).await,
            IngestionCommand::Plan(command) => handle_plan_ingestion(command).await,
        },
        Commands::Substance(substance) => match substance {
            SubstanceCommand::ListSubstances {} => list_substances(&db).await,
        },
    }
}
