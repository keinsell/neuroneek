mod db;
mod ingestion;

mod entities;
mod substance;

use crate::ingestion::{
    db_create_ingestion, delete_ingestion, list_ingestions, load_ingestions, save_ingestions,
};
use crate::substance::list_substances;
use chrono::Utc;
use chrono_english::{parse_date_string, Dialect};
use ingestion::IngestionStructure;
use migrator::Migrator;
use sea_orm::TryIntoModel;
use sea_orm_migration::{IntoSchemaManagerConnection, MigratorTrait};
use structopt::StructOpt;
use xdg::BaseDirectories;

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
struct CreateIngestionCommand {
    #[structopt(short, long)]
    pub substance_name: String,
    #[structopt(short, long)]
    pub dosage: String,
    #[structopt(short = "t", long = "time", default_value = "now")]
    pub ingested_at: String,
}

#[derive(StructOpt, Debug)]
enum IngestionCommand {
    #[structopt(
        name = "create",
        about = "Create new ingestion by providing substance name and dosage in string."
    )]
    CreateIngestionCommand(CreateIngestionCommand),
    #[structopt(name = "delete")]
    IngestionDelete {
        #[structopt(short, long)]
        ingestion_id: i32,
    },
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
    let xdg_dirs = BaseDirectories::with_prefix("neuronek").unwrap();
    let data_file = xdg_dirs.place_data_file("journal.json").unwrap();

    // TODO: For the old users of CLI we need to migrate JSON file to SQLite database

    let db = match db::setup_database().await {
        Ok(db) => db,
        Err(error) => panic!("Error connecting to database: {}", error),
    };

    // match Migrator::up(db.into_schema_manager_connection(), None).await {
    //     Ok(_) => println!("Migrations applied"),
    //     Err(error) => panic!("Error applying migrations: {}", error),
    // };

    match Migrator::fresh(db.into_schema_manager_connection()).await {
        Ok(_) => println!("Migrations applied"),
        Err(error) => panic!("Error applying migrations: {}", error),
    };

    // List all ingestion's from database
    println!("Loading data from {:#?}", data_file.as_path());
    let ingestion = load_ingestions(data_file.as_path());
    println!("{:#?}", ingestion);

    match cli.command {
        Commands::Ingestion(ingestion) => match ingestion {
            IngestionCommand::CreateIngestionCommand(CreateIngestionCommand {
                substance_name,
                ingested_at,
                dosage,
            }) => {
                println!("Loading ingestions from {:#?}", data_file.as_path());
                let mut ingestions = load_ingestions(data_file.as_path());

                let parsed_time = parse_date_string(&ingested_at, Utc::now(), Dialect::Us)
                    .unwrap_or_else(|_| Utc::now());

                let new_ingestion = IngestionStructure {
                    id: ingestions.len() as i32 + 1,
                    substance_name,
                    ingested_at: parsed_time,
                    dosage,
                };

                let created_ingestion = match db_create_ingestion(&db, new_ingestion)
                    .await
                    .try_into_model()
                {
                    Ok(ingestion) => ingestion,
                    Err(error) => panic!("Error creating ingestion: {}", error),
                };

                ingestions.push(IngestionStructure {
                    id: created_ingestion.id,
                    substance_name: created_ingestion.substance_name,
                    ingested_at: parsed_time,
                    dosage: created_ingestion.dosage,
                });

                save_ingestions(data_file.as_path(), &ingestions);

                println!("Ingestion created with ID: {}", ingestions.len());
            }
            IngestionCommand::IngestionDelete { ingestion_id } => {
                delete_ingestion(ingestion_id, data_file.as_path())
            }
            IngestionCommand::IngestionList { .. } => list_ingestions(data_file.as_path()),
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
            DataManagementCommand::Path {} => println!("Data path: {}", data_file.display()),
        },
    }
}
