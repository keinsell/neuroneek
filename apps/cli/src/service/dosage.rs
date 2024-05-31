use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use sea_orm::ActiveValue::Set;
use serde::{Deserialize, Serialize};
use serde_json::to_string;
use crate::db::prelude::Dosage;

use crate::{db};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum DosageClassification {
    Threshold,
    Heavy,
    Common,
    Light,
    Strong,
    Exceptional,
    Unknown,
}

#[derive(Debug)]
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
            <db::dosage::Entity as sea_orm::EntityTrait>::Column::RouteOfAdministrationId
                .eq(create_dosage.route_of_administration_id)
                .and(
                    <db::dosage::Entity as sea_orm::EntityTrait>::Column::Classification
                        .eq(to_string(&create_dosage.intensity).unwrap()),
                ),
        )
        .one(db)
        .await.unwrap();

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
}
