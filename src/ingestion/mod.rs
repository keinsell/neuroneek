use crate::lib::orm::ingestion::Model;
use crate::lib::route_of_administration::RouteOfAdministrationClassification;
use chrono::TimeZone;

pub type IngestionDate = chrono::DateTime<chrono::Local>;

#[derive(Debug)]
pub struct Ingestion
{
    pub substance: String,
    pub dosage: crate::lib::dosage::Dosage,
    pub route: RouteOfAdministrationClassification,
    pub ingestion_date: IngestionDate,
}

impl From<crate::lib::orm::ingestion::Model> for Ingestion
{
    fn from(value: Model) -> Self
    {
        Ingestion {
            substance: value.substance_name,
            dosage: crate::lib::dosage::Dosage::from_base_units(value.dosage as f64),
            ingestion_date: chrono::Local
                .from_local_datetime(&value.ingested_at)
                .unwrap(),
            route: value
                .route_of_administration
                .parse()
                .unwrap_or(RouteOfAdministrationClassification::Oral),
        }
    }
}
