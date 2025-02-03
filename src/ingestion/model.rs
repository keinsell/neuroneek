use crate::database::entities::ingestion::Model;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::dosage::DosageClassification;
use crate::substance::route_of_administration::phase::PhaseClassification;
use chrono::DateTime;
use chrono::Duration;
use chrono::Local;
use chrono::TimeZone;
use clap::builder::TypedValueParser;
use hashbrown::HashMap;
use std::ops::Range;
use std::str::FromStr;

pub type IngestionDate = DateTime<Local>;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Ingestion
{
    pub id: Option<i32>,
    pub substance_name: String,
    pub dosage: Dosage,
    pub route: RouteOfAdministrationClassification,
    pub ingestion_date: IngestionDate,
    /// The classification of the dosage for this ingestion.
    /// This field is an `Option` to allow for cases where the dosage
    /// classification cannot be determined.
    pub dosage_classification: Option<DosageClassification>,
    /// The substance.rs ingested in this event.
    /// This field is wrapped in an `Option` and a `Box` to allow for optional
    /// ownership.
    #[serde(skip_serializing, skip_deserializing)]
    pub substance: Option<Box<crate::substance::Substance>>,
    /// A vector of `IngestionPhase` structs representing the different phases
    /// of the ingestion event.
    pub phases: Vec<IngestionPhase>,
}

impl From<Model> for Ingestion
{
    fn from(value: Model) -> Self
    {
        Ingestion {
            id: Some(value.id),
            substance_name: value.substance_name,
            dosage: Dosage::from_base_units(value.dosage as f64),
            ingestion_date: Local.from_utc_datetime(&value.ingested_at),
            route: value
                .route_of_administration
                .parse()
                .unwrap_or(RouteOfAdministrationClassification::Oral),
            dosage_classification: None,
            substance: None,
            phases: vec![],
        }
    }
}

type PhaseDuration = Range<Duration>;
type PhaseSchedule = HashMap<PhaseClassification, IngestionPhase>;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IngestionPhase
{
    pub(crate) id: Option<String>,
    pub(crate) class: PhaseClassification,
    pub(crate) start_time: Range<DateTime<Local>>,
    pub(crate) end_time: Range<DateTime<Local>>,
    pub(crate) duration: PhaseDuration,
}
impl From<crate::database::entities::ingestion_phase::Model> for IngestionPhase
{
    fn from(value: crate::database::entities::ingestion_phase::Model) -> Self
    {
        let duration_lower = value.duration_min;
        let duration_upper = value.duration_max;

        Self {
            id: Some(value.id),
            class: PhaseClassification::from_str(&value.classification).unwrap(),
            start_time: (Local.from_utc_datetime(&value.start_date_min)
                ..Local.from_utc_datetime(&value.start_date_max)),
            end_time: (Local.from_utc_datetime(&value.end_date_min)
                ..Local.from_utc_datetime(&value.end_date_max)),
            duration: Duration::minutes(duration_lower as i64)
                ..Duration::minutes(duration_upper as i64),
        }
    }
}
