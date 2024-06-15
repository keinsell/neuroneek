use std::collections::HashMap;

use chrono::{DateTime, Local, Utc};
use serde::{Deserialize, Serialize};

use crate::core::dosage::Dosage;
use crate::core::phase::{DurationRange, PhaseClassification};
use crate::core::route_of_administration::RouteOfAdministrationClassification;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct IngestionPhase {
    pub(crate) phase_classification: PhaseClassification,
    pub(crate) duration: DurationRange,
    pub(crate) start_time: DateTime<Local>,
    pub(crate) end_time: DateTime<Local>,
}

pub type IngestionPhases = HashMap<PhaseClassification, IngestionPhase>;

#[derive( Serialize, Debug, Deserialize, Clone)]
pub struct Ingestion {
    pub(crate) id: i32,
    pub(crate) substance_name: String,
    pub(crate) administration_route: RouteOfAdministrationClassification,
    pub(crate) ingested_at: DateTime<Utc>,
    pub(crate) dosage: Dosage,
    pub(crate) phases: IngestionPhases,
}

impl Ingestion {
    pub fn new(
        id: i32,
        substance_name: String,
        administration_route: RouteOfAdministrationClassification,
        ingested_at: DateTime<Utc>,
        dosage: Dosage,
        phases: IngestionPhases,
    ) -> Self {
        Ingestion {
            id,
            substance_name,
            administration_route,
            ingested_at,
            dosage,
            phases,
        }
    }
}