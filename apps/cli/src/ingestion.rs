use crate::entities::ingestion::{ActiveModel, Model};
use crate::entities::prelude::Ingestion;

use chrono::Utc;
use sea_orm::{ActiveValue, DatabaseConnection, EntityTrait};
use serde::{Deserialize, Serialize};
use serde_json::de::from_reader;
use serde_json::ser::to_writer_pretty;
use std::fs::{File, OpenOptions};
use std::io::BufReader;
use std::path::Path;
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

pub fn load_ingestions(file_path: &Path) -> Vec<IngestionStructure> {
    if let Ok(file) = File::open(file_path) {
        from_reader(BufReader::new(file)).unwrap_or_default()
    } else {
        Vec::new()
    }
}

pub fn save_ingestions(data_file: &Path, ingestions: &[IngestionStructure]) {
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

pub async fn db_create_ingestion(
    db: &DatabaseConnection,
    create_ingestion: IngestionStructure,
) -> Model {
    let ingestion_payload: ActiveModel = ActiveModel {
        id: ActiveValue::NotSet,
        ingested_at: ActiveValue::Set(create_ingestion.ingested_at.to_rfc3339()),
        dosage: ActiveValue::Set(create_ingestion.dosage),
        substance_name: ActiveValue::Set(create_ingestion.substance_name),
    };

    let ingestion = Ingestion::insert(ingestion_payload)
        .exec_with_returning(db)
        .await
        .unwrap();

    println!("Ingestion created with ID: {}", ingestion.id);

    return ingestion;
}

#[derive(Tabled, Serialize, Deserialize, Debug)]
pub struct IngestionStructure {
    pub(crate) id: i32,
    pub(crate) substance_name: String,
    pub(crate) dosage: String,
    pub(crate) ingested_at: chrono::DateTime<Utc>,
}
