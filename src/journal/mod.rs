use crate::substance::route_of_administration::phase::PhaseClassification;
use chrono::DateTime;
use chrono::Local;

/// !todo Journal is about combining user's inputs against their neurochemical,
/// user is able to take "checkpoints" on their timeline and note how they feel
/// at that time. This functionality fundamentally allow for correlation of
/// ingestion with real-life mood and subjective experience and with enough data
/// collected sufficient probability could be established so user will be
/// informed what had potentially good subjective impact on them and what had
/// potentially bad.
struct Journal
{
    id: Option<i32>,
    from: DateTime<Local>,
    to: DateTime<Local>,
    phase_classification: PhaseClassification,
    ingestion_id: i32,
}
