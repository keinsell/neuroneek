use std::fmt::Debug;
use std::str::FromStr;

use chrono::{DateTime, Utc};
use chrono_english::{Dialect, parse_date_string};
use chrono_humanize::HumanTime;
use serde::{Deserialize, Serialize};
use tabled::{Table, Tabled};

use db::ingestion::ActiveModel;
use db::sea_orm::{ActiveValue, DatabaseConnection, EntityTrait, QueryTrait};

use crate::core::dosage::Dosage;
use crate::core::ingestion::Ingestion;
use crate::core::mass::deserialize_dosage;
use crate::core::route_of_administration::RouteOfAdministrationClassification;
use crate::ingestion_analyzer::{analyze_ingestion, analyze_ingestion_from_ingestion};
use crate::orm::DB_CONNECTION;
use crate::service::substance::{get_substance_by_name, search_substance};

pub async fn create_ingestion(db: &DatabaseConnection, create_ingestion: CreateIngestion) {
    // Parse the date from relative to the current time
    let parsed_time = parse_date_string(&create_ingestion.ingested_at, Utc::now(), Dialect::Us)
        .unwrap_or_else(|_| Utc::now());

    let parsed_mass = deserialize_dosage(&create_ingestion.dosage).unwrap();

    let substance = match search_substance(db, &create_ingestion.substance_name).await {
        Some(substance) => substance,
        None => {
            panic!("Substance not found");
        }
    };

    analyze_ingestion(analyze_ingestion_from_ingestion(create_ingestion.clone().into()).await.unwrap()).await.unwrap();

    let ingestion_active_model: ActiveModel = ActiveModel {
        id: ActiveValue::<i32>::NotSet,
        substance_name: ActiveValue::Set(Option::from(substance.name)),
        administration_route: ActiveValue::Set(Option::from(
            create_ingestion.route_of_administration.to_string().clone(),
        )),
        dosage_unit: ActiveValue::Set(Option::from("kg".to_owned())),
        dosage_amount: ActiveValue::Set(Option::from(parsed_mass.as_kilograms())),
        ingestion_date: ActiveValue::Set(Option::from(parsed_time.naive_utc())),
        subject_id: ActiveValue::Set(Option::from(String::from("unknown"))),
        stash_id: ActiveValue::NotSet,
    };

    let ingestion = match db::ingestion::Entity::insert(ingestion_active_model.clone())
        .exec_with_returning(db)
        .await
    {
        Ok(ingestion) => ingestion,
        Err(error) => {
            println!(
                "{:?}",
                db::ingestion::Entity::insert(ingestion_active_model).query()
            );
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
    let ingestions = db::ingestion::Entity::find().all(db).await.unwrap();

    let view_models: Vec<ViewModel> = ingestions
        .into_iter()
        .map(|ingestion| {
            let ingestion_date: DateTime<Utc> = chrono::DateTime::<Utc>::from_naive_utc_and_offset(
                ingestion.ingestion_date.unwrap().clone(),
                Utc,
            );

            ViewModel {
                id: ingestion.id.to_string(),
                ingested_at: HumanTime::from(ingestion_date).to_string(),
                dosage: format!(
                    "{0:.0}",
                    Dosage::from_str(
                        format!(
                            "{} {}",
                            ingestion.dosage_amount.unwrap(),
                            ingestion.dosage_unit.unwrap()
                        )
                        .as_str()
                    )
                    .unwrap()
                ),
                substance_name: ingestion.substance_name.unwrap(),
                route_of_administration: ingestion.administration_route.unwrap(),
            }
        })
        .collect();

    for view_model in &view_models {
        get_ingestion_by_id(view_model.id.parse::<i32>().unwrap().clone())
            .await
            .unwrap();
    }

    let string_table = Table::new(view_models);
    println!("{}", string_table);
}

/// This function will return a single ingestion
/// (internal application model) by its ID or will throw an
/// error if the ingestion is not found or could not be constructed.
/// This is intended to be used for
/// all the internal analysis and processing of ingestion data.
/// Ingestion should be most likely serializable
/// and deserializable
/// as this function will be expensive in time and resources it can be memoized to some
/// local cache.
pub async fn get_ingestion_by_id(_id: i32) -> Result<Ingestion, &'static str> {
    // Find ingestion in a database by ID
    let ingestion = db::ingestion::Entity::find_by_id(_id)
        .one(&DB_CONNECTION as &DatabaseConnection)
        .await
        .unwrap()
        .unwrap();
    let substance = get_substance_by_name(&ingestion.substance_name.unwrap().clone())
        .await
        .unwrap();
    let route_of_administration_classification = RouteOfAdministrationClassification::from_str(&ingestion.administration_route.unwrap_or_else(|| panic!("Tried to read route of administration of ingestion but none was found, it's weird as it should be there..."))).unwrap_or_else(|_| panic!("Tried to read route of administration of ingestion but none was found, it's weird as it should be there..."));
    let ingestion_mass = Dosage::from_str(
        format!(
            "{} {}",
            &ingestion.dosage_amount.unwrap(),
            &ingestion.dosage_unit.unwrap()
        )
        .as_str(),
    )
    .unwrap();
    
    let parsed_ingestion_time =
        DateTime::from_naive_utc_and_offset(ingestion.ingestion_date.unwrap().clone(), Utc);

    // Construct an ingestion model
    let ingestion_model = Ingestion {
        id: ingestion.id,
        substance_name: substance.name.clone(),
        administration_route: route_of_administration_classification,
        ingested_at: parsed_ingestion_time,
        dosage: ingestion_mass,
    };

    Ok(ingestion_model)
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CreateIngestion {
    pub substance_name: String,
    pub dosage: String,
    pub route_of_administration: RouteOfAdministrationClassification,
    pub ingested_at: String,
}

impl Into<Ingestion> for CreateIngestion {
    fn into(self) -> Ingestion {
        let parsed_time = parse_date_string(&self.ingested_at, Utc::now(), Dialect::Us)
          .unwrap_or_else(|_| Utc::now());
        let parsed_mass = deserialize_dosage(&self.dosage).unwrap();
        let substance_name = self.substance_name.clone();
        
        Ingestion {
            id: 0,
            substance_name,
            administration_route: self.route_of_administration,
            ingested_at: parsed_time,
            dosage: parsed_mass,
        }
    }
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
