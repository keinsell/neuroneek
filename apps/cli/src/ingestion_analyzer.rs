// This functionality should take a standard ingestion DTO
// and try to extract and provide as much information as it's
// possible. This is a very important part of the application

use std::fmt::Debug;
use std::time::Duration;

use chrono::{DateTime, Local};
use chrono_humanize::HumanTime;
use serde::{Deserialize, Serialize};
use termimad::MadSkin;

use crate::core::dosage::{Dosage, DosageClassification};
use crate::core::ingestion::{Ingestion, IngestionPhase};
use crate::core::ingestion_analysis::{IngestionAnalysis, IngestionPhases};
use crate::core::phase::PhaseClassification;
use crate::core::route_of_administration::{
    FindClassificationByDosage, RouteOfAdministrationClassification,
};
use crate::core::substance::{get_phases_by_route_of_administration, Substance};
use crate::service::substance::get_substance_by_name;

// https://docs.rs/indicatif/latest/indicatif/

#[derive(Debug, Clone, Serialize, Deserialize)]
struct DosageAnalysis {
    dosage_classification: DosageClassification,
}

pub struct AnalyzeIngestion {
    pub id: Option<i32>,
    pub substance: Substance,
    pub route_of_administration_classification: RouteOfAdministrationClassification,
    pub dosage: Dosage,
    pub ingested_at: DateTime<Local>,
}

pub async fn analyze_ingestion_from_ingestion(
    ingestion: Ingestion,
) -> Result<AnalyzeIngestion, &'static str> {
    Ok(AnalyzeIngestion {
        id: Some(ingestion.id),
        substance: get_substance_by_name(ingestion.clone().substance_name.as_str())
            .await
            .unwrap(),
        ingested_at: ingestion.ingested_at.into(),
        route_of_administration_classification: ingestion.administration_route,
        dosage: ingestion.dosage,
    })
}

pub async fn analyze_ingestion(
    analyze_ingestion: AnalyzeIngestion,
) -> Result<IngestionAnalysis, &'static str> {
    let substance = analyze_ingestion.substance;
    let route_of_administration_classification =
        analyze_ingestion.route_of_administration_classification;
    let routes_of_administration = substance.routes_of_administration;
    let dosage = analyze_ingestion.dosage;
    let route_of_administration = routes_of_administration
        .clone()
        .get(&route_of_administration_classification)
        .unwrap()
        .clone()
        .unwrap();
    let dosage_classification = route_of_administration
        .dosages
        .find_classification_by_dosage(&dosage)
        .unwrap();
    let phases = get_phases_by_route_of_administration(&route_of_administration);

    let total_duration = phases.iter().fold(Duration::default(), |acc, phase| {
        let added = acc + phase.duration_range.end;
        added
    });

    let route_of_administration_phases = route_of_administration.phases.clone();

    let mut projected_end_time = analyze_ingestion.ingested_at.clone();

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
                        start_time: projected_end_time,
                        end_time: projected_end_time + phase.duration_range.end,
                    };
                    projected_end_time = projected_end_time + ingestion_phase.duration.end;
                    (classification.clone(), ingestion_phase)
                })
        })
        .collect();

    let ingestion_analysis = IngestionAnalysis {
        id: analyze_ingestion.id.unwrap_or(0),
        ingestion_id: analyze_ingestion.id.unwrap_or(0),
        substance_name: substance.name.clone(),
        dosage: analyze_ingestion.dosage.clone(),
        route_of_administration_classification: route_of_administration.classification,
        dosage_classification,
        phases: ingestion_phases,
        total_duration,
        ingested_at: analyze_ingestion.ingested_at,
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
    use std::str::FromStr;
    use std::time::Duration;

    use chrono::DateTime;

    use crate::core::dosage::{Dosage, DosageClassification};
    use crate::core::phase::PhaseClassification;
    use crate::core::route_of_administration::RouteOfAdministrationClassification;
    use crate::ingestion_analyzer::{analyze_ingestion, AnalyzeIngestion};
    use crate::service::substance::get_substance_by_name;

    #[tokio::test]
    async fn test_analyze_future_ingestion() {
        let create_ingestion = AnalyzeIngestion {
            id: None,
            substance: get_substance_by_name("Caffeine").await.unwrap(),
            route_of_administration_classification: RouteOfAdministrationClassification::Oral,
            dosage: Dosage::from_str("100 mg").unwrap(),
            ingested_at: DateTime::default(),
        };

        let result = analyze_ingestion(create_ingestion).await;

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
