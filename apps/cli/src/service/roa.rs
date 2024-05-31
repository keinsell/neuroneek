use sea_orm::{DatabaseConnection, EntityTrait};
use sea_orm::ActiveValue::Set;
use serde::{Deserialize, Serialize};
use crate::entities::phase::Column::PhaseClassification;

use crate::entities::prelude::{Dosage, Phase, RouteOfAdministration as RoaModel};
use crate::entities::route_of_administration::ActiveModel;
use crate::service::dosage::{create_dosage, CreateDosage};
use crate::service::phase::{create_phase, CreatePhase};

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
    pub dosage: Vec<CreateDosage>,
    pub phase: Vec<CreatePhase>,
}

pub struct InternalRouteOfAdministration {
    pub id: i32,
    pub name: String,
    pub classification: RouteOfAdministrationClassification,
    pub substance_name: String,
    pub dosage: Vec<Dosage>,
    pub phase: Vec<Phase>,
}

pub async fn create_route_of_administration(
    db: &DatabaseConnection,
    roa: CreateRouteOfAdministration,
) {
    let mut roa_active_model: ActiveModel = ActiveModel {
        id: Default::default(),
        route_of_administration_classification: Set(serde_json::to_string(&roa.classification)
            .unwrap()
            .to_string()),
        substance_name: Set(roa.substance_name),
    };

    let existing_roa = RoaModel::find().one(db).await.unwrap();

    let inserted_roa = if existing_roa.is_none() {
        RoaModel::insert(roa_active_model).exec_with_returning(db).await.unwrap()
    } else {
        return;
    };

    for dosage in roa.dosage {
        let CreateDosage { intensity, range_min, range_max, unit, .. } = dosage;
        let new_dosage = CreateDosage {
            route_of_administration_id: inserted_roa.id,
            intensity,
            range_min,
            range_max,
            unit,
        };
        create_dosage(&db, new_dosage).await;
    }

    for phase in roa.phase {
        create_phase(&db, phase).await;
    }
}

pub async fn update_route_of_administration(db: &DatabaseConnection, roa: InternalRouteOfAdministration) {}

pub async fn delete_route_of_administration(db: &DatabaseConnection, roa: InternalRouteOfAdministration) {}
