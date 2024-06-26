extern crate measurements;

use std::ops::{Range, RangeFrom, RangeTo};

pub type Mass = measurements::Mass;
pub type Dosage = Mass;

#[derive(Debug, PartialEq, Clone)]
pub enum DosageRange {
    Heavy(RangeFrom<Dosage>),
    Threshold(RangeTo<Dosage>),
    Inclusive(Range<Dosage>),
}

impl DosageRange {
    pub(super) fn contains(&self, mass: Dosage) -> bool {
        match self {
            DosageRange::Heavy(range) => range.start <= mass,
            DosageRange::Threshold(range) => mass <= range.end,
            DosageRange::Inclusive(range) => range.start <= mass && mass <= range.end,
        }
    }
}
#[test]
fn dosage_range_contains_should_correctly_match_ranges() {
    let heavy_range = DosageRange::Heavy(Dosage::from_kilograms(1.0)..);
    assert!(heavy_range.contains(Dosage::from_kilograms(1.5)));
    assert!(heavy_range.contains(Dosage::from_kilograms(1.0)));
    assert!(!heavy_range.contains(Dosage::from_kilograms(0.9)));

    let threshold_range = DosageRange::Threshold(..Dosage::from_kilograms(1.0));

    assert!(threshold_range.contains(Dosage::from_kilograms(0.5)));
    assert!(threshold_range.contains(Dosage::from_kilograms(1.0)));
    assert!(!threshold_range.contains(Dosage::from_kilograms(1.1)));

    let inclusive_range =
        DosageRange::Inclusive(Dosage::from_kilograms(1.0)..Dosage::from_kilograms(2.0));

    assert!(inclusive_range.contains(Dosage::from_kilograms(1.5)));
    assert!(!inclusive_range.contains(Dosage::from_kilograms(2.5)));
    assert!(!inclusive_range.contains(Dosage::from_kilograms(0.5)))
}

#[derive(Debug, Clone)]
pub struct RouteOfAdministrationDosage {
    // pub id: String,
    // pub route_of_administration_id: String,
    pub dosage_classification: DosageClassification,
    pub dosage_range: DosageRange,
}
