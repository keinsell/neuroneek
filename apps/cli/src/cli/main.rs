use log::debug;
use migrator::Migrator;
use sea_orm_migration::{IntoSchemaManagerConnection, MigratorTrait};
use structopt::StructOpt;
use crate::cli::ingestion::create_ingestion::handle_create_ingestion;
use crate::cli::ingestion::delete_ingestion::delete_ingestion;
use crate::cli::ingestion::IngestionCommand;
use crate::cli::ingestion::plan_ingestion::handle_plan_ingestion;
use crate::cli::substance::list_substances::list_substances;
use crate::ingestion::{list_ingestion};
use crate::orm;
use crate::service::scrapper::refresh_substances;

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
    #[structopt(name = "data", about = "Manipulate data files")]
    Data(DataManagementCommand),
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
    let cli = CommandLineInterface::from_args();

    let db = match orm::setup_database().await {
        Ok(db) => db,
        Err(error) => panic!("Could not connect to database: {}", error),
    };

    // #[cfg(feature = "dev")]
    // match Migrator::fresh(db.into_schema_manager_connection()).await {
    //     Ok(_) => println!("Migrations applied"),
    //     Err(error) => panic!("Error applying migrations: {}", error),
    // };

    match Migrator::up(db.into_schema_manager_connection(), None).await {
        Ok(_) => debug!("Migrations applied"),
        Err(error) => panic!("Could not migrate database schema: {}", error),
    };

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
        Commands::Data(data) => match data {
            DataManagementCommand::Path {} => {
                todo!("Get path to data file")
            }
            DataManagementCommand::RefreshDatasource {} => {
                refresh_substances(&db).await;
            }
        },
    }
}