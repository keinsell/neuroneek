// This functionality should take a standard ingestion DTO
// and try to extract and provide as much information as it's
// possible. This is a very important part of the application

use std::collections::HashMap;
use std::ops::Range;
use std::str::FromStr;
use std::time::Duration;

use chrono::TimeDelta;
use chrono_humanize::HumanTime;
use log::{debug, error, info};
use sea_orm::prelude::*;
use serde::{Deserialize, Serialize};

use crate::core::ingestion::IngestionPhases;
use crate::core::mass::deserialize_mass_unit;
use crate::core::route_of_administration::{
    get_dosage_classification_by_mass_and_route_of_administration,
    RouteOfAdministrationClassification,
};
use crate::core::route_of_administration_dosage::DosageClassification;
use crate::core::route_of_administration_phase::PhaseClassification;
use crate::core::substance::get_route_of_administration_by_classification_and_substance;
use crate::ingestion::CreateIngestion;
use crate::orm::DB_CONNECTION;
use crate::service::substance::get_substance_by_name;

// https://docs.rs/indicatif/latest/indicatif/

type PhaseDuration = Range<TimeDelta>;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct DosageAnalysis {
    dosage_classification: DosageClassification,
}

#[derive(Debug)]
pub struct IngestionAnalysis {
    substance_name: String,
    route_of_administration_classification: RouteOfAdministrationClassification,
    dosage_classification: DosageClassification,
    phases: IngestionPhases,
    total_duration: Duration,
}

pub async fn analyze_future_ingestion(
    create_ingestion: &CreateIngestion,
) -> Result<(), &'static str> {
    let connection = &DB_CONNECTION;

    let substance = get_substance_by_name(&create_ingestion.substance_name)
        .await
        .ok_or("Analysis failed: Substance not found")?;

    debug!("{:?}", substance);

    let route_of_administration = get_route_of_administration_by_classification_and_substance(
        &create_ingestion.route_of_administration,
        &substance,
    )
    .unwrap_or_else(|_| {
        error!("Analysis failed: Route of administration not found");
        panic!("Analysis failed: Route of administration not found");
    });

    // Parse mass from input
    let ingestion_mass = deserialize_mass_unit(&create_ingestion.dosage).unwrap_or_else(|_| {
        error!("Analysis failed: Invalid mass");
        panic!("Analysis failed: Invalid mass unit");
    });

    let dosage_classification = get_dosage_classification_by_mass_and_route_of_administration(
        &ingestion_mass,
        &route_of_administration,
    )
    .unwrap_or_else(|_| {
        error!("Analysis failed: Dosage classification not found");
        panic!("Analysis failed: Dosage classification not found");
    });

    let ingestion_analysis = IngestionAnalysis {
        substance_name: substance.name.clone(),
        route_of_administration_classification: route_of_administration.classification,
        dosage_classification,
        phases: Default::default(),
        total_duration: Default::default(),
    };

    info!("{:?}", ingestion_analysis);

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

        debug!("{:?}", phase_duration);

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
