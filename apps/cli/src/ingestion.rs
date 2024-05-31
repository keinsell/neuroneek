use std::fmt::Debug;

use chrono::{DateTime, Utc};
use chrono_english::{Dialect, parse_date_string};
use sea_orm::{ActiveValue, DatabaseConnection, EntityTrait};
use serde::{Deserialize, Serialize};
use tabled::{Table, Tabled};

use db::ingestion::ActiveModel;

use crate::db;
use crate::db::prelude::IngestionEntity;
use crate::service::roa::RouteOfAdministrationClassification;

pub async fn create_ingestion(db: &DatabaseConnection, create_ingestion: CreateIngestion) {
    // Parse the date from relative to the current time
    let parsed_time = parse_date_string(&create_ingestion.ingested_at, Utc::now(), Dialect::Us)
        .unwrap_or_else(|_| Utc::now());

    let ingestion_active_model: ActiveModel = ActiveModel {
        id: ActiveValue::NotSet,
        ingested_at: ActiveValue::Set(parsed_time.to_rfc3339()),
        dosage: ActiveValue::Set(create_ingestion.dosage),
        substance_name: ActiveValue::Set(create_ingestion.substance_name),
        route_of_administration: ActiveValue::Set(
            serde_json::to_string(&create_ingestion.route_of_administration).unwrap(),
        ),
    };

    let ingestion = IngestionEntity::insert(ingestion_active_model)
        .exec_with_returning(db)
        .await
        .unwrap();

    let view_model = ViewModel {
        id: ingestion.id,
        ingested_at: ingestion.ingested_at,
        dosage: ingestion.dosage,
        substance_name: ingestion.substance_name,
        progress: String::from("n/a").to_string(),
        route_of_administration: ingestion.route_of_administration,
    };

    println!("Ingestion created with ID: {}", view_model.id);
}

pub async fn list_ingestion(db: &DatabaseConnection) {
    let ingestions = IngestionEntity::find().all(db).await.unwrap();

    let view_models: Vec<ViewModel> = ingestions
        .into_iter()
        .map(|ingestion| {
            let ingestion_date = DateTime::parse_from_rfc3339(&ingestion.ingested_at).unwrap();

            let humanized_date = chrono_humanize::HumanTime::from(ingestion_date);

            ViewModel {
                id: ingestion.id,
                ingested_at: humanized_date.to_string(),
                dosage: ingestion.dosage,
                substance_name: ingestion.substance_name,
                progress: String::from("N/a").to_string(),
                route_of_administration: ingestion.route_of_administration,
            }
        })
        .collect();

    let string_table = Table::new(view_models);
    println!("{}", string_table);
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CreateIngestion {
    pub substance_name: String,
    pub dosage: String,
    pub route_of_administration: RouteOfAdministrationClassification,
    pub ingested_at: String,
}

#[derive(Tabled, Serialize, Deserialize, Debug)]
pub struct ViewModel {
    #[tabled(order = 0)]
    pub(crate) id: i32,
    #[tabled(order = 1)]
    pub(crate) substance_name: String,
    #[tabled(order = 2)]
    pub(crate) dosage: String,
    #[tabled(rename = "date", order = 3)]
    pub(crate) ingested_at: String,
    pub(crate) progress: String,
    pub(crate) route_of_administration: String,
}
