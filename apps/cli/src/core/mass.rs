use uom::fmt::DisplayStyle::Abbreviation;
use uom::si::f32::{Mass as MassUom, V};
use uom::si::fmt::QuantityArguments;
use uom::si::mass::{Dimension, gram, kilogram, milligram};
use uom::si::SI;

pub type Mass = MassUom;

// Implement functionality to parse Mass from string in format "1.0 kg", "1.0 kg", "50mg" "50 mg" and so on...

pub fn deserialize_mass_unit(mass_str: &str) -> Result<Mass, &'static str> {
    let mut mass_str = mass_str.trim().split_whitespace();
    let mass = mass_str.next().unwrap().parse::<f32>().unwrap();
    let unit = mass_str.next().unwrap();
    match unit {
        "kg" => Ok(Mass::new::<kilogram>(mass)),
        "g" => Ok(Mass::new::<gram>(mass)),
        "mg" => Ok(Mass::new::<milligram>(mass)),
        _ => Err("Invalid unit"),
    }
}

pub fn mg(mass: Mass) -> QuantityArguments<Dimension, SI<V>, V, milligram> {
    return Mass::into_format_args(mass, milligram, Abbreviation);
}
