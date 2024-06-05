use chrono::{DateTime, Utc};
use chrono_humanize::HumanTime;
use uom::si::f32::Mass;

use crate::core::route_of_administration::RouteOfAdministrationClassification;
use crate::core::substance::Substance;

pub struct CoreIngestion {
    pub(crate) id: i32,
    pub(crate) substance: Substance,
    pub(crate) administration_route: RouteOfAdministrationClassification,
    pub(crate) ingested_at: DateTime<Utc>,
    pub(crate) humanized_ingested_at: HumanTime,
    pub(crate) dosage: Mass,
}
