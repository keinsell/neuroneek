use crate::ingestion::IngestionDate;
use crate::substance::{DosageClassification, Dosages};
use chrono::TimeDelta;
use chrono_humanize::HumanTime;
use miette::miette;
use std::fmt;
use std::ops::Add;
use std::ops::Range;
use tabled::Tabled;

#[derive(Debug)]
pub struct IngestionAnalysis
{
    ingestion: Option<Box<crate::ingestion::Ingestion>>,
    substance: Option<Box<crate::substance::Substance>>,
    dosage_classification: Option<DosageClassification>,
    phase_classification: Option<crate::substance::PhaseClassification>,
    ingestion_dates: Range<IngestionDate>,
    phases: Vec<IngestionPhase>,
}

#[derive(Debug, Clone)]
pub struct IngestionPhase
{
    class: crate::substance::PhaseClassification,
    averaged_event_duration: Range<IngestionDate>,
}

// TODO(NEU-4): Investigate usage of monte carlo estimation for predicting
// duration of ingestion phases

impl IngestionAnalysis
{
    pub async fn analyze(
        ingestion: crate::ingestion::Ingestion,
        substance: crate::substance::Substance,
    ) -> miette::Result<Self>
    {
        let roa = substance
            .routes_of_administration
            .get(&ingestion.route)
            .ok_or_else(|| miette!("Failed to find route of administration for substance"))?
            .clone();

        let phase_order = [
            crate::substance::PhaseClassification::Onset,
            crate::substance::PhaseClassification::Comeup,
            crate::substance::PhaseClassification::Peak,
            crate::substance::PhaseClassification::Comedown,
            crate::substance::PhaseClassification::Afterglow,
        ];

        let mut phases = Vec::new();
        let mut total_start_time: Option<IngestionDate> = None;
        let mut total_end_time: Option<IngestionDate> = None;

        let mut current_start_range = ingestion.ingestion_date;

        for &phase_type in phase_order.iter()
        {
            if let Some(phase) = roa
                .phases
                .iter()
                .find(|(p, _)| **p == phase_type)
                .map(|(_, v)| v)
            {
                let start_time_range = current_start_range;
                let duration_range = &phase;
                let end_time_range = start_time_range
                    .add(TimeDelta::from_std(duration_range.start.to_std().unwrap()).unwrap());

                total_start_time = total_start_time
                    .map_or(Some(start_time_range), |s| Some(s.min(start_time_range)));
                total_end_time =
                    total_end_time.map_or(Some(end_time_range), |e| Some(e.max(end_time_range)));

                phases.push(IngestionPhase {
                    class: phase_type,
                    averaged_event_duration: start_time_range..end_time_range,
                });

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
                current_date >= phase.averaged_event_duration.start
                    && current_date < phase.averaged_event_duration.end
            })
            .map(|phase| phase.class);
        
        let roa_dosages = roa.dosages;
        let dosage_classification = classify_dosage(ingestion.dosage.clone(), &roa_dosages)?;


        Ok(Self {
            ingestion: Some(Box::new(ingestion)),
            substance: Some(Box::new(substance)),
            dosage_classification: Some(dosage_classification),
            phase_classification: current_phase,
            ingestion_dates: total_range,
            phases,
        })
    }
}

use chrono::Utc;
use owo_colors::OwoColorize;
use tabled::Table;

#[derive(Tabled)]
struct PhaseDisplay {
    #[tabled(rename = "Phase")]
    phase: String,
    #[tabled(rename = "Start")]
    start: String,
    #[tabled(rename = "End")]
    end: String,
}

impl fmt::Display for IngestionAnalysis {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let now = Utc::now();

        let phase_displays: Vec<PhaseDisplay> = self
            .phases
            .iter()
            .map(|phase| {
                let is_passed = phase.averaged_event_duration.end < now;
                let phase_name = if is_passed {
                    phase.class.to_string().strikethrough().to_string() // Strikethrough for passed phases
                } else {
                    phase.class.to_string()
                };

                PhaseDisplay {
                    phase: phase_name,
                    start: HumanTime::from(phase.averaged_event_duration.start).to_string(),
                    end: HumanTime::from(phase.averaged_event_duration.end).to_string(),
                }
            })
            .collect();

        let table = Table::new(phase_displays)
            .with(tabled::settings::Style::modern_rounded())
            .to_string();

        writeln!(f, "{}", table)?;

        if let Some(phase_classification) = self.phase_classification {
            writeln!(f, "\nOverall Phase Classification: {}", phase_classification)?;
        }

        Ok(())
    }
}

// TODO: Should it be really existing?
pub fn classify_dosage(
    dosage: crate::lib::dosage::Dosage,
    roa_dosages: &Dosages,
) -> Result<DosageClassification, miette::Report> {
    for (classification, range) in roa_dosages {
        if range.contains(&dosage.as_base_units()) {
            return Ok(*classification);
        }
    }

    Err(miette!(
        "No dosage classification found for value: {}",
        dosage
    ))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::lib::dosage::Dosage;
    use crate::lib::migrate_database;
    use crate::lib::DATABASE_CONNECTION;
    use proptest::prelude::*;
    use rstest::rstest;

    #[rstest]
    #[case(9.0, DosageClassification::Threshold)]
    #[case(100.0, DosageClassification::Medium)]
    #[case(1000.0, DosageClassification::Heavy)]
    async fn should_classify_dosage(#[case] dosage: f64, #[case] expected:
    DosageClassification) {
        let db = &DATABASE_CONNECTION;
        migrate_database(db).await.unwrap();
        let caffeine = crate::substance::repository::get_substance_by_name("caffeine", db).await.unwrap();
        let oral_caffeine_roa = caffeine.routes_of_administration.get
        (&crate::lib::route_of_administration::RouteOfAdministrationClassification
        ::Oral).unwrap()
            .clone
            ().dosages;

        let dosage_instance = Dosage::from_miligrams(dosage);
        let classification = classify_dosage(dosage_instance, &oral_caffeine_roa).unwrap();

        assert_eq!(classification, expected);
    }
}