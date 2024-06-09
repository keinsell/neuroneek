use std::fmt::Debug;

use chrono::{DateTime, Local, Utc};
use chrono_english::{Dialect, parse_date_string};
use chrono_humanize::HumanTime;
use db::ingestion::ActiveModel;
use db::prelude::Ingestion;
use sea_orm::{ActiveValue, DatabaseConnection, EntityTrait, QueryTrait};
use serde::{Deserialize, Serialize};
use serde_json::to_string;
use tabled::{Table, Tabled};
use uom::num::ToPrimitive;
use uom::si::mass::milligram;

use crate::core::mass::deserialize_mass_unit;
use crate::core::route_of_administration::RouteOfAdministrationClassification;
use crate::ingestion_analyzer::analyze_future_ingestion;
use crate::service::substance::search_substance;

pub async fn create_ingestion(db: &DatabaseConnection, create_ingestion: CreateIngestion) {
    // Parse the date from relative to the current time
    let parsed_time = parse_date_string(&create_ingestion.ingested_at, Utc::now(), Dialect::Us)
        .unwrap_or_else(|_| Utc::now());

    let parsed_mass = deserialize_mass_unit(&create_ingestion.dosage).unwrap();

    println!("{:?}", parsed_mass);

    let substance = match search_substance(db, &create_ingestion.substance_name).await {
        Some(substance) => substance,
        None => {
            panic!("Substance not found");
        }
    };

    analyze_future_ingestion(&create_ingestion)
        .await
        .unwrap_or_else(|e| println!("Error: {}", e));

    let ingestion_active_model: ActiveModel = ActiveModel {
        id: ActiveValue::default(),
        substance_name: ActiveValue::Set(Option::from(substance.name)),
        administration_route: ActiveValue::Set(Option::from(
            to_string(&create_ingestion.route_of_administration).unwrap(),
        )),
        dosage_unit: ActiveValue::Set(Option::from("mg".to_owned())),
        dosage_amount: ActiveValue::Set(Option::from(
            parsed_mass.get::<milligram>().to_f32().unwrap() as f64,
        )),
        ingestion_date: ActiveValue::Set(Option::from(parsed_time.naive_local())),
        subject_id: ActiveValue::Set(Option::from(String::from("unknown"))),
        stash_id: ActiveValue::NotSet,
    };

    let ingestion = match Ingestion::insert(ingestion_active_model.clone())
        .exec_with_returning(db)
        .await
    {
        Ok(ingestion) => ingestion,
        Err(error) => {
            println!("{:?}", Ingestion::insert(ingestion_active_model).query());
            panic!("Error inserting ingestion: {}", error)
        }
    };

    let view_model = ViewModel {
        id: ingestion.id.to_string(),
        ingested_at: ingestion.ingestion_date.unwrap().to_string(),
        dosage: format!(
            "{} {}",
            ingestion.dosage_amount.unwrap(),
            ingestion.dosage_unit.unwrap()
        ),
        substance_name: ingestion.substance_name.unwrap(),
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
                DateTime::<Local>::from(ingestion.ingestion_date.unwrap().and_utc());

            ViewModel {
                id: ingestion.id.to_string(),
                ingested_at: HumanTime::from(ingestion_date).to_string(),
                dosage: format!(
                    "{} {}",
                    ingestion.dosage_amount.unwrap(),
                    ingestion.dosage_unit.unwrap()
                ),
                substance_name: ingestion.substance_name.unwrap(),
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
    pub(crate) route_of_administration: String,
}
