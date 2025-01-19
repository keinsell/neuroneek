use crate::substance::DurationRange;
use hashbrown::HashMap;
use miette::miette;
use serde::Deserialize;
use serde::Serialize;
use std::fmt;
use std::str::FromStr;

pub const PHASE_ORDER: [PhaseClassification; 5] = [
    PhaseClassification::Onset,
    PhaseClassification::Comeup,
    PhaseClassification::Peak,
    PhaseClassification::Comedown,
    PhaseClassification::Afterglow,
];

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Eq, Hash)]
pub enum PhaseClassification
{
    Onset,
    Comeup,
    Peak,
    Comedown,
    Afterglow,
    Unknown,
}

impl FromStr for PhaseClassification
{
    type Err = miette::Report;

    fn from_str(s: &str) -> Result<Self, Self::Err>
    {
        match s.to_lowercase().as_str()
        {
            | "onset" => Ok(Self::Onset),
            | "comeup" => Ok(Self::Comeup),
            | "peak" => Ok(Self::Peak),
            | "comedown" => Ok(Self::Comedown),
            | "offset" => Ok(Self::Comedown),
            | "afterglow" => Ok(Self::Afterglow),
            | _ => Err(miette!(
                "Could not parse phase classification {} from string",
                &s
            )),
        }
    }
}

impl fmt::Display for PhaseClassification
{
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result
    {
        match self
        {
            | PhaseClassification::Onset => write!(f, "Onset"),
            | PhaseClassification::Comeup => write!(f, "Comeup"),
            | PhaseClassification::Peak => write!(f, "Peak"),
            | PhaseClassification::Comedown => write!(f, "Comedown"),
            | PhaseClassification::Afterglow => write!(f, "Afterglow"),
            | PhaseClassification::Unknown => write!(f, "Unknown"),
        }
    }
}

impl Default for PhaseClassification
{
    fn default() -> Self { Self::Unknown }
}

pub type Phases = HashMap<PhaseClassification, DurationRange>;
