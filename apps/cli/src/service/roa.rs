use sea_orm::{DatabaseConnection, EntityTrait};
use sea_orm::ActiveValue::Set;
use serde::{Deserialize, Serialize};

use crate::entities::prelude::{Dosage, Phase, RouteOfAdministration as RoaModel};
use crate::entities::route_of_administration::ActiveModel;
use crate::service::dosage::{create_dosage, CreateDosage};

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
    pub phase: Vec<Phase>,
}

pub struct RouteOfAdministration {
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

    if existing_roa.is_none() {
        roa_active_model.id = Set(existing_roa.unwrap().id);
        RoaModel::insert(roa_active_model).exec(db).await.unwrap();
    } else {
        return;
    }

    for dosage in roa.dosage {
        create_dosage(&db, dosage).await;
    }
}

pub async fn update_route_of_administration(db: &DatabaseConnection, roa: RouteOfAdministration) {}

pub async fn delete_route_of_administration(db: &DatabaseConnection, roa: RouteOfAdministration) {}
