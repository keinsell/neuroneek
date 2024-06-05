use std::str::FromStr;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum PhaseClassification {
    Onset,
    Comeup,
    Peak,
    Offset,
    Afterglow,
}

impl From<PhaseClassification> for String {
    fn from(phase: PhaseClassification) -> Self {
        match phase {
            PhaseClassification::Onset => "onset".to_string(),
            PhaseClassification::Comeup => "comeup".to_string(),
            PhaseClassification::Peak => "peak".to_string(),
            PhaseClassification::Offset => "offset".to_string(),
            PhaseClassification::Afterglow => "afterglow".to_string(),
        }
    }
}

impl FromStr for PhaseClassification {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "onset" => Ok(PhaseClassification::Onset),
            "comeup" => Ok(PhaseClassification::Comeup),
            "peak" => Ok(PhaseClassification::Peak),
            "offset" => Ok(PhaseClassification::Offset),
            "afterglow" => Ok(PhaseClassification::Afterglow),
            _ => Err(()),
        }
    }
}
