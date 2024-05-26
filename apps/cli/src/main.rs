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

// TODO: Mass Parsing by string input

#[derive(StructOpt, Debug)]
#[structopt(
    name = "neuronek",
    about = "Minimal visable product of neuronek which have pure local functionality without prettifiers."
)]
struct Entrypoint {
    #[structopt(subcommand)]
    ingestion: Ingestions,
}


#[derive(StructOpt, Debug)]
enum Ingestions {
    #[structopt(
        name = "ingestion_create",
        about = "Create new ingestion by providing substance name and dosage in string."
    )]
    IngestionCreate {
        #[structopt(short, long)]
        substance_name: String,
        #[structopt(short, long)]
        dosage: String,
        #[structopt(short = "t", long = "time", default_value = "now")]
        ingested_at: String,
    },
    #[structopt(name = "ingestion_delete")]
    IngestionDelete {
        #[structopt(short, long)]
        ingestion_id: i32,
    },
    #[structopt(name = "ingestion_list", about = "List all ingestion's in table")]
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

fn main() {
    let cli = Entrypoint::from_args();

    let xdg_dirs = BaseDirectories::with_prefix("neuronek").unwrap();
    let data_file = xdg_dirs.place_data_file("journal.json").unwrap();

    match cli.ingestion {
        Ingestions::IngestionCreate { substance_name, ingested_at, dosage } => {
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
        Ingestions::IngestionDelete { ingestion_id } => {
            let mut ingestions = load_ingestions(data_file.as_path());

            if let Some(index) = ingestions.iter().position(|i| i.id == ingestion_id) {
                ingestions.remove(index);
                save_ingestions(
                    data_file.as_path(),
                    &ingestions,
                );
                println!("Ingestion with ID {} deleted.", ingestion_id);
            } else {
                println!("Ingestion with ID {} not found.", ingestion_id);
            }
        }
        Ingestions::IngestionList { .. } => {
            let ingestions = load_ingestions(data_file.as_path());

            let table = Table::new(ingestions).to_string();

            println!("{}", table);
        }
        Ingestions::Dump {} => {
            println!("Not implemented yet!")
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