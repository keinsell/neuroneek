use crate::database::ingestion;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use tabled::Tabled;

mod log_ingestion;
mod list_ingestions;

pub use log_ingestion::{LogIngestion};
pub use list_ingestions::ListIngestions;#[derive(Debug, Serialize, Deserialize, Tabled)]
pub struct ViewModel {
    pub id: i32,
    pub substance_name: String,
    pub route: String,
    pub amount: String,
    pub notes: String,
    pub taken_at: DateTime<Utc>,
}

impl std::fmt::Display for ViewModel {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{} {} {} {} {} {}", 
            self.id,
            self.substance_name,
            self.route,
            self.amount,
            self.notes,
            self.taken_at
        )
    }
}

impl From<ingestion::Model> for ViewModel {
    fn from(model: ingestion::Model) -> Self {
        Self {
            id: model.id,
            substance_name: model.substance_name,
            route: model.route_of_administration,
            amount: format!("{} {}", model.dosage, model.dosage_unit),
            notes: model.notes.unwrap_or("-".to_string()),
            taken_at: model.ingested_at,
        }
    }
}

fn display_option_string(opt: &Option<String>) -> String {
    opt.as_deref().unwrap_or("-").to_string()
}
