use crate::substance::route_of_administration::phase::PhaseClassification;
use chrono::DateTime;
use chrono::Local;

struct JournalEvent
{
    id: Option<i32>,
    from: DateTime<Local>,
    to: DateTime<Local>,
    phase_classification: PhaseClassification,
    ingestion_id: i32,
}
