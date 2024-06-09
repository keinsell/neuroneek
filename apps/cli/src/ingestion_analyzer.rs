// This functionality should take a standard ingestion DTO
// and try to extract and provide as much information as it's
// possible. This is a very important part of the application

use std::time::Duration;

use chrono::TimeDelta;
use chrono_humanize::HumanTime;
use log::{debug, error, info};
use serde::{Deserialize, Serialize};

use crate::core::ingestion::IngestionPhases;
use crate::core::mass::deserialize_mass_unit;
use crate::core::phase::PhaseClassification;
use crate::core::route_of_administration::{
    get_dosage_classification_by_mass_and_route_of_administration,
    RouteOfAdministrationClassification,
};
use crate::core::route_of_administration_dosage::DosageClassification;
use crate::core::substance::{
    get_phases_by_route_of_administration,
    get_route_of_administration_by_classification_and_substance,
};
use crate::ingestion::CreateIngestion;
use crate::service::substance::get_substance_by_name;

// https://docs.rs/indicatif/latest/indicatif/

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
) -> Result<IngestionAnalysis, &'static str> {
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

    // Calculate ingestion plan based on phase information

    let phases = get_phases_by_route_of_administration(&route_of_administration);

    let total_duration = phases.iter().fold(TimeDelta::seconds(0), |acc, phase| {
        if phase.phase_classification == PhaseClassification::Afterglow {
            return acc;
        } else {
            println!(
                "Adding {:?} into total duration (total duration is {:?})",
                phase.duration_range.end.to_string(),
                acc.to_string()
            );

            acc + phase.duration_range.end
        }
    });

    println!("{:?}", HumanTime::from(total_duration).to_string());

    let ingestion_analysis = IngestionAnalysis {
        substance_name: substance.name.clone(),
        route_of_administration_classification: route_of_administration.classification,
        dosage_classification,
        phases: Default::default(),
        total_duration: total_duration.to_std().unwrap(),
    };

    info!("{:?}", ingestion_analysis);

    Ok(ingestion_analysis)
}

#[cfg(test)]
mod tests {
    use std::time::Duration;

    use crate::core::phase::PhaseClassification;
    use crate::core::route_of_administration::RouteOfAdministrationClassification;
    use crate::core::route_of_administration_dosage::DosageClassification;
    use crate::ingestion::CreateIngestion;
    use crate::ingestion_analyzer::analyze_future_ingestion;

    #[tokio::test]
    async fn test_analyze_future_ingestion() {
        let create_ingestion = CreateIngestion {
            substance_name: String::from("caffeine"),
            route_of_administration: RouteOfAdministrationClassification::Oral,
            dosage: String::from("100 mg"),
            ingested_at: "now".parse().unwrap(),
        };

        let result = analyze_future_ingestion(&create_ingestion).await;

        match result {
            Ok(ingestion_analysis) => {
                assert_eq!(
                    ingestion_analysis.substance_name, "Caffeine",
                    "substance should be caffeine"
                );
                assert_eq!(
                    ingestion_analysis.route_of_administration_classification,
                    RouteOfAdministrationClassification::Oral,
                    "route of administration should be oral"
                );
                assert_eq!(
                    ingestion_analysis.dosage_classification,
                    DosageClassification::Common,
                    "dosage should be classified as common"
                );

                assert!(
                    ingestion_analysis.total_duration > Duration::from_mins(240),
                    "total duration should be greater than 4 hours"
                );

                assert!(
                    ingestion_analysis.total_duration < Duration::from_mins(300),
                    "total duration should be less than 5 hours"
                );

                // Assert that ingestion phases from the analysis contain onset phase.

                let ingestion_phases = ingestion_analysis.phases;

                assert!(
                    ingestion_phases
                        .iter()
                        .any(|phase| phase.0.clone() == PhaseClassification::Onset),
                    "Onset phase should be present in ingestion phases"
                );

                // let expected_ingestion_phases = Vec::<IngestionPhase>::new();
                //
                // expected_ingestion_phases.push(IngestionPhase {
                //     phase_classification: PhaseClassification::Onset,
                //     duration: DurationRange {
                //         start: Duration::minutes(5),
                //         end: Duration::seconds(10),
                //     },
                //     humanized_duration: Range {},
                //     start_time: Default::default(),
                //     duration_range: (0..30).into(),
                //     end_time: Default::default(),
                // });
                //
                // // Adjust this as necessary
            }
            Err(e) => panic!("Test failed: {}", e),
        }
    }
}
