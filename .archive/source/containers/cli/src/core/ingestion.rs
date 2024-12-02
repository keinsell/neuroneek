use std::str::FromStr;

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

#[derive(Serialize, Debug, Deserialize, Clone)]
pub struct Ingestion {
    pub(crate) id: i32,
    pub(crate) substance_name: String,
    pub(crate) administration_route: RouteOfAdministrationClassification,
    pub(crate) ingested_at: DateTime<Utc>,
    pub(crate) dosage: Dosage,
}

impl Ingestion {
    pub fn new(
        id: i32,
        substance_name: String,
        administration_route: RouteOfAdministrationClassification,
        ingested_at: DateTime<Utc>,
        dosage: Dosage,
    ) -> Self {
        Ingestion {
            id,
            substance_name,
            administration_route,
            ingested_at,
            dosage,
        }
    }
}

impl From<db::ingestion::Model> for Ingestion {
    fn from(ingestion: db::ingestion::Model) -> Self {
        Ingestion {
            id: ingestion.id,
            substance_name: ingestion.substance_name.unwrap(),
            administration_route: RouteOfAdministrationClassification::from_str(
                ingestion.administration_route.unwrap().as_str(),
            )
            .unwrap(),
            ingested_at: ingestion.ingestion_date.unwrap().and_utc(),
            dosage: Dosage::from_str(&format!(
                "{} {}",
                ingestion.dosage_amount.unwrap(),
                ingestion.dosage_unit.unwrap()
            ))
            .unwrap(),
        }
    }
}

impl<'a> From<&'a db::ingestion::Model> for Ingestion {
    fn from(ingestion: &'a db::ingestion::Model) -> Self {
        Ingestion {
            id: ingestion.id,
            substance_name: ingestion.substance_name.clone().unwrap(),
            administration_route: RouteOfAdministrationClassification::from_str(
                ingestion.administration_route.as_ref().unwrap().as_str(),
            )
            .unwrap(),
            ingested_at: ingestion.ingestion_date.as_ref().unwrap().and_utc(),
            dosage: Dosage::from_str(&format!(
                "{} {}",
                ingestion.dosage_amount.unwrap(),
                ingestion.dosage_unit.as_ref().unwrap()
            ))
            .unwrap(),
        }
    }
}
