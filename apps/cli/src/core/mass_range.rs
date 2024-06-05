use std::str::FromStr;

use serde::Serialize;
use uom::si::f32::Mass;
use uom::str::ParseQuantityError;

#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct MassRange(pub Mass, pub Mass);

pub fn parse_mass_by_f32_and_unit(value: f32, unit: &str) -> Result<Mass, ParseQuantityError> {
    let input = format!("{} {}", value, unit);
    Mass::from_str(&input)
}
