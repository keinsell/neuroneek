use crate::ingestion::Ingestion;
use crate::ingestion::IngestionDate;
use crate::substance::DosageClassification;
use crate::substance::Dosages;
use crate::substance::Substance;
use crate::substance::route_of_administration::phase::PHASE_ORDER;
use chrono::TimeDelta;
use miette::miette;
use serde::Serialize;
use std::ops::Add;
use std::ops::Range;

/// `IngestionAnalysis` is a struct that represents the analysis of an ingestion
/// event. It contains various fields to store information about the ingestion,
/// the substance.rs ingested, the dosage classification, the current phase of
/// the ingestion, the start and end times of the ingestion, the phases of the
/// ingestion, the total duration excluding the afterglow phase, and the
/// progress of the ingestion.
#[derive(Debug, Serialize)]
pub struct IngestionAnalysis
{
    /// The ingestion event associated with this analysis.
    /// This field is wrapped in an `Option` and a `Box` to allow for optional
    /// ownership.
    #[serde(skip_serializing)]
    pub(crate) ingestion: Option<Box<crate::ingestion::Ingestion>>,

    /// The substance.rs ingested in this event.
    /// This field is wrapped in an `Option` and a `Box` to allow for optional
    /// ownership.
    #[serde(skip_serializing)]
    substance: Option<Box<crate::substance::Substance>>,

    /// The classification of the dosage for this ingestion.
    /// This field is an `Option` to allow for cases where the dosage
    /// classification cannot be determined.
    pub(crate) dosage_classification: Option<DosageClassification>,

    /// The current phase of the ingestion, if it can be determined.
    /// This field is an `Option` to allow for cases where the current phase
    /// cannot be determined.
    #[serde(skip_serializing)]
    pub(crate) current_phase:
        Option<crate::substance::route_of_administration::phase::PhaseClassification>,

    /// The start time of the ingestion event (copy of ingestion.ingestion_date)
    ingestion_start: IngestionDate,

    /// The end time of the ingestion event.
    /// Ingestion end time is a range of ingestion start time and duration of
    /// all phases (excluding afterglow).
    ingestion_end: IngestionDate,

    /// A vector of `IngestionPhase` structs representing the different phases
    /// of the ingestion event.
    pub(crate) phases: Vec<IngestionPhase>,
}


#[derive(Debug, Clone, Serialize)]
pub struct IngestionPhase
{
    pub(crate) class: crate::substance::route_of_administration::phase::PhaseClassification,
    pub(crate) duration_range: Range<IngestionDate>,
    pub(crate) prev: Option<Box<IngestionPhase>>,
    pub(crate) next: Option<Box<IngestionPhase>>,
}

impl IngestionAnalysis
{
    pub async fn analyze(ingestion: Ingestion, substance: Substance) -> miette::Result<Self>
    {
        let roa = substance
            .routes_of_administration
            .get(&ingestion.route)
            .ok_or_else(|| miette!("Failed to find route of administration for substance.rs"))?
            .clone();

        let mut phases = Vec::new();
        let mut total_start_time: Option<IngestionDate> = None;
        let mut total_end_time: Option<IngestionDate> = None;
        let mut total_end_time_excl_afterglow: Option<IngestionDate> = None;

        let mut current_start_range = ingestion.ingestion_date;
        let mut prev_phase: Option<IngestionPhase> = None;

        for &phase_type in PHASE_ORDER.iter()
        {
            if let Some(phase) = roa
                .phases
                .iter()
                .find(|(p, _)| **p == phase_type)
                .map(|(_, v)| v)
            {
                let start_time_range = current_start_range;
                let end_time_range = start_time_range
                    .add(TimeDelta::from_std(phase.start.to_std().unwrap()).unwrap());

                total_start_time =
                    Some(total_start_time.map_or(start_time_range, |s| s.min(start_time_range)));
                total_end_time =
                    Some(total_end_time.map_or(end_time_range, |e| e.max(end_time_range)));

                if phase_type != crate::substance::route_of_administration::phase::PhaseClassification::Afterglow
                {
                    total_end_time_excl_afterglow = Some(
                        total_end_time_excl_afterglow
                            .map_or(end_time_range, |e| e.max(end_time_range)),
                    );
                }

                let new_phase = IngestionPhase {
                    class: phase_type,
                    duration_range: start_time_range..end_time_range,
                    prev: prev_phase.clone().map(Box::new),
                    next: None,
                };

                if let Some(prev) = prev_phase.as_mut()
                {
                    prev.next = Some(Box::new(new_phase.clone()));
                }

                phases.push(new_phase.clone());
                prev_phase = Some(new_phase);
                current_start_range = end_time_range;
            }
        }

        let total_range = total_start_time
            .zip(total_end_time)
            .map(|(start, end)| start..end)
            .ok_or_else(|| miette!("Could not compute total duration"))?;

        let current_date = chrono::Local::now();
        let current_phase = phases
            .iter()
            .find(|phase| {
                current_date >= phase.duration_range.start
                    && current_date < phase.duration_range.end
            })
            .map(|phase| phase.class);

        let dosage_classification = classify_dosage(ingestion.dosage.clone(), &roa.dosages);

        Ok(Self {
            ingestion: Some(Box::new(ingestion)),
            substance: Some(Box::new(substance)),
            dosage_classification,
            current_phase,
            ingestion_start: total_range.start,
            ingestion_end: total_range.end,
            phases,
        })
    }

