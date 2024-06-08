use std::ops::Range;

use uom::si::f32::Mass as MassUom;

pub type Mass = MassUom;
pub type MassRange = Range<Mass>;

// Implement functionality to parse Mass from string in format "1.0 kg", "1.0 kg", "50mg" "50 mg" and so on...
