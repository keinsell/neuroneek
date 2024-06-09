use std::collections::HashMap;
use std::ops::Range;

use chrono::{DateTime, Local, Utc};
use chrono_humanize::HumanTime;

use crate::core::mass::Mass;
use crate::core::route_of_administration::RouteOfAdministrationClassification;
use crate::core::route_of_administration_phase::{PhaseClassification, PhaseDuration};

pub type HumanizedTimeRange = Range<HumanTime>;

#[derive(Debug)]
pub struct IngestionPhase {
    pub(crate) phase_classification: PhaseClassification,
    pub(crate) duration: PhaseDuration,
    pub(crate) humanized_duration: HumanizedTimeRange,
    pub(crate) start_time: DateTime<Local>,
}

pub type IngestionPhases = HashMap<PhaseClassification, IngestionPhase>;

pub struct Ingestion {
    pub(crate) id: i32,
    pub(crate) substance_name: String,
    pub(crate) administration_route: RouteOfAdministrationClassification,
    pub(crate) ingested_at: DateTime<Utc>,
    pub(crate) humanized_ingested_at: HumanTime,
    pub(crate) dosage: Mass,
}
