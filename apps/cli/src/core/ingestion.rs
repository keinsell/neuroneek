use std::collections::HashMap;

use chrono::{DateTime, Local, Utc};
use chrono_humanize::HumanTime;

use crate::core::mass::Mass;
use crate::core::phase::{DurationRange, PhaseClassification};
use crate::core::route_of_administration::RouteOfAdministrationClassification;

#[derive(Debug)]
pub struct IngestionPhase {
    pub(crate) phase_classification: PhaseClassification,
    pub(crate) duration: DurationRange,
    pub(crate) start_time: DateTime<Local>,
    pub(crate) end_time: DateTime<Local>,
}

pub type IngestionPhases = HashMap<PhaseClassification, IngestionPhase>;

pub struct Ingestion {
    pub(crate) id: i32,
    pub(crate) substance_name: String,
    pub(crate) administration_route: RouteOfAdministrationClassification,
    pub(crate) ingested_at: DateTime<Utc>,
    pub(crate) humanized_ingested_at: HumanTime,
    pub(crate) dosage: Mass,
    pub(crate) phases: IngestionPhases,
}
