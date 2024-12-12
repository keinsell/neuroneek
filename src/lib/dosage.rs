use measurements::Mass;
use miette::IntoDiagnostic;
use std::str::FromStr;

pub type Dosage = Mass;

// TODO: This is not what it's meant to be, there is a still work needed on sane approach to automatic scaling of units.
/// Function will take human-readable input as representation of mass of substance that was ingested (also referred as Dosage)
pub fn parse_dosage(input: &str) -> miette::Result<Dosage> {
    Mass::from_str(input).into_diagnostic()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_dosage() {
        assert_eq!(parse_dosage("100g").unwrap(), Mass::from_grams(100 as f64));
        assert_eq!(parse_dosage("100kg").unwrap(), Mass::from_kilograms(100 as f64));
        assert_eq!(parse_dosage("100ug").unwrap(), Mass::from_micrograms(100 as f64))
    }
}
