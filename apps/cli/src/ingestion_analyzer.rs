// This functionality should take a standard ingestion DTO
// and try to extract and provide as much information as it's
// possible. This is a very important part of the application

use std::fmt::{Debug, Display};
use std::time::Duration;

use chrono::{DateTime, Local, TimeZone};
use chrono_english::{parse_date_string, Dialect};
use chrono_humanize::HumanTime;
use log::{debug, error};
use measurements::Measurement;
use serde::{Deserialize, Serialize};
use termimad::MadSkin;

use crate::core::dosage::DosageClassification;
use crate::core::ingestion::{Ingestion, IngestionPhase, IngestionPhases};
use crate::core::mass::{deserialize_dosage, Mass};
use crate::core::phase::PhaseClassification;
use crate::core::route_of_administration::{
    get_dosage_classification_by_mass_and_route_of_administration,
    RouteOfAdministrationClassification,
};
use crate::core::substance::{
    get_phases_by_route_of_administration,
    get_route_of_administration_by_classification_and_substance,
};
use crate::service::ingestion::CreateIngestion;
use crate::service::substance::get_substance_by_name;

// https://docs.rs/indicatif/latest/indicatif/

#[derive(Debug, Clone, Serialize, Deserialize)]
struct DosageAnalysis {
    dosage_classification: DosageClassification,
}

#[derive(Debug)]
pub struct IngestionAnalysis {
    ingestion_id: i32,
    substance_name: String,
    route_of_administration_classification: RouteOfAdministrationClassification,
    dosage_classification: DosageClassification,
    dosage: Mass,
    pub phases: IngestionPhases,
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
    let ingestion_mass = deserialize_dosage(&create_ingestion.dosage).unwrap_or_else(|_| {
        error!("Analysis failed: Invalid mass");
        panic!("Analysis failed: Invalid mass unit");
    });

    let dosage_classification = get_dosage_classification_by_mass_and_route_of_administration(
        &ingestion_mass,
        &route_of_administration,
    )
    .unwrap_or_else(|_| {
        error!("Analysis failed: Dosage classification not found");
        return DosageClassification::Unknown;
    });

    // Calculate ingestion plan based on phase information

    let phases = get_phases_by_route_of_administration(&route_of_administration);

    let total_duration = phases.iter().fold(Duration::default(), |acc, phase| {
        return if phase.phase_classification == PhaseClassification::Afterglow {
            acc
        } else {
            let added = acc + phase.duration_range.end;
            added
        };
    });

    let route_of_administration_phases = route_of_administration.phases.clone();

    let parsed_time = parse_date_string(&create_ingestion.ingested_at, Local::now(), Dialect::Us)
        .unwrap_or_else(|_| Local::now());

    let mut end_time = parsed_time;

    let phase_classifications = [
        PhaseClassification::Onset,
        PhaseClassification::Comeup,
        PhaseClassification::Peak,
        PhaseClassification::Offset,
        PhaseClassification::Afterglow,
    ];

    let ingestion_phases: IngestionPhases = phase_classifications
        .iter()
        .filter_map(|classification| {
            route_of_administration_phases
                .get(&classification.clone())
                .map(|phase| {
                    let ingestion_phase = IngestionPhase {
                        phase_classification: classification.clone(),
                        duration: phase.duration_range.clone(),
                        start_time: end_time,
                        end_time: end_time + phase.duration_range.end,
                    };
                    end_time = end_time + ingestion_phase.duration.end;
                    (classification.clone(), ingestion_phase)
                })
        })
        .collect();

    let ingestion_analysis = IngestionAnalysis {
        ingestion_id: 0,
        substance_name: substance.name.clone(),
        dosage: ingestion_mass.clone(),
        route_of_administration_classification: route_of_administration.classification,
        dosage_classification,
        phases: ingestion_phases,
        total_duration,
    };

    pretty_print_ingestion_analysis(&ingestion_analysis);

    Ok(ingestion_analysis)
}

