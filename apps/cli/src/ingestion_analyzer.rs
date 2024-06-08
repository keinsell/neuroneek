// This functionality should take a standard ingestion DTO
// and try to extract and provide as much information as it's
// possible. This is a very important part of the application

use std::collections::HashMap;
use std::ops::Range;
use std::str::FromStr;

use chrono::TimeDelta;
use chrono_humanize::HumanTime;
use sea_orm::prelude::*;
use serde::{Deserialize, Serialize};

use crate::core::mass::Mass;
use crate::core::route_of_administration::RouteOfAdministrationClassification;
use crate::core::route_of_administration_dosage::DosageClassification;
use crate::core::route_of_administration_phase::PhaseClassification;
use crate::ingestion::CreateIngestion;
use crate::orm::DB_CONNECTION;
use crate::service::substance::search_substance;

// https://docs.rs/indicatif/latest/indicatif/

type PhaseDuration = Range<TimeDelta>;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct DosageAnalysis {
    dosage_classification: DosageClassification,
}

struct PhaseAnalysis {
    duration: TimeDelta,
    stages: HashMap<PhaseClassification, PhaseDuration>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IngestionAnalysis {
    substance_name: String,
    route_of_administration_classification: RouteOfAdministrationClassification,
    dosage_analysis: Option<DosageAnalysis>,
}

pub async fn analyze_future_ingestion(
    create_ingestion: &CreateIngestion,
) -> Result<(), &'static str> {
    let connection = &DB_CONNECTION;

    let substance = search_substance(connection, &create_ingestion.substance_name)
        .await
        .ok_or("Analysis failed: Substance not found")?;

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
        .map_err(|_| "Analysis failed: Route of administration not found")?
        .ok_or("Analysis failed: Route of administration not found")?;

    ingestion_analysis.route_of_administration_classification =
        RouteOfAdministrationClassification::from_str(&route_of_administration.name)
            .map_err(|_| "Analysis failed: Route of administration not found")?;

    let route_of_administration_dosages =
        db::substance_route_of_administration_dosage::Entity::find()
            .filter(
                db::substance_route_of_administration_dosage::Column::RouteOfAdministrationId
                    .eq(route_of_administration.id.clone()),
            )
            .all(connection as &DatabaseConnection)
            .await
            .map_err(|_| "Analysis failed: Dosage not found in database")
            .and_then(|dosages| {
                if dosages.is_empty() {
                    Err("Analysis failed: Dosage not found in database")
                } else {
                    Ok(dosages)
                }
            })?;

    let ingestion_mass = Mass::from_str(&create_ingestion.dosage)
        .map_err(|_| "Analysis failed: Invalid dosage format")?;

    // Search for the closest dosage to match classification

    let matching_dosage_range_by_ingestion = route_of_administration_dosages
        .into_iter()
        .find(|d| {
            let min_mass = Mass::from_str(&(d.amount_min.to_string() + " mg"))
                .map_err(|_| "Analysis failed: Invalid dosage format")
                .unwrap();
            let max_mass = Mass::from_str(&(d.amount_max.to_string() + " mg"))
                .map_err(|_| "Analysis failed: Invalid dosage format")
                .unwrap();

            match DosageClassification::from_str(&d.intensivity)
                .map_err(|_| "Analysis failed: Invalid dosage classification")
                .unwrap()
            {
                DosageClassification::Threshold => ingestion_mass <= max_mass,
                DosageClassification::Heavy => ingestion_mass >= min_mass,
                _ => ingestion_mass >= min_mass && ingestion_mass <= max_mass,
            }
        })
        .ok_or("Analysis failed: Dosage not found")?;

    let dosage_analysis = DosageAnalysis {
        dosage_classification: DosageClassification::from_str(
            &matching_dosage_range_by_ingestion.intensivity,
        )
        .unwrap_or(DosageClassification::Unknown),
    };

    ingestion_analysis.dosage_analysis = Some(dosage_analysis);

    // Calculate ingestion plan based on phase information

    let route_of_administration_phases =
        db::substance_route_of_administration_phase::Entity::find()
            .filter(
                db::substance_route_of_administration_phase::Column::RouteOfAdministrationId
                    .eq(route_of_administration.id),
            )
            .all(connection as &DatabaseConnection)
            .await
            .map_err(|_| "Analysis failed: Route of administration phase not found")?;

    // Flow of phases is: Onset -> Comeup -> Peak -> Offset -> Afterglow
    let mut total_ingestion_duration = PhaseDuration {
        start: TimeDelta::seconds(0),
        end: TimeDelta::seconds(0),
    };

    for phase in route_of_administration_phases {
        let phase_classification = PhaseClassification::from_str(&phase.classification)
            .map_err(|_| "Analysis failed: Invalid phase classification")?;

        let phase_duration = PhaseDuration {
            start: TimeDelta::seconds(phase.min_duration.unwrap() as i64),
            end: TimeDelta::seconds(phase.max_duration.unwrap() as i64),
        };

        println!("{:?}", phase_duration);

        if phase_classification.clone() != PhaseClassification::Afterglow {
            total_ingestion_duration.start += phase_duration.start;
            total_ingestion_duration.end += phase_duration.end;
        }
    }

    println!(
        "{:?}",
        HumanTime::from(total_ingestion_duration.end).to_string()
    );

    Ok(())
}
