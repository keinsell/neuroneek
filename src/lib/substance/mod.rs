use crate::lib::route_of_administration::RouteOfAdministrationClassification;
use colored::*;
use hashbrown::HashMap;
use iso8601_duration::Duration;
use miette::miette;
use serde::Deserialize;
use serde::Serialize;
use tabled::settings::Format;
use std::fmt;
use std::ops::Range;
use std::str::FromStr;
use tabled::settings::Alignment;
use tabled::settings::Extract;
use tabled::settings::Panel;
use tabled::settings::{ Modify, Style, Width};
use tabled::settings::object::{Columns, Rows};

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Eq, Hash)]
pub enum PhaseClassification
{
    Onset,
    Comeup,
    Peak,
    Comedown,
    Afterglow,
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
            // Add other variants of PhaseClassification here, if applicable.
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Eq, Hash)]
pub enum DosageClassification
{
    // From infinity to x Range
    Threshold,
    // From x to y
    Light,
    // From x to y
    Medium,
    // From x to y
    Strong,
    // From x to infinity Range
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

impl fmt::Display for Substance
{
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result
    {
        use tabled::builder::Builder;
        use tabled::settings::object::Segment;

        let mut table_builder = Builder::default();

        // Add headers
        table_builder.push_record(vec!["Route", "Dosage Information", "Duration Information"]);

        for (route, admin) in &self.routes_of_administration
        {
            // Format dosages in a clean, structured way
            let dosages = admin.dosages
                .iter()
                .map(|(classification, range)| {
                    format!(
                        "{:<9} {:>7} - {:<7}",
                        format!("{}:", classification),
                        crate::lib::dosage::Dosage::from_base_units(range.start).to_string(),
                        crate::lib::dosage::Dosage::from_base_units(range.end).to_string(),
                    )
                })
                .collect::<Vec<String>>()
                .join("\n");

            // Format phases in a clean, structured way
            let phases = admin.phases
                .iter()
                .map(|(phase, duration)| {
                    format!("{:<9} {:>7} - {:<7}", 
                        format!("{}:", phase),
                        duration.start.to_string(),
                        duration.end.to_string()
                    )
                })
                .collect::<Vec<String>>()
                .join("\n");

            // Add route and split information into two columns
            table_builder.push_record(vec![
                route.to_string(),
                dosages,
                phases,
            ]);
        }

        let mut built_table = table_builder.build();
        let table = built_table
            .with(Style::modern())
            .with(Panel::header(format!("Substance: {}", self.name)))
            .with(Modify::new(Segment::all()).with(Width::wrap(30)))
            .with(Modify::new(Columns::new(0..)).with(Alignment::left()))
            .with(Modify::new(Rows::first()).with(Alignment::center()));

        writeln!(f, "{}", table)?;
        Ok(())
    }
}

// Can be Exclusive range
// 1. **Inclusive range**
// 1. **Half-open range (starting at zero)**:
// 1. **Open-ended range**:
pub type DosageRange = Range<f64>;
pub type DurationRange = Range<Duration>;

pub type Dosages = HashMap<DosageClassification, DosageRange>;
pub type Phases = HashMap<PhaseClassification, DurationRange>;

#[derive(Debug, Clone)]
pub struct RouteOfAdministration
{
    pub classification: RouteOfAdministrationClassification,
    pub dosages: Dosages,
    pub phases: Phases,
}
