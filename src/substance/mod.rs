pub mod route_of_administration;

use crate::core::CommandHandler;
use clap::Parser;
use clap::Subcommand;
pub mod error;
pub mod repository;

use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use hashbrown::HashMap;
use iso8601_duration::Duration;
use route_of_administration::dosage::Dosage;
use serde::Deserialize;
use serde::Serialize;
use std::fmt;
use std::ops::Range;
use std::str::FromStr;


#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Eq, Hash)]
pub enum DosageClassification
{
    Threshold,
    Light,
    Medium,
    Strong,
    Heavy,
}

impl FromStr for DosageClassification
{
    type Err = ();

    fn from_str(input: &str) -> Result<Self, Self::Err>
    {
        match input
        {
            | "threshold" => Ok(Self::Threshold),
            | "light" => Ok(Self::Light),
            | "common" => Ok(Self::Medium),
            | "strong" => Ok(Self::Strong),
            | "heavy" => Ok(Self::Heavy),
            | _ => Err(()),
        }
    }
}

impl fmt::Display for DosageClassification
{
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result
    {
        match self
        {
            | DosageClassification::Threshold => write!(f, "Threshold"),
            | DosageClassification::Light => write!(f, "Light"),
            | DosageClassification::Medium => write!(f, "Medium"),
            | DosageClassification::Strong => write!(f, "Strong"),
            | DosageClassification::Heavy => write!(f, "Heavy"),
        }
    }
}

pub type RoutesOfAdministration =
    HashMap<RouteOfAdministrationClassification, RouteOfAdministration>;

#[derive(Debug, Clone)]
pub struct Substance
{
    pub name: String,
    pub routes_of_administration: RoutesOfAdministration,
}

// Can be Exclusive range
// 1. **Inclusive range**
// 1. **Half-open range (starting at zero)**:
// 1. **Open-ended range**:
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DosageRange
{
    pub start: Option<Dosage>,
    pub end: Option<Dosage>,
}

impl DosageRange
{
    pub fn contains(&self, dosage: &Dosage) -> bool
    {
        let after_start = match &self.start
        {
            | Some(start) => dosage >= start,
            | None => true,
        };
        let before_end = match &self.end
        {
            | Some(end) => dosage <= end,
            | None => true,
        };
        after_start && before_end
    }

    pub fn from_bounds(start: Option<Dosage>, end: Option<Dosage>) -> Self { Self { start, end } }
}
pub type DurationRange = Range<Duration>;

pub type Dosages = HashMap<DosageClassification, DosageRange>;

#[derive(Debug, Clone)]
pub struct RouteOfAdministration
{
    pub classification: RouteOfAdministrationClassification,
    pub dosages: Dosages,
    pub phases: Phases,
}

use crate::cli::formatter::Formatter;
use route_of_administration::phase::Phases;
use tabled::Tabled;

pub(crate) type SubstanceTable = crate::database::entities::substance::Model;
