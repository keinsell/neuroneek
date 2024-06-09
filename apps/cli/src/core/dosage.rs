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
            DosageRange::Heavy(range) => range.start <= mass,
            DosageRange::Threshold(range) => mass <= range.end,
            DosageRange::Inclusive(range) => range.start <= mass && mass <= range.end,
        }
    }
}


extern crate measurements;
use measurements::*;

pub fn test_measurements() {
    for power in -12..12 {
        let val: f64 = 123.456 * (10f64.powf(f64::from(power)));
        println!("10^{}...", power);
        println!("Temp of {0:.3} outside", Temperature::from_kelvin(val));
        println!("Distance of {0:.3}", Length::from_meters(val));
        println!("Pressure of {0:.3}", Pressure::from_millibars(val));
        println!("Volume of {0:.3}", Volume::from_litres(val));
        println!("Mass of {0:.3}", Mass::from_kilograms(val));
        println!("Speed of {0:.3}", Speed::from_meters_per_second(val));
        println!(
            "Acceleration of {0:.3}",
            Acceleration::from_meters_per_second_per_second(val)
        );
        println!("Energy of {0:.3}", Energy::from_joules(val));
        println!("Power of {0:.3}", Power::from_watts(val));
        println!("Force of {0:.3}", Force::from_newtons(val));
        println!("Force of {0:.3}", Torque::from_newton_metres(val));
        println!(
            "Force of {0:.3}",
            AngularVelocity::from_radians_per_second(val)
        );
        println!("Data size is {0:.3}", Data::from_octets(val));
    }
}

#[derive(Debug, Clone)]
pub struct RouteOfAdministrationDosage {
    pub id: String,
    pub route_of_administration_id: String,
    pub dosage_classification: DosageClassification,
    pub dosage_range: DosageRange,
}