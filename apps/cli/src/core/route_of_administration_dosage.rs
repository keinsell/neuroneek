use std::ops::{Range, RangeFrom, RangeTo};
use std::str::FromStr;

use serde::{Deserialize, Serialize};

use crate::core::mass::Mass;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Eq, Hash)]
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

#[derive(Debug, Serialize)]
pub enum DosageRange {
    From(RangeFrom<Mass>),
    To(RangeTo<Mass>),
    Inclusive(Range<Mass>),
}

#[derive(Debug, Serialize)]
pub struct RouteOfAdministrationDosage {
    pub id: String,
    pub route_of_administration_id: String,
    pub dosage_classification: DosageClassification,
    pub dosage_range: DosageRange,
}
