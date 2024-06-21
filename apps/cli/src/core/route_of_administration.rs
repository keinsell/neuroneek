use std::collections::HashMap;
use std::fmt::Display;
use std::str::FromStr;

use serde::{Deserialize, Serialize};
use strsim::normalized_levenshtein;

use crate::core::dosage::{Dosage, DosageClassification, RouteOfAdministrationDosage};
use crate::core::phase::{Phase, PhaseClassification};

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Eq, Hash)]
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

impl Display for RouteOfAdministrationClassification {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let str = match self {
            RouteOfAdministrationClassification::Buccal => "buccal".to_string(),
            RouteOfAdministrationClassification::Inhaled => "inhaled".to_string(),
            RouteOfAdministrationClassification::Insufflated => "insufflated".to_string(),
            RouteOfAdministrationClassification::Intramuscular => "intramuscular".to_string(),
            RouteOfAdministrationClassification::Intravenous => "intravenous".to_string(),
            RouteOfAdministrationClassification::Oral => "oral".to_string(),
            RouteOfAdministrationClassification::Rectal => "rectal".to_string(),
            RouteOfAdministrationClassification::Smoked => "smoked".to_string(),
            RouteOfAdministrationClassification::Sublingual => "sublingual".to_string(),
            RouteOfAdministrationClassification::Transdermal => "transdermal".to_string(),
        };
        write!(f, "{}", str)
    }
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

impl From<RouteOfAdministrationClassification> for String {
    fn from(roa: RouteOfAdministrationClassification) -> Self {
        match roa {
            RouteOfAdministrationClassification::Buccal => String::from("buccal"),
            RouteOfAdministrationClassification::Inhaled => String::from("inhaled"),
            RouteOfAdministrationClassification::Insufflated => String::from("insufflated"),
            RouteOfAdministrationClassification::Intramuscular => String::from("intramuscular"),
            RouteOfAdministrationClassification::Intravenous => String::from("intravenous"),
            RouteOfAdministrationClassification::Oral => String::from("oral"),
            RouteOfAdministrationClassification::Rectal => String::from("rectal"),
            RouteOfAdministrationClassification::Smoked => String::from("smoked"),
            RouteOfAdministrationClassification::Sublingual => String::from("sublingual"),
            RouteOfAdministrationClassification::Transdermal => String::from("transdermal"),
        }
    }
}

#[test]
fn should_match_insufflated_input_with_insufflated_enum() {
    let result = RouteOfAdministrationClassification::from_str("insufflated");
    assert_eq!(result, Ok(RouteOfAdministrationClassification::Insufflated));
}

pub type RouteOfAdministrationDosages = HashMap<DosageClassification, RouteOfAdministrationDosage>;

pub trait FindClassificationByDosage {
    fn find_classification_by_dosage(&self, dosage: &Dosage) -> Result<DosageClassification, String>;
}

impl FindClassificationByDosage for RouteOfAdministrationDosages {
     fn find_classification_by_dosage(&self, dosage: &Dosage) -> Result<DosageClassification, String> {
        for (classification, route_of_administration_dosage) in self {
            if route_of_administration_dosage.dosage_range.contains(*dosage) {
                return Ok(*classification);
            }
        }
        Err("Dosage classification not found".to_string())
    }
}


pub type RouteOfAdministrationPhases = HashMap<PhaseClassification, Phase>;

#[derive(Debug, Clone)]
pub struct RouteOfAdministration {
    // pub substance_name: String,
    pub classification: RouteOfAdministrationClassification,
    pub dosages: RouteOfAdministrationDosages,
    pub phases: RouteOfAdministrationPhases,
}

