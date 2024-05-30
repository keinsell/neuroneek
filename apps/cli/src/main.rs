mod cli;
mod db;
mod entities;
mod ingestion;
mod substance;
use crate::ingestion::{create_ingestion, delete_ingestion};
use crate::substance::list_substances;
use ingestion::list_ingestions;
use log::debug;
use migrator::Migrator;
use sea_orm_migration::{IntoSchemaManagerConnection, MigratorTrait};
use structopt::StructOpt;

#[derive(StructOpt, Debug)]
#[structopt(
    name = "neuronek",
    about = "Minimal visable product of neuronek which have pure local functionality without prettifiers."
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
    #[structopt(name = "create")]
    CreateSubstance {},
    #[structopt(name = "delete")]
    DeleteSubstance {},
    #[structopt(name = "dump")]
    DumpSubstance {},
}

#[derive(StructOpt, Debug)]
struct DeleteIngestion {
    #[structopt(short, long)]
    pub ingestion_id: i32,
}

#[derive(StructOpt, Debug)]
enum IngestionCommand {
    #[structopt(
        name = "create",
        about = "Create new ingestion by providing substance name and dosage in string."
    )]
    Create(cli::ingestion::create::CreateIngestion),
    #[structopt(name = "delete")]
    IngestionDelete(DeleteIngestion),
    #[structopt(name = "list", about = "List all ingestion's in table")]
    IngestionList {},
}

#[derive(StructOpt, Debug)]
enum DataManagementCommand {
    #[structopt(name = "path", about = "Returns the path to the data file")]
    Path {},
}

#[tokio::main]
async fn main() {
    let cli = CommandLineInterface::from_args();

    let db = match db::setup_database().await {
        Ok(db) => db,
        Err(error) => panic!("Could not connect to database: {}", error),
    };

    match Migrator::up(db.into_schema_manager_connection(), None).await {
        Ok(_) => debug!("Migrations applied"),
        Err(error) => panic!("Could not migrate database schema: {}", error),
    };

    // match Migrator::fresh(db.into_schema_manager_connection()).await {
    //     Ok(_) => println!("Migrations applied"),
    //     Err(error) => panic!("Error applying migrations: {}", error),
    // };

    match cli.command {
        Commands::Ingestion(ingestion) => match ingestion {
            IngestionCommand::Create(create_ingestion_command) => {
                create_ingestion(&db, create_ingestion_command).await
            }
            IngestionCommand::IngestionDelete(delete_ingestion_command) => {
                delete_ingestion(&db, delete_ingestion_command.ingestion_id).await
            }
            IngestionCommand::IngestionList { .. } => list_ingestions(&db).await,
        },
        Commands::Substance(substance) => match substance {
            SubstanceCommand::ListSubstances {} => list_substances(&db).await,
            SubstanceCommand::CreateSubstance {} => {
                println!("Not implemented yet!")
            }
            SubstanceCommand::DeleteSubstance {} => {
                println!("Not implemented yet!")
            }
            SubstanceCommand::DumpSubstance {} => {
                println!("Not implemented yet!")
            }
        },
        Commands::Data(data) => match data {
            DataManagementCommand::Path {} => {
                todo!("Get path to data file")
            }
        },
    }
}
