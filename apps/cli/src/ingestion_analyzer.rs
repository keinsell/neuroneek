// This functionality should take a standard ingestion DTO
// and try to extract and provide as much information as it's
// possible. This is a very important part of the application

use std::str::FromStr;

use sea_orm::prelude::*;
use serde::{Deserialize, Serialize};
use uom::si::f32::Mass;

use crate::core::route_of_administration::RouteOfAdministrationClassification;
use crate::core::route_of_administration_dosage::DosageClassification;
use crate::ingestion::CreateIngestion;
use crate::orm::DB_CONNECTION;
use crate::service::substance::search_substance;

// https://docs.rs/indicatif/latest/indicatif/

#[derive(Debug, Clone, Serialize, Deserialize)]
struct DosageAnalysis {
    dosage_classification: DosageClassification,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IngestionAnalysis {
    substance_name: String,
    route_of_administration_classification: RouteOfAdministrationClassification,
    // Depending on the information
    dosage_analysis: Option<DosageAnalysis>,
}

// TODO: Get duration analysis from ingestion
// TODO: Get effect spotlight
// TODO: Get phase plan

pub async fn analyze_future_ingestion(create_ingestion: &CreateIngestion) {
    let connection = &DB_CONNECTION;

    // Substance query to vectorized index which will match substance name by fuzzy search
    let substance = match search_substance(connection, &create_ingestion.substance_name).await {
        Some(substance) => substance,
        None => {
            println!("Analysis failed: Substance not found");
            return;
        }
    };

    let mut ingestion_analysis = IngestionAnalysis {
        substance_name: substance.name.clone(),
        route_of_administration_classification: create_ingestion.route_of_administration,
        dosage_analysis: None,
    };

    let route_of_administration = db::substance_route_of_administration::Entity::find()
        .filter(db::substance_route_of_administration::Column::SubstanceName.eq(&substance.name))
        .filter(
            db::substance_route_of_administration::Column::Name
                .eq(String::from(create_ingestion.route_of_administration).as_str()),
        )
        .one(connection as &DatabaseConnection)
        .await
        .map_err(|_| "Analysis failed: Route of administration not found")
        .unwrap()
        .ok_or("Analysis failed: Route of administration not found")
        .unwrap_or_else(|_| panic!("Analysis failed: Route of administration not found"));

    // Assign route of administration classification
    ingestion_analysis.route_of_administration_classification =
        RouteOfAdministrationClassification::from_str(&route_of_administration.name)
            .unwrap_or_else(|_| {
                panic!("Analysis failed: Route of administration not found");
            });

    let route_of_administration_dosages =
        match db::substance_route_of_administration_dosage::Entity::find()
            .filter(
                db::substance_route_of_administration_dosage::Column::RouteOfAdministrationId
                    .eq(route_of_administration.id),
            )
            .all(connection as &DatabaseConnection)
            .await
        {
            Ok(dosage) if !dosage.is_empty() => dosage,
            _ => {
                println!("Analysis failed: Dosage not found in database");
                return;
            }
        };

    // Search for the closest dosage to match classification
    let ingestion_mass = Mass::from_str(&create_ingestion.dosage).unwrap();

    let closest_dosage = route_of_administration_dosages
        .into_iter()
        .find(|d| {
            let min_mass = Mass::from_str(&(d.amount_min.to_string() + " mg")).unwrap();
            let max_mass = Mass::from_str(&(d.amount_max.to_string() + " mg")).unwrap();

            match DosageClassification::from_str(&d.intensivity).unwrap() {
                DosageClassification::Threshold => ingestion_mass <= max_mass,
                DosageClassification::Heavy => ingestion_mass >= min_mass,
                _ => ingestion_mass >= min_mass && ingestion_mass <= max_mass,
            }
        })
        .ok_or_else(|| {
            println!("Analysis failed: Dosage not found");
        })
        .unwrap();

    let dosage_analysis = DosageAnalysis {
        dosage_classification: DosageClassification::from_str(&closest_dosage.intensivity)
            .unwrap_or(DosageClassification::Unknown),
    };

    ingestion_analysis.dosage_analysis = Some(dosage_analysis);

    // Pretty-print the ingestion analysis
    println!("{:#?}", ingestion_analysis);
}
