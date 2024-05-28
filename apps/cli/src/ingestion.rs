use std::fs::{File, OpenOptions};
use std::io::BufReader;
use std::path::Path;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use serde_json::de::from_reader;
use serde_json::ser::to_writer_pretty;
use tabled::{Table, Tabled};

pub fn delete_ingestion(ingestion_id: i32, data_file: &Path) {
    let mut ingestions = load_ingestions(data_file);

    if let Some(index) = ingestions.iter().position(|i| i.id == ingestion_id) {
        ingestions.remove(index);
        save_ingestions(data_file, &ingestions);
        println!("Ingestion with ID {} deleted.", ingestion_id);
    } else {
        println!("Ingestion with ID {} not found.", ingestion_id);
    }
}

pub fn load_ingestions(file_path: &Path) -> Vec<Ingestion> {
    if let Ok(file) = File::open(file_path) {
        from_reader(BufReader::new(file)).unwrap_or_default()
    } else {
        Vec::new()
    }
}

pub fn save_ingestions(data_file: &Path, ingestions: &[Ingestion]) {
    let file = OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(data_file)
        .unwrap();
    to_writer_pretty(file, &ingestions).unwrap();
}

pub fn list_ingestions(data_file: &Path) {
    let ingestions = load_ingestions(data_file);

    let table = Table::new(ingestions).to_string();

    println!("{}", table);
}

#[derive(Tabled, Serialize, Deserialize, Debug)]
pub struct Ingestion {
    pub(crate) id: i32,
    pub(crate) substance_name: String,
    pub(crate) dosage: String,
    pub(crate) ingested_at: chrono::DateTime<Utc>,
}