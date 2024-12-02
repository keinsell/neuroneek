use crate::core::dosage::Dosage;
use std::num::ParseFloatError;
use std::str::FromStr;

pub type Mass = Dosage;

pub fn deserialize_dosage(mass_str: &str) -> Result<Mass, ParseFloatError> {
    return Dosage::from_str(mass_str);
}
