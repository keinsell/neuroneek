use crate::database::ingestion;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

mod log_ingestion;
pub use log_ingestion::LogIngestion;

#[derive(Debug, Serialize, Deserialize)]
pub struct ViewModel {
    pub id: i32,
    pub substance_name: String,
    pub route: String,
    pub amount: String,
    pub notes: Option<String>,
    pub taken_at: DateTime<Utc>,
}

impl From<ingestion::Model> for ViewModel {
    fn from(model: ingestion::Model) -> Self {
        Self {
            id: model.id,
            substance_name: model.substance_name,
            route: model.route_of_administration,
            amount: format!("{} {}", model.dosage, model.dosage_unit),
            notes: model.notes,
            taken_at: model.ingested_at,
        }
    }
}
