pub extern crate measurements;

use std::ops::{Range, RangeFrom, RangeTo};

pub type Mass = measurements::Mass;

#[derive(Debug, PartialEq, Clone)]
pub enum MassRange {
    From(RangeFrom<Dosage>),
    To(RangeTo<Dosage>),
    Inclusive(Range<Dosage>),
}

impl MassRange {
    pub(super) fn contains(&self, mass: Mass) -> bool {
        match self {
            MassRange::From(range) => range.start <= mass,
            MassRange::To(range) => mass <= range.end,
            MassRange::Inclusive(range) => range.start <= mass && mass <= range.end,
        }
    }
}
