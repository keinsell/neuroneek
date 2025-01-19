use crate::ingestion::model::IngestionDate;
use crate::substance::DosageClassification;
use std::ops::Range;

/// `IngestionAnalysis` is a struct that represents the analysis of an ingestion
/// event. It contains various fields to store information about the ingestion,
/// the substance.rs ingested, the dosage classification, the current phase of
/// the ingestion, the start and end times of the ingestion, the phases of the
/// ingestion, the total duration excluding the afterglow phase, and the
/// progress of the ingestion.
#[derive(Debug, Serialize, Clone)]
pub struct IngestionAnalysis
{
    /// The ingestion event associated with this analysis.
    /// This field is wrapped in an `Option` and a `Box` to allow for optional
    /// ownership.
    #[serde(skip_serializing)]
    pub ingestion: Option<Box<crate::ingestion::model::Ingestion>>,

    /// The substance.rs ingested in this event.
    /// This field is wrapped in an `Option` and a `Box` to allow for optional
    /// ownership.
    #[serde(skip_serializing)]
    pub substance: Option<Box<crate::substance::Substance>>,

    /// The classification of the dosage for this ingestion.
    /// This field is an `Option` to allow for cases where the dosage
    /// classification cannot be determined.
    pub dosage_classification: Option<DosageClassification>,

    /// The current phase of the ingestion, if it can be determined.
    /// This field is an `Option` to allow for cases where the current phase
    /// cannot be determined.
    #[serde(skip_serializing)]
    pub current_phase:
        Option<crate::substance::route_of_administration::phase::PhaseClassification>,

    /// The start time of the ingestion event (copy of ingestion.ingestion_date)
    pub ingestion_start: IngestionDate,

    /// The end time of the ingestion event.
    /// Ingestion end time is a range of ingestion start time and duration of
    /// all phases (excluding afterglow).
    pub ingestion_end: IngestionDate,

    /// A vector of `IngestionPhase` structs representing the different phases
    /// of the ingestion event.
    pub phases: Vec<IngestionPhase>,
}

#[derive(Debug, Clone, Serialize)]
pub struct IngestionPhase
{
    pub(crate) class: crate::substance::route_of_administration::phase::PhaseClassification,
    pub(crate) duration_range: Range<IngestionDate>,
    pub(crate) prev: Option<Box<IngestionPhase>>,
    pub(crate) next: Option<Box<IngestionPhase>>,
}

/// !TODO
/// `JournalAnalysis` is a struct that represents the analytics of a complete
/// user's ingestion history it contains a various aspects of information, such
/// as classification by psychoactive groups, peeking into recommended dosages
/// and history of usage, pattern recognition and statically defined rule engine
/// to inform user again stupid decisions they are about to make.
pub struct JournalAnalysis {}
