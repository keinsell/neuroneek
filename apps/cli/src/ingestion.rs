use crate::entities::prelude::Ingestion;
use crate::{cli::ingestion::create::CreateIngestion, entities::ingestion::ActiveModel};
use chrono::Utc;
use chrono_english::{parse_date_string, Dialect};
use sea_orm::{ActiveValue, DatabaseConnection, EntityTrait};
use serde::{Deserialize, Serialize};
use std::fmt::Debug;
use tabled::{Table, Tabled};
pub async fn delete_ingestion(db: &DatabaseConnection, ingestion_id: i32) {
    let res = Ingestion::delete_by_id(ingestion_id).exec(db).await;
    let delete_response = res.expect("Error deleting ingestion");

    assert_eq!(delete_response.rows_affected, 1);
    println!("Ingestion with ID {} deleted.", ingestion_id);
}

pub async fn create_ingestion(db: &DatabaseConnection, create_ingestion: CreateIngestion) {
    // Parse the date from relative to the current time
    let parsed_time = parse_date_string(&create_ingestion.ingested_at, Utc::now(), Dialect::Us)
        .unwrap_or_else(|_| Utc::now());

    let ingestion_active_model: ActiveModel = ActiveModel {
        id: ActiveValue::NotSet,
        ingested_at: ActiveValue::Set(parsed_time.to_rfc3339()),
        dosage: ActiveValue::Set(create_ingestion.dosage),
        substance_name: ActiveValue::Set(create_ingestion.substance_name),
    };

    let ingestion = Ingestion::insert(ingestion_active_model)
        .exec_with_returning(db)
        .await
        .unwrap();

    let view_model = ViewModel {
        id: ingestion.id,
        ingested_at: ingestion.ingested_at,
        dosage: ingestion.dosage,
        substance_name: ingestion.substance_name,
    };

    println!("Ingestion created with ID: {}", view_model.id);
}

pub async fn list_ingestions(db: &DatabaseConnection) {
    let ingestions = Ingestion::find().all(db).await.unwrap();
    let string_table = Table::new(ingestions);
    println!("{}", string_table.to_string());
}

#[derive(Tabled, Serialize, Deserialize, Debug)]
pub struct ViewModel {
    pub(crate) id: i32,
    pub(crate) ingested_at: String,
    pub(crate) dosage: String,
    pub(crate) substance_name: String,
}
