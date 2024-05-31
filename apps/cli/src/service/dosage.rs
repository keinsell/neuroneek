use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use serde::{Deserialize, Serialize};
use serde_json::to_string;

use crate::entities;
use crate::entities::dosage;
use crate::entities::prelude::Dosage;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
enum DosageClassification {
    Threshold,
    Heavy,
    Common,
    Light,
    Strong,
    Exceptional,
    Unknown,
}

pub struct CreateDosage {
    pub route_of_administration_id: i32,
    pub intensity: DosageClassification,
    pub range_min: i32,
    pub range_max: i32,
    pub unit: String,
}

pub async fn create_dosage(db: &DatabaseConnection, create_dosage: CreateDosage) {
    // Protect against duplication by intensity on routeOfAdministrationId
    let existing_dosage = Dosage::find()
        .filter(
            <entities::dosage::Entity as sea_orm::EntityTrait>::Column::RouteOfAdministrationId
                .eq(create_dosage.route_of_administration_id)
                .and(
                    <entities::dosage::Entity as sea_orm::EntityTrait>::Column::DosageClassification
                        .eq(to_string(&create_dosage.intensity).unwrap()),
                ),
        )
        .one(db)
        .await.unwrap();

    if existing_dosage.is_some() {
        return;
    }

    let dosage_active_model: dosage::ActiveModel = dosage::ActiveModel {
        id: Default::default(),
        route_of_administration_id: Default::default(),
        dosage_classification: Default::default(),
        dosage_min: Default::default(),
        dosage_max: Default::default(),
    };

    dosage::Entity::insert(dosage_active_model)
        .exec_with_returning(db)
        .await
        .unwrap();
}
