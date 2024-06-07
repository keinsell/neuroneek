use std::fmt::Debug;

use chrono::{DateTime, Utc};
use chrono_english::{Dialect, parse_date_string};
use db::ingestion::ActiveModel;
use db::prelude::Ingestion;
use sea_orm::{ActiveValue, DatabaseConnection, EntityTrait};
use serde::{Deserialize, Serialize};
use tabled::{Table, Tabled};

use crate::core::route_of_administration::RouteOfAdministrationClassification;
use crate::ingestion_analyzer::analyze_future_ingestion;

pub async fn create_ingestion(db: &DatabaseConnection, create_ingestion: CreateIngestion) {
    // Parse the date from relative to the current time
    let parsed_time = parse_date_string(&create_ingestion.ingested_at, Utc::now(), Dialect::Us)
        .unwrap_or_else(|_| Utc::now());

    analyze_future_ingestion(&create_ingestion).await;

    let ingestion_active_model: ActiveModel = ActiveModel {
        id: ActiveValue::NotSet,
        substance_name: ActiveValue::Set(Option::from(create_ingestion.substance_name)),
        administration_route: Default::default(),
        dosage_unit: Default::default(),
        dosage_amount: Default::default(),
        ingestion_date: ActiveValue::Set(Option::from(parsed_time.naive_local())),
        subject_id: Default::default(),
        stash_id: Default::default(),
    };

    let ingestion = Ingestion::insert(ingestion_active_model)
        .exec_with_returning(db)
        .await
        .unwrap();

    let view_model = ViewModel {
        id: ingestion.id,
        ingested_at: ingestion.ingestion_date.unwrap().to_string(),
        dosage: format!(
            "{} {}",
            ingestion.dosage_amount.unwrap().to_string(),
            ingestion.dosage_unit.unwrap().to_string()
        ),
        substance_name: ingestion.substance_name.unwrap(),
        progress: String::from("n/a").to_string(),
        route_of_administration: ingestion.administration_route.unwrap(),
    };

    println!("Ingestion created with ID: {}", view_model.id);
}

pub async fn list_ingestion(db: &DatabaseConnection) {
    let ingestions = Ingestion::find().all(db).await.unwrap();

    let view_models: Vec<ViewModel> = ingestions
        .into_iter()
        .map(|ingestion| {
            let ingestion_date =
                DateTime::parse_from_rfc3339(&ingestion.ingestion_date.unwrap().to_string())
                    .unwrap();
            let humanized_date = chrono_humanize::HumanTime::from(ingestion_date);

            ViewModel {
                id: ingestion.id,
                ingested_at: humanized_date.to_string(),
                dosage: format!(
                    "{} {}",
                    ingestion.dosage_amount.unwrap().to_string(),
                    ingestion.dosage_unit.unwrap().to_string()
                ),
                substance_name: ingestion.substance_name.unwrap(),
                progress: String::from("N/a").to_string(),
                route_of_administration: ingestion.administration_route.unwrap(),
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
    pub(crate) id: String,
    #[tabled(order = 1)]
    pub(crate) substance_name: String,
    #[tabled(order = 2)]
    pub(crate) dosage: String,
    #[tabled(rename = "date", order = 3)]
    pub(crate) ingested_at: String,
    pub(crate) progress: String,
    pub(crate) route_of_administration: String,
}
