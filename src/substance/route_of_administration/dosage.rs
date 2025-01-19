use crate::substance::DosageClassification;
use crate::substance::Dosages;
use delegate::delegate;
use derivative::Derivative;
use float_pretty_print::PrettyPrintFloat;
use measurements::Mass;
use measurements::Measurement;
use serde::Deserialize;
use serde::Serialize;
use std::fmt;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Derivative, Eq, PartialOrd, Copy)]
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
    pub fn from_miligrams(units: f64) -> Dosage { Dosage(Mass::from_milligrams(units)) }

    delegate! {
        to self.0 {
            pub fn as_base_units(&self) -> f64;

        }
    }
}

impl TryInto<Dosage> for Option<f64>
{
    type Error = sea_orm::error::DbErr;

    fn try_into(self) -> Result<Dosage, Self::Error>
    {
        self.map(Dosage::from_base_units)
            .ok_or_else(|| sea_orm::error::DbErr::Custom("Dosage is NULL".to_string()))
    }
}

impl Default for Dosage
{
    fn default() -> Self { Dosage(Mass::from_base_units(0.0)) }
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

pub(crate) fn classify_dosage(dosage: Dosage, dosages: &Dosages) -> Option<DosageClassification>
{
    dosages
        .iter()
        .find(|(_, range)| range.contains(&dosage))
        .map(|(classification, _)| *classification)
        .or_else(|| {
            dosages
                .iter()
                .filter_map(|(_classification, range)| {
                    match (range.start.as_ref(), range.end.as_ref())
                    {
                        | (Some(start), _) if &dosage >= start => Some(DosageClassification::Heavy),
                        | (_, Some(end)) if &dosage <= end => Some(DosageClassification::Threshold),
                        | _ => None,
                    }
                })
                .next()
        })
}
