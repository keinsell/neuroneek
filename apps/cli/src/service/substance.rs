// TODO: Search substance (with typo-tolerance and alternative names)
// TODO: Extractor: Get Dosage Classification by Dosage Amount

use std::ops::{Range, RangeTo};
use std::str::FromStr;

use chrono::TimeDelta;
use fuzzy_matcher::FuzzyMatcher;
use fuzzy_matcher::skim::SkimMatcherV2;
use sea_orm::*;

use crate::core::mass::Mass;
use crate::core::route_of_administration::{
    RouteOfAdministration, RouteOfAdministrationClassification, RouteOfAdministrationDosages,
    RouteOfAdministrationPhases,
};
use crate::core::route_of_administration_dosage::{
    DosageClassification, DosageRange, RouteOfAdministrationDosage,
};
use crate::core::route_of_administration_phase::{
    PhaseClassification, PhaseDuration, RouteOfAdministrationPhase,
};
use crate::core::substance::{RoutesOfAdministration, Substance};
use crate::orm::DB_CONNECTION;

/// This function will query database for a given substance name and will rebuild
/// substance structure from database, such structure is well more adjusted to
/// data analytics than serialized information from database.
pub async fn get_substance_by_name(name: &str) -> Option<Substance> {
    let substance = search_substance(&DB_CONNECTION, name).await.unwrap();

    let substance_route_of_administrations = db::substance_route_of_administration::Entity::find()
        .filter(db::substance_route_of_administration::Column::SubstanceName.eq(&substance.name))
        .all(&DB_CONNECTION as &DatabaseConnection)
        .await
        .unwrap();

    let mut routes_of_administration = RoutesOfAdministration::new();

    for route_of_administration in substance_route_of_administrations {
        // Find dosages related to route of administration
        let all_roa_dosages: Vec<RouteOfAdministrationDosage> =
            db::substance_route_of_administration_dosage::Entity::find()
                .filter(
                    db::substance_route_of_administration_dosage::Column::RouteOfAdministrationId
                        .eq(&route_of_administration.id),
                )
                .all(&DB_CONNECTION as &DatabaseConnection)
                .await
                .unwrap()
                .iter()
                .map(|d| {
                    let dosage_classification =
                        DosageClassification::from_str(&d.intensivity).unwrap();
                    let mass_unit = d.unit.clone();
                    let route_of_administration_id = d.route_of_administration_id.clone().unwrap();
                    let dosage_range: DosageRange = match dosage_classification {
                        DosageClassification::Threshold => {
                            let max_mass =
                                Mass::from_str(format!("{} {}", d.amount_max, mass_unit).as_str())
                                    .unwrap();
                            DosageRange::To(RangeTo {
                                end: max_mass.clone(),
                            })
                        }
                        DosageClassification::Heavy => {
                            let min_mass =
                                Mass::from_str(format!("{} {}", d.amount_min, mass_unit).as_str())
                                    .unwrap();
                            DosageRange::To(RangeTo {
                                end: min_mass.clone(),
                            })
                        }
                        _ => {
                            let min_mass =
                                Mass::from_str(format!("{} {}", d.amount_min, mass_unit).as_str())
                                    .unwrap();
                            let max_mass =
                                Mass::from_str(format!("{} {}", d.amount_max, mass_unit).as_str())
                                    .unwrap();
                            DosageRange::Inclusive(Range {
                                start: min_mass.clone(),
                                end: max_mass.clone(),
                            })
                        }
                    };

                    // Map dosage into into Dosage structure
                    let dosage = RouteOfAdministrationDosage {
                        id: d.id.clone(),
                        route_of_administration_id: route_of_administration_id,
                        dosage_classification: dosage_classification,
                        dosage_range: dosage_range,
                    };

                    dosage
                })
                .collect();

        // Once dosages are collected, we can create a hashmap of these dosages by their classification
        let mut roa_dosages: RouteOfAdministrationDosages = RouteOfAdministrationDosages::new();

        for dosage in all_roa_dosages {
            roa_dosages.insert(dosage.dosage_classification.clone(), dosage);
        }

        println!("{:?}", roa_dosages);

        let phases: Vec<RouteOfAdministrationPhase> =
            db::substance_route_of_administration_phase::Entity::find()
                .filter(
                    db::substance_route_of_administration_phase::Column::RouteOfAdministrationId
                        .eq(&route_of_administration.id),
                )
                .all(&DB_CONNECTION as &DatabaseConnection)
                .await
                .unwrap()
                .iter()
                .map(|p| {
                    let phase_id = p.id.clone();
                    let route_of_administration_id = p.route_of_administration_id.clone().unwrap();
                    let phase_classification =
                        PhaseClassification::from_str(&p.classification).unwrap();

                    let phase_duration = PhaseDuration {
                        start: TimeDelta::seconds(p.min_duration.unwrap() as i64),
                        end: TimeDelta::seconds(p.max_duration.unwrap() as i64),
                    };

                    let phase = RouteOfAdministrationPhase {
                        id: phase_id,
                        route_of_administration_id: route_of_administration_id,
                        phase_classification: phase_classification,
                        duration_range: phase_duration,
                    };

                    phase
                })
                .collect();

        let mut roa_phases: RouteOfAdministrationPhases = RouteOfAdministrationPhases::new();

        for phase in phases {
            roa_phases.insert(phase.phase_classification.clone(), phase);
        }

        let route_of_administration = RouteOfAdministration {
            id: route_of_administration.id.clone(),
            substance_name: route_of_administration.substance_name.clone(),
            classification: RouteOfAdministrationClassification::from_str(
                &route_of_administration.name,
            )
            .unwrap(),
            dosages: roa_dosages,
            phases: roa_phases,
        };

        routes_of_administration.insert(
            route_of_administration.classification,
            Option::from(route_of_administration),
        );
    }

    let ingernal_substance = Substance {
        id: substance.id.clone(),
        name: substance.name.clone(),
        common_names: substance
            .common_names
            .split(',')
            .map(|s| s.to_string())
            .collect(),
        routes_of_administration,
    };

    println!("{:?}", ingernal_substance);

    Some(ingernal_substance)
}

pub async fn search_substance(
    db: &DatabaseConnection,
    query: &str,
) -> Option<db::substance::Model> {
    let substances = db::substance::Entity::find().all(db).await.unwrap();
    let matcher = SkimMatcherV2::default();
    let mut results = Vec::new();

    for substance in substances {
        let score = matcher.fuzzy_match(&substance.name, query);
        if let Some(score) = score {
            if score > 75 {
                results.push(substance);
            }
        }
    }

    if results.is_empty() {
        None
    } else {
        Some(results[0].clone())
    }
}
