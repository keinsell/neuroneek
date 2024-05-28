mod db;
mod ingestion;

use crate::db::initialize_database;
use crate::ingestion::{delete_ingestion, list_ingestions, load_ingestions, save_ingestions};
use chrono::Utc;
use chrono_english::{parse_date_string, Dialect};
use ingestion::Ingestion;
use serde::{Deserialize, Serialize};
use structopt::StructOpt;
use tabled::Tabled;
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
    Substance(SubstanceCommands),
    #[structopt(
        name = "ingestion",
        about = "Manipulate, view and delete ingestions.",
        alias = "i"
    )]
    Ingestion(IngestionCommands),
}

#[derive(StructOpt, Debug)]
enum SubstanceCommands {
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
enum IngestionCommands {
    #[structopt(
        name = "create",
        about = "Create new ingestion by providing substance name and dosage in string."
    )]
    CreateIngestion {
        #[structopt(short, long)]
        substance_name: String,
        #[structopt(short, long)]
        dosage: String,
        #[structopt(short = "t", long = "time", default_value = "now")]
        ingested_at: String,
    },
    #[structopt(name = "delete")]
    IngestionDelete {
        #[structopt(short, long)]
        ingestion_id: i32,
    },
    #[structopt(name = "list", about = "List all ingestion's in table")]
    IngestionList {},
    #[structopt(name = "dump", about = "Print out all known data to cli")]
    Dump {},
}

#[tokio::main]
async fn main() {
    let cli = CommandLineInterface::from_args();
    let xdg_dirs = BaseDirectories::with_prefix("neuronek").unwrap();
    let data_file = xdg_dirs.place_data_file("journal.json").unwrap();
    initialize_database();

    // TODO: Add programmatic way to database that should automatically discover
    // version of database used by user and the one that is installed on the system.
    // This way we can have a single binary that can be used on different systems
    // and we can have a single database that can be used on different versions of
    // database.

    println!("Loading data from {:#?}", data_file.as_path());
    let ingestion = load_ingestions(data_file.as_path());
    println!("{:#?}", ingestion);

    match cli.command {
        Commands::Ingestion(ingestion) => match ingestion {
            IngestionCommands::CreateIngestion {
                substance_name,
                ingested_at,
                dosage,
            } => {
                println!("Loading ingestions from {:#?}", data_file.as_path());
                let mut ingestions = load_ingestions(data_file.as_path());

                let parsed_time = parse_date_string(&ingested_at, Utc::now(), Dialect::Us)
                    .unwrap_or_else(|_| Utc::now());

                let new_ingestion = Ingestion {
                    id: ingestions.len() as i32 + 1,
                    substance_name,
                    ingested_at: parsed_time,
                    dosage: dosage,
                };

                ingestions.push(new_ingestion);
                save_ingestions(data_file.as_path(), &ingestions);

                println!("Ingestion created with ID: {}", ingestions.len());
            }
            IngestionCommands::IngestionDelete { ingestion_id } => {
                delete_ingestion(ingestion_id, data_file.as_path())
            }
            IngestionCommands::IngestionList { .. } => list_ingestions(data_file.as_path()),
            IngestionCommands::Dump {} => {
                println!("Not implemented yet!")
            }
        },
        Commands::Substance(substance) => match substance {
            SubstanceCommands::ListSubstances {} => {
                println!("Not implemented yet!")
            }
            SubstanceCommands::CreateSubstance {} => {
                println!("Not implemented yet!")
            }
            SubstanceCommands::DeleteSubstance {} => {
                println!("Not implemented yet!")
            }
            SubstanceCommands::DumpSubstance {} => {
                println!("Not implemented yet!")
            }
        },
    }
}
