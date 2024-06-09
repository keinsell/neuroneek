use std::num::ParseFloatError;
use std::str::FromStr;
use crate::core::dosage::Dosage;

pub type Mass = Dosage;

pub fn deserialize_dosage(mass_str: &str) -> Result<Mass, ParseFloatError> {
   return Dosage::from_str(mass_str);
}
