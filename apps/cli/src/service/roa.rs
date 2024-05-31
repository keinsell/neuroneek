use sea_orm::{DatabaseConnection, EntityTrait, QueryFilter};
use sea_orm::ActiveValue::Set;
use serde::{Deserialize, Serialize};
use sea_orm::{entity::*, query::*, DbBackend};
use crate::db;
use crate::db::prelude::*;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RouteOfAdministrationClassification {
    Buccal,
    Inhaled,
    Insufflated,
    Intramuscular,
    Intravenous,
    Oral,
    Rectal,
    Smoked,
    Sublingual,
    Transdermal,
}

pub fn string_to_route_of_administration_classification(
    string: &str,
) -> RouteOfAdministrationClassification {
    match string {
        "Buccal" => RouteOfAdministrationClassification::Buccal,
        "Inhaled" => RouteOfAdministrationClassification::Inhaled,
        "Insufflated" => RouteOfAdministrationClassification::Insufflated,
        "Intramuscular" => RouteOfAdministrationClassification::Intramuscular,
        "Intravenous" => RouteOfAdministrationClassification::Intravenous,
        "Oral" => RouteOfAdministrationClassification::Oral,
        "Rectal" => RouteOfAdministrationClassification::Rectal,
        "Smoked" => RouteOfAdministrationClassification::Smoked,
        "Sublingual" => RouteOfAdministrationClassification::Sublingual,
        "Transdermal" => RouteOfAdministrationClassification::Transdermal,
        _ => panic!("Unknown route of administration classification"),
    }
}

pub struct CreateRouteOfAdministration {
    pub classification: RouteOfAdministrationClassification,
    pub substance_name: String,
}

pub struct InternalRouteOfAdministration {
    pub id: i32,
    pub substance_name: String,
    pub classification: RouteOfAdministrationClassification,
    pub dosage: Vec<DosageEntity>,
    pub phase: Vec<PhaseEntity>,
}

pub async fn create_route_of_administration(
    db: &DatabaseConnection,
    roa: CreateRouteOfAdministration,
) {
    let substance_name = roa.substance_name.clone();

    let roa_active_model: db::route_of_administration::ActiveModel = db::route_of_administration::ActiveModel {
        id: Default::default(),
        route_of_administration_classification: Set(serde_json::to_string(&roa.classification)
            .unwrap()
            .to_string()),
        substance_name: Set(substance_name.clone()),
    };

    let existing_roa = RouteOfAdministrationEntity::find().filter(
        db::route_of_administration::Column::RouteOfAdministrationClassification.eq(
            serde_json::to_string(&roa.classification).unwrap(),
        ).and(
            db::route_of_administration::Column::SubstanceName.eq(substance_name.clone()),
        )
    ).one(db).await.unwrap();

    if existing_roa.is_none() {
        RouteOfAdministrationEntity::insert(roa_active_model).exec_with_returning(db).await.unwrap();
    }
}