extern crate measurements;

use std::ops::{Range, RangeFrom, RangeTo};
use std::str::FromStr;

use serde::{Deserialize, Serialize};

pub type Dosage = measurements::Mass;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Eq, Hash, Copy)]
#[serde(rename_all = "snake_case")]
pub enum DosageClassification {
    Threshold,
    Heavy,
    Common,
    Light,
    Strong,
    Exceptional,
    Unknown,
}

impl FromStr for DosageClassification {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "threshold" => Ok(DosageClassification::Threshold),
            "heavy" => Ok(DosageClassification::Heavy),
            "common" => Ok(DosageClassification::Common),
            "light" => Ok(DosageClassification::Light),
            "strong" => Ok(DosageClassification::Strong),
            "exceptional" => Ok(DosageClassification::Exceptional),
            _ => Err(()),
        }
    }
}

impl From<DosageClassification> for String {
    fn from(dosage_classification: DosageClassification) -> Self {
        match dosage_classification {
            DosageClassification::Threshold => "threshold".to_string(),
            DosageClassification::Heavy => "heavy".to_string(),
            DosageClassification::Common => "common".to_string(),
            DosageClassification::Light => "light".to_string(),
            DosageClassification::Strong => "strong".to_string(),
            DosageClassification::Exceptional => "exceptional".to_string(),
            DosageClassification::Unknown => "unknown".to_string(),
        }
    }
}

#[derive(Debug, PartialEq, Clone)]
pub enum DosageRange {
    Heavy(RangeFrom<Dosage>),
    Threshold(RangeTo<Dosage>),
    Inclusive(Range<Dosage>),
}

impl DosageRange {
    pub fn contains(&self, mass: Dosage) -> bool {
        match self {
            DosageRange::Heavy(range) => range.start < mass,
            DosageRange::Threshold(range) => mass < range.end,
            DosageRange::Inclusive(range) => range.start < mass && mass < range.end,
        }
    }
}
#[test]
fn dosage_range_contains_should_correctly_match_ranges() {
    let heavy_range = DosageRange::Heavy(Dosage::from_kilograms(1.0)..);
    assert!(heavy_range.contains(Dosage::from_kilograms(1.5)));

    let threshold_range = DosageRange::Threshold(..Dosage::from_kilograms(1.0));
    assert!(threshold_range.contains(Dosage::from_kilograms(0.5)));

    let inclusive_range = DosageRange::Inclusive(Dosage::from_kilograms(1.0)..Dosage::from_kilograms(2.0));
    assert!(inclusive_range.contains(Dosage::from_kilograms(1.5)));
    assert!(!inclusive_range.contains(Dosage::from_kilograms(2.5)));
}



#[derive(Debug, Clone)]
pub struct RouteOfAdministrationDosage {
    // pub id: String,
    // pub route_of_administration_id: String,
    pub dosage_classification: DosageClassification,
    pub dosage_range: DosageRange,
}