    /// The progress of the ingestion event, represented as a float between 0.0
    /// and 1.0. This value represents the fraction of the total duration
    /// (excluding the afterglow phase) that has elapsed.
    pub fn progress(&self) -> f64
    {
        let now = chrono::Local::now();
        let total_duration = self.ingestion_end - self.ingestion_start;
        let elapsed_time = if now < self.ingestion_start
        {
            chrono::Duration::zero()
        }
        else
        {
            (now - self.ingestion_start).min(total_duration)
        };

        (elapsed_time.num_seconds() as f64 / total_duration.num_seconds() as f64).clamp(0.0, 1.0)
    }
}


pub(super) fn classify_dosage(
    dosage: crate::substance::dosage::Dosage,
    dosages: &Dosages,
) -> Option<DosageClassification>
{
    dosages
        .iter()
        .find(|(_, range)| range.contains(&dosage))
        .map(|(classification, _)| *classification)
        .or_else(|| {
            dosages
                .iter()
                .filter_map(|(_classification, range)| {
                    match (range.start.as_ref(), range.end.as_ref())
                    {
                        | (Some(start), _) if &dosage >= start => Some(DosageClassification::Heavy),
                        | (_, Some(end)) if &dosage <= end => Some(DosageClassification::Threshold),
                        | _ => None,
                    }
                })
                .next()
        })
}

#[cfg(test)]
mod tests
{
    use super::*;
    use crate::DATABASE_CONNECTION;
    use crate::migrate_database;
    use crate::substance::dosage::Dosage;

    use crate::substance::DosageClassification;
    use rstest::rstest;
    use std::str::FromStr;

    // #[rstest]
    // #[case("10mg", DosageClassification::Threshold)]
    // #[case("100mg", DosageClassification::Medium)]
    // #[case("1000mg", DosageClassification::Heavy)]
    // async fn should_classify_dosage(
    //     #[case] dosage_str: &str,
    //     #[case] expected: DosageClassification,
    // )
    // {
    //     let db = &DATABASE_CONNECTION;
    //     migrate_database(db).await.unwrap();
    //     let caffeine =
    // crate::substance::repository::get_substance("caffeine", db)
    //         .await
    //         .unwrap();
    //     let oral_caffeine_roa = caffeine
    //         .unwrap().routes_of_administration
    //         .get(&
    // crate::substance::route_of_administration::RouteOfAdministrationClassification::Oral)
    //         .unwrap()
    //         .clone()
    //         .dosages;
    //
    //     let dosage_instance = Dosage::from_str(dosage_str).unwrap();
    //     let classification = classify_dosage(dosage_instance,
    // &oral_caffeine_roa).unwrap();
    //
    //     assert_eq!(classification, expected);
    // }
}
