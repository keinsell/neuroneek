use std::str::FromStr;
use serde::{Serialize, Serializer};
use uom::si::f32::Mass;
use uom::str::ParseQuantityError;

#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct MassRange(pub Mass, pub Mass);

impl MassRange {
    pub fn contains(&self, mass: Mass) -> bool {
        let (min, max) = (&self.0, &self.1);
        mass >= *min && mass <= *max
    }
}

pub fn parse_mass_by_f32_and_unit(value: f32, unit: &str) -> Result<Mass, ParseQuantityError> {
    let input = format!("{} {}", value, unit);
    Mass::from_str(&input)
}

pub fn serialize_mass_to_string(mass: Mass) -> String 
{
    format!("{} {:?}", &mass.value.to_string(), mass.units)
}