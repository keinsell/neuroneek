// This functionality should take a standard ingestion DTO
// and try to extract and provide as much information as it's
// possible. This is a very important part of the application

use std::str::FromStr;
use sea_orm::prelude::*;
use serde_json::to_string;
use uom::si::f32::Mass;
use crate::db;
use crate::ingestion::CreateIngestion;
use crate::orm::DB_CONNECTION;
use crate::service::substance::search_substance;

// https://docs.rs/indicatif/latest/indicatif/

// struct DosageAnalysis {
//     dosage_classification: DosageClassification,
// }

// pub struct IngestionAnalysis {
//     substance_name: String,
//     // Depending on the information
//     dosage_analysis: Option<DosageAnalysis>,
// }

// TODO: Get duration analysis from ingestion
// TODO: Get effect spotlight
// TODO: Get phase plan

pub async fn analyze_future_ingestion(create_ingestion: &CreateIngestion) {

    let connection = &DB_CONNECTION;

    // 1. Find substance related to ingestion
    let substance = search_substance(connection, &create_ingestion.substance_name).await;

    if substance.is_none() {
        println!("Analysis failed: Substance not found");
        return;
    }

    let substance = substance.unwrap();
    println!("Hello, \u{f913}!");
    println!("{} Substance: {} (Substance#{})", "\u{f0668}", substance.name, substance.id);

    let roa_classification = &create_ingestion.route_of_administration;

    let maybe_route_of_administration = db::route_of_administration::Entity::find()
        .filter(db::route_of_administration::Column::SubstanceName.eq(substance.name))
        .filter(db::route_of_administration::Column::Classification.eq(to_string(roa_classification).unwrap()))
        .one(connection as &DatabaseConnection)
        .await;


    // Do nothing on error and print discovered roa on success
    if maybe_route_of_administration.is_err() {
        println!("Analysis failed: Route of administration not found");
        return;
    }

    let maybe_route_of_administration = maybe_route_of_administration.unwrap();


    if maybe_route_of_administration.is_none() {
        println!("Analysis failed: Route of administration not found");
        return;
    }

    let route_of_administration = maybe_route_of_administration.unwrap().clone();

    println!("Route of administration: {} (ROA#{})", route_of_administration.classification, route_of_administration.id);

    let dosage = db::dosage::Entity::find()
        .filter(db::dosage::Column::RouteOfAdministrationId.eq(route_of_administration.id))
        .all(connection as &DatabaseConnection)
        .await;

    if dosage.is_err() {
        println!("Analysis failed: Dosage not found");
        return;
    }

    let dosage = dosage.unwrap();

    if dosage.is_empty() {
        println!("Analysis failed: Dosage not found");
        return;
    }

    // We need to serialize mass of ingestion and find the closest dosage
    // to the ingestion mass from the list of dosages

    let ingestion_mass = Mass::from_str(&create_ingestion.dosage).unwrap();

    let mut closest_dosage = None;

    for d in dosage {
        let minimum_mass_string = d.min.to_string() + " mg";
        let maximum_mass_string = d.max.to_string() + " mg";


        let min_mass = Mass::from_str(&minimum_mass_string).unwrap();
        let max_mass = Mass::from_str(&maximum_mass_string).unwrap();

        if ingestion_mass >= min_mass && ingestion_mass <= max_mass {
            closest_dosage = Some(d);
            break;
        }
    }

    if closest_dosage.is_none() {
        println!("Analysis failed: Dosage not found");
        return;
    }

    let closest_dosage = closest_dosage.unwrap();

    println!("Dosage classified: {} (Dosage#{})", closest_dosage.classification, closest_dosage.id);
}