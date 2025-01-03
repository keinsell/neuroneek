use clap::builder::TypedValueParser;
use float_pretty_print::PrettyPrintFloat;
use measurements::{Mass, Measurement};
use miette::IntoDiagnostic;
use std::str::FromStr;

pub type Dosage = Mass;

/// Function will take human-readable input as representation of mass of
/// substance that was ingested (also referred as Dosage)
pub fn parse_dosage(input: &str) -> miette::Result<Dosage>
{
    Mass::from_str(input).into_diagnostic()
}

pub fn format_dosage(input: &Dosage) -> miette::Result<String> {
    let suggested_unit = input.get_appropriate_units();
    let float = format!("{:4.4}", PrettyPrintFloat(suggested_unit.1));
    let unit = suggested_unit.0;
    Ok(format!("{} {}", float.trim_start(), unit))
}


#[cfg(test)]
mod tests
{
    use super::*;

    #[test]
    fn test_parse_dosage()
    {
        assert_eq!(parse_dosage("100g").unwrap(), Mass::from_grams(100f64));
        assert_eq!(parse_dosage("100kg").unwrap(), Mass::from_kilograms(100f64));
        assert_eq!(
            parse_dosage("100ug").unwrap(),
            Mass::from_micrograms(100f64)
        )
    }

    #[test]
    fn test_print_dosage() {
        let dosage = Mass::from_grams(0.1);
        assert_eq!(format_dosage(&dosage).unwrap(), "100 mg");
    }
}
