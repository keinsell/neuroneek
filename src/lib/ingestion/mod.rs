use crate::lib::route_of_administration::RouteOfAdministrationClassification;
use crate::orm::ingestion::Model;
use chrono::TimeZone;
use serde::Deserialize;
use serde::Serialize;

pub type IngestionDate = chrono::DateTime<chrono::Local>;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Ingestion
{
    pub id: Option<i32>,
    pub substance: String,
    pub dosage: crate::lib::dosage::Dosage,
    pub route: RouteOfAdministrationClassification,
    pub ingestion_date: IngestionDate,
}

impl From<crate::orm::ingestion::Model> for Ingestion
{
    fn from(value: Model) -> Self
    {
        Ingestion {
            id: Some(value.id),
            substance: value.substance_name,
            dosage: crate::lib::dosage::Dosage::from_base_units(value.dosage as f64),
            ingestion_date: chrono::Local.from_utc_datetime(&value.ingested_at),
            route: value
                .route_of_administration
                .parse()
                .unwrap_or(RouteOfAdministrationClassification::Oral),
        }
    }
}
