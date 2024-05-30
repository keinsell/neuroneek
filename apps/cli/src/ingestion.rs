use crate::entities::ingestion::{ActiveModel, Model};
use crate::entities::prelude::Ingestion;

use chrono::{DateTime, Utc};
use sea_orm::{ActiveValue, DatabaseConnection, DeleteResult, EntityTrait, TryIntoModel};
use serde::{Deserialize, Serialize};
use serde_json::de::from_reader;
use serde_json::ser::to_writer_pretty;
use std::fs::{File, OpenOptions};
use std::io::BufReader;
use std::path::Path;
use chrono_english::{Dialect, parse_date_string};
use futures::future::OptionFuture;
use tabled::{Table, Tabled};
use uom::typenum::Mod;
use crate::CreateIngestion;

pub fn load_ingestions(file_path: &Path) -> Vec<ViewModel> {
    if let Ok(file) = File::open(file_path) {
        from_reader(BufReader::new(file)).unwrap_or_default()
    } else {
        Vec::new()
    }
}

pub fn save_ingestions(data_file: &Path, ingestions: &[ViewModel]) {
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

pub async fn delete_ingestion(db: &DatabaseConnection, ingestion_id: i32) {
    let res = Ingestion::delete_by_id(ingestion_id).exec(db).await;
    let delete_response = res.expect("Error deleting ingestion");
    
    assert_eq!(delete_response.rows_affected, 1);
    println!("Ingestion with ID {} deleted.", ingestion_id);
}

pub async fn create_ingestion(
    db: &DatabaseConnection,
    create_ingestion: CreateIngestion,
) -> ViewModel {
    // Parse the date from relative to the current time
    let parsed_time = parse_date_string(&create_ingestion.ingested_at, Utc::now(), Dialect::Us)
        .unwrap_or_else(|_| Utc::now());
    
    let ingestion_payload: ActiveModel = ActiveModel {
        id: ActiveValue::NotSet,
        ingested_at: ActiveValue::Set(parsed_time.to_rfc3339()),
        dosage: ActiveValue::Set(create_ingestion.dosage),
        substance_name: ActiveValue::Set(create_ingestion.substance_name),
    };

    let ingestion = Ingestion::insert(ingestion_payload)
        .exec_with_returning(db)
        .await
        .unwrap();
    
    let view_model = ViewModel {
        id: ingestion.id,
        ingested_at: ingestion.ingested_at,
        dosage: ingestion.dosage,
        substance_name: ingestion.substance_name,
    };

    println!("Ingestion created with ID: {}", ingestion.id);

    return view_model;
}

#[derive(Tabled, Serialize, Deserialize, Debug)]
pub struct ViewModel {
    pub id: i32,
    pub ingested_at: String,
    pub dosage: String,
    pub substance_name: String,
}
