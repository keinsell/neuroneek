use crate::database::entities::ingestion::Model;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use chrono::DateTime;
use chrono::Local;
use chrono::TimeZone;

pub type IngestionDate = DateTime<Local>;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Ingestion
{
    pub id: Option<i32>,
    pub substance: String,
    pub dosage: Dosage,
    pub route: RouteOfAdministrationClassification,
    pub ingestion_date: IngestionDate,
}

impl From<Model> for Ingestion
{
    fn from(value: Model) -> Self
    {
        Ingestion {
            id: Some(value.id),
            substance: value.substance_name,
            dosage: Dosage::from_base_units(value.dosage as f64),
            ingestion_date: Local.from_utc_datetime(&value.ingested_at),
            route: value
                .route_of_administration
                .parse()
                .unwrap_or(RouteOfAdministrationClassification::Oral),
        }
    }
}
