use delegate::delegate;
use derivative::Derivative;
use float_pretty_print::PrettyPrintFloat;
use measurements::Mass;
use measurements::Measurement;
use serde::Deserialize;
use serde::Serialize;
use std::fmt;
use std::ops::RangeBounds;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Derivative, Eq, PartialOrd)]
pub struct Dosage(Mass);

impl std::str::FromStr for Dosage
{
    type Err = String;

    /// Parse a &str into a valid `Dosage`.
    fn from_str(s: &str) -> Result<Self, Self::Err>
    {
        let mass = Mass::from_str(s).unwrap();
        Ok(Dosage(mass))
    }
}


impl fmt::Display for Dosage
{
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result
    {
        let suggested_unit = self.0.get_appropriate_units();
        let value_of_unit = format!("{:4.4}", PrettyPrintFloat(suggested_unit.1));
        let unit = suggested_unit.0;
        let formatted = format!("{} {}", value_of_unit.trim_start(), unit);
        write!(f, "{}", formatted)
    }
}

impl Dosage
{
    pub fn from_base_units(units: f64) -> Dosage { Dosage(Mass::from_base_units(units)) }

    delegate! {
        to self.0 {
            pub fn as_base_units(&self) -> f64;
        }
    }
}


#[cfg(test)]
mod tests
{
    use super::*;
    use std::str::FromStr;

    #[test]
    fn test_parse_dosage()
    {
        assert_eq!(
            Dosage::from_str("100g").unwrap(),
            Dosage(Mass::from_grams(100f64))
        );
        assert_eq!(
            Dosage::from_str("100kg").unwrap(),
            Dosage(Mass::from_kilograms(100f64))
        );
        assert_eq!(
            Dosage::from_str("100kg").unwrap(),
            Dosage(Mass::from_kilograms(100f64))
        );
    }

    #[test]
    fn test_format_dosage()
    {
        let dosage = Dosage(Mass::from_grams(0.1));
        assert_eq!(dosage.to_string(), "100 mg");
    }
}
