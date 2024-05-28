mod substance;
mod persistance;

use serde::{Deserialize, Serialize};
use serde_json::{to_writer_pretty, from_reader};
use std::fs::{File, OpenOptions};
use std::io::BufReader;
use std::path::{Path};
use chrono::{Utc};
use structopt::StructOpt;
use chrono_english::{parse_date_string, Dialect};
use xdg::BaseDirectories;
use tabled::{Table, Tabled};
use crate::persistance::{get_database_connection, initialize_database};

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
    #[structopt(name = "substance", about = "Get information about substances.", alias = "s")]
    Substance(SubstanceCommands),
    #[structopt(name = "ingestion", about = "Manipulate, view and delete ingestions.", alias = "i")]
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

#[derive(Tabled)]
#[derive(Serialize, Deserialize, Debug)]
struct Ingestion {
    id: i32,
    substance_name: String,
    dosage: String,
    ingested_at: chrono::DateTime<Utc>,
}

#[tokio::main]
async fn main() {
    let cli = CommandLineInterface::from_args();
    let xdg_dirs = BaseDirectories::with_prefix("neuronek").unwrap();
    let data_file = xdg_dirs.place_data_file("journal.json").unwrap();

    // initialize_database();
    // get_database_connection().await.close().await.unwrap();


    println!("Connected to database.");

    println!("Loading data from {:#?}", data_file.as_path());
    let ingestions = load_ingestions(data_file.as_path());
    println!("{:#?}", ingestions);


    match cli.command {
        Commands::Ingestion(ingestion) => match ingestion {
            IngestionCommands::CreateIngestion { substance_name, ingested_at, dosage } => {
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
            IngestionCommands::IngestionDelete { ingestion_id } => delete_ingestion(ingestion_id, data_file.as_path()),
            IngestionCommands::IngestionList { .. } => list_ingestions(data_file.as_path()),
            IngestionCommands::Dump {} => {
                println!("Not implemented yet!")
            }
        }
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
        }
    }
}

fn load_ingestions(file_path: &Path) -> Vec<Ingestion> {
    if let Ok(file) = File::open(file_path) {
        from_reader(BufReader::new(file)).unwrap_or_default()
    } else {
        Vec::new()
    }
}

fn save_ingestions(data_file: &Path, ingestions: &[Ingestion]) {
    let file = OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(data_file)
        .unwrap();
    to_writer_pretty(file, &ingestions).unwrap();
}

fn delete_ingestion(ingestion_id: i32, data_file: &Path) {
    let mut ingestions = load_ingestions(data_file);

    if let Some(index) = ingestions.iter().position(|i| i.id == ingestion_id) {
        ingestions.remove(index);
        save_ingestions(
            data_file,
            &ingestions,
        );
        println!("Ingestion with ID {} deleted.", ingestion_id);
    } else {
        println!("Ingestion with ID {} not found.", ingestion_id);
    }
}

fn list_ingestions(data_file: &Path) {
    let ingestions = load_ingestions(data_file);

    let table = Table::new(ingestions).to_string();

    println!("{}", table);
}