use crate::db::prelude::Dosage;
use sea_orm::ActiveValue::Set;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use serde::{Deserialize, Serialize};
use serde_json::to_string;
use std::str::FromStr;

use crate::core::mass_range::{parse_mass_by_f32_and_unit, MassRange};
use crate::db;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum DosageClassification {
    Threshold ,
    Heavy,
    Common,
    Light,
    Strong,
    Exceptional,
    Unknown,
}

impl FromStr for DosageClassification {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        println!("{}", s);
        match s {
            "threshold" => Ok(DosageClassification::Threshold),
            "heavy" => Ok(DosageClassification::Heavy),
            "common" => Ok(DosageClassification::Common),
            "light" => Ok(DosageClassification::Light),
            "strong" => Ok(DosageClassification::Strong),
            "exceptional" => Ok(DosageClassification::Exceptional),
            _ => Err(()),
        }
    }
}

impl Display for DosageClassification {
    fn to_str(s: &DosageClassification) -> Result<Self, Self::Err> {
        println!("{}", s)
        match s {
            DosageClassification::Threshold => "threshold"
            DosageL
            
        }
    }
}


#[derive(Debug)]
pub struct CreateDosage {
    pub route_of_administration_id: i32,
    pub intensity: DosageClassification,
    pub range_min: i32,
    pub range_max: i32,
    pub unit: String,
}

#[derive(Debug, Serialize)]
pub struct InternalDosage {
    pub route_of_administration_id: i32,
    pub intensity: DosageClassification,
    pub range: MassRange,
}

pub async fn create_dosage(db: &DatabaseConnection, create_dosage: CreateDosage) {
    // Protect against duplication by intensity on routeOfAdministrationId
    let existing_dosage = Dosage::find()
        .filter(
            <db::dosage::Entity as sea_orm::EntityTrait>::Column::RouteOfAdministrationId
                .eq(create_dosage.route_of_administration_id)
                .and(
                    <db::dosage::Entity as sea_orm::EntityTrait>::Column::Classification
                        .eq(to_string(&create_dosage.intensity).unwrap()),
                ),
        )
        .one(db)
        .await
        .unwrap();

    if existing_dosage.is_some() {
        return;
    }

    let dosage_active_model: db::dosage::ActiveModel = db::dosage::ActiveModel {
        id: Default::default(),
        route_of_administration_id: Set(create_dosage.route_of_administration_id),
        classification: Set(to_string(&create_dosage.intensity).unwrap()),
        min: Set(create_dosage.range_min),
        max: Set(create_dosage.range_max),
    };

    Dosage::insert(dosage_active_model)
        .exec_with_returning(db)
        .await
        .unwrap();

    println!("Creating dosage: {:?}", create_dosage);

    let min_mass_result = parse_mass_by_f32_and_unit(
        create_dosage.range_min as f32,
        &create_dosage.unit.replace("\"", ""),
    );
    let max_mass_result = parse_mass_by_f32_and_unit(
        create_dosage.range_max as f32,
        &create_dosage.unit.replace("\"", ""),
    );

    match (min_mass_result, max_mass_result) {
        (Ok(min_mass), Ok(max_mass)) => {
            let internal_dosage = InternalDosage {
                route_of_administration_id: create_dosage.route_of_administration_id,
                intensity: create_dosage.intensity,
                range: MassRange(min_mass, max_mass),
            };

            println!("Serialized mass: {:?}", to_string(&min_mass));
            println!("Created dosage: {:?}", internal_dosage);
            // Log serialized internal dosage
            println!(
                "Serialized dosage: {}",
                to_string(&internal_dosage).unwrap()
            );
        }
        _ => {
            println!("Failed to parse mass range for dosage: {:?}", create_dosage);
        }
    }
}
