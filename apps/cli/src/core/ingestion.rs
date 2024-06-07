use chrono::{DateTime, Utc};
use chrono_humanize::HumanTime;
use uom::si::f32::Mass;

use crate::core::route_of_administration::RouteOfAdministrationClassification;

pub struct Ingestion {
    pub(crate) id: i32,
    pub(crate) substance_name: String,
    pub(crate) administration_route: RouteOfAdministrationClassification,
    pub(crate) ingested_at: DateTime<Utc>,
    pub(crate) humanized_ingested_at: HumanTime,
    pub(crate) dosage: Mass,
}
