use std::collections::HashMap;
use std::str::FromStr;

use db::prelude::SubstanceRouteOfAdministrationPhase;
use serde::{Deserialize, Serialize};
use strsim::normalized_levenshtein;

use crate::core::route_of_administration_dosage::{
    DosageClassification, RouteOfAdministrationDosage,
};
use crate::core::route_of_administration_phase::PhaseClassification;

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
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

impl FromStr for RouteOfAdministrationClassification {
    type Err = ();
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        return match s {
            "buccal" => Ok(RouteOfAdministrationClassification::Buccal),
            "inhaled" => Ok(RouteOfAdministrationClassification::Inhaled),
            "insufflated" => Ok(RouteOfAdministrationClassification::Insufflated),
            "intramuscular" => Ok(RouteOfAdministrationClassification::Intramuscular),
            "intravenous" => Ok(RouteOfAdministrationClassification::Intravenous),
            "oral" => Ok(RouteOfAdministrationClassification::Oral),
            "rectal" => Ok(RouteOfAdministrationClassification::Rectal),
            "smoked" => Ok(RouteOfAdministrationClassification::Smoked),
            "sublingual" => Ok(RouteOfAdministrationClassification::Sublingual),
            "transdermal" => Ok(RouteOfAdministrationClassification::Transdermal),
            _ => {
                let best_match = [
                    "buccal",
                    "inhaled",
                    "insufflated",
                    "intramuscular",
                    "intravenous",
                    "oral",
                    "rectal",
                    "smoked",
                    "sublingual",
                    "transdermal",
                ]
                .iter()
                .max_by_key(|key| key.to_string())
                .unwrap();

                // Threshold (e.g., similarity > 0.8)
                if normalized_levenshtein(s, best_match) > 0.8 {
                    Self::from_str(best_match) // Recurse to use the corrected string
                } else {
                    Err(())
                }
            }
        };
    }
}

#[test]
fn should_match_insufflated_input_with_insufflated_enum() {
    let result = RouteOfAdministrationClassification::from_str("insufflated");
    assert_eq!(result, Ok(RouteOfAdministrationClassification::Insufflated));
}

type RouteOfAdministrationDosages = HashMap<DosageClassification, RouteOfAdministrationDosage>;

#[derive()]
pub struct RouteOfAdministration {
    id: String,
    substance_name: String,
    classification: RouteOfAdministrationClassification,
    dosages: RouteOfAdministrationDosages,
    phases: HashMap<PhaseClassification, SubstanceRouteOfAdministrationPhase>,
}