pub async fn analyze_ingestion(ingestion: &Ingestion) -> Result<IngestionAnalysis, &'static str> {
    let substance = get_substance_by_name(&ingestion.substance_name)
        .await
        .ok_or("Analysis failed: Substance not found")?;

    debug!("{:?}", substance);

    let route_of_administration = get_route_of_administration_by_classification_and_substance(
        &ingestion.administration_route,
        &substance,
    )
    .unwrap_or_else(|_| {
        error!("Analysis failed: Route of administration not found");
        panic!("Analysis failed: Route of administration not found");
    });

    let ingestion_mass = ingestion.dosage.clone();

    let dosage_classification = get_dosage_classification_by_mass_and_route_of_administration(
        &ingestion_mass,
        &route_of_administration,
    )
    .unwrap_or_else(|_| {
        error!("Analysis failed: Dosage classification not found");
        return DosageClassification::Unknown;
    });

    let phases = get_phases_by_route_of_administration(&route_of_administration);

    let total_duration = phases.iter().fold(Duration::default(), |acc, phase| {
        return if phase.phase_classification == PhaseClassification::Afterglow {
            acc
        } else {
            let added = acc + phase.duration_range.end;
            added
        };
    });

    let route_of_administration_phases = route_of_administration.phases.clone();

    let parsed_time = ingestion.ingested_at;
    let mut end_time = DateTime::<Local>::from(parsed_time.clone());

    let phase_classifications = [
        PhaseClassification::Onset,
        PhaseClassification::Comeup,
        PhaseClassification::Peak,
        PhaseClassification::Offset,
        PhaseClassification::Afterglow,
    ];

    let ingestion_phases: IngestionPhases = phase_classifications
        .iter()
        .filter_map(|classification| {
            route_of_administration_phases
                .get(&classification.clone())
                .map(|phase| {
                    let ingestion_phase = IngestionPhase {
                        phase_classification: classification.clone(),
                        duration: phase.duration_range.clone(),
                        start_time: end_time,
                        end_time: end_time + phase.duration_range.end,
                    };
                    end_time = end_time + ingestion_phase.duration.end;
                    (classification.clone(), ingestion_phase)
                })
        })
        .collect();

    let ingestion_analysis = IngestionAnalysis {
        ingestion_id: ingestion.id.clone(),
        substance_name: substance.name.clone(),
        dosage: ingestion_mass,
        route_of_administration_classification: route_of_administration.classification,
        dosage_classification,
        phases: ingestion_phases,
        total_duration: Duration::from_secs(0),
    };

    Ok(ingestion_analysis)
}

pub fn pretty_print_ingestion_analysis(ingestion_analysis: &IngestionAnalysis) {
    let mut markdown = String::new();
    markdown.push_str(&format!("Ingesting {0:.0} of {1:?} using {2:?} route of administration, dosage and will last for about {3:?}.",
                               ingestion_analysis.dosage,
                               ingestion_analysis.substance_name,
                               ingestion_analysis.route_of_administration_classification,
                               HumanTime::from(chrono::Duration::from_std(ingestion_analysis.total_duration).unwrap())
                                   .to_string()
    ));
    markdown.push_str(&format!("{}", "-".repeat(40) + "\n"));
    markdown.push_str(&format!("🧪 {}\n", ingestion_analysis.substance_name));
    markdown.push_str(&format!("{}", "-".repeat(3) + "\n"));
    markdown.push_str(&format!(
        "🥤 Route of Administration: **{:?}**\n",
        ingestion_analysis.route_of_administration_classification
    ));
    markdown.push_str(&format!(
        "🧮 Dosage: **{0:.0}**\n",
        ingestion_analysis.dosage
    ));
    markdown.push_str(&format!(
        "🧮 Dosage Classification: **{:?}**\n",
        ingestion_analysis.dosage_classification
    ));
    markdown.push_str(&format!(
        "Total Duration: **{:?}**\n",
        HumanTime::from(chrono::Duration::from_std(ingestion_analysis.total_duration).unwrap())
            .to_string()
    ));
    markdown.push_str(&"Phases:\n".to_string());

    let mut phases: Vec<(&PhaseClassification, &IngestionPhase)> =
        ingestion_analysis.phases.iter().collect();
    phases.sort_by_key(|&(classification, _)| *classification);

    for (phase_classification, phase) in phases {
        if phase.start_time < Local::now() {
            markdown.push_str(&format!(
                "   ▶ ~~{:?}: {:?}~~\n",
                phase_classification,
                HumanTime::from(phase.start_time).to_string()
            ));
        } else {
            markdown.push_str(&format!(
                "   ▶ **{:?}**: {:?}\n",
                phase_classification,
                HumanTime::from(phase.start_time).to_string()
            ));
        }
    }

    markdown.push_str(&format!("{}", "-".repeat(40) + "\n"));

    let skin = MadSkin::default();
    println!("{}", skin.term_text(&markdown));
}

#[cfg(test)]
mod tests {
    use std::time::Duration;

    use crate::core::dosage::DosageClassification;
    use crate::core::phase::PhaseClassification;
    use crate::core::route_of_administration::RouteOfAdministrationClassification;
    use crate::ingestion_analyzer::analyze_future_ingestion;
    use crate::service::ingestion::CreateIngestion;

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
            }
            Err(e) => panic!("Test failed: {}", e),
        }
    }
}
