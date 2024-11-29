use std::collections::HashMap;
use std::time::Duration;

use chrono::{DateTime, Local};

use crate::core::dosage::{Dosage, DosageClassification};
use crate::core::ingestion::IngestionPhase;
use crate::core::phase::PhaseClassification;
use crate::core::route_of_administration::RouteOfAdministrationClassification;

pub type IngestionPhases = HashMap<PhaseClassification, IngestionPhase>;

#[derive(Debug)]
pub struct IngestionAnalysis {
    pub(crate) id: i32,
    pub ingestion_id: i32,
    pub substance_name: String,
    pub route_of_administration_classification: RouteOfAdministrationClassification,
    pub dosage_classification: DosageClassification,
    pub dosage: Dosage,
    pub phases: IngestionPhases,
    pub total_duration: Duration,
    pub ingested_at: DateTime<Local>,
}