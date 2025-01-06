use crate::lib::ingestion::IngestionDate;
use crate::lib::substance::DosageClassification;
use crate::lib::substance::Dosages;
use chrono::TimeDelta;
use chrono_humanize::HumanTime;
use miette::miette;
use serde::Serialize;
use std::fmt;
use std::ops::Add;
use std::ops::Range;

/// `IngestionAnalysis` is a struct that represents the analysis of an ingestion
/// event. It contains various fields to store information about the ingestion,
/// the substance ingested, the dosage classification, the current phase of the
/// ingestion, the start and end times of the ingestion, the phases of the
/// ingestion, the total duration excluding the afterglow phase, and the
/// progress of the ingestion.
#[derive(Debug, Serialize)]
pub struct IngestionAnalysis
{
    /// The ingestion event associated with this analysis.
    /// This field is wrapped in an `Option` and a `Box` to allow for optional
    /// ownership.
    #[serde(skip_serializing)]
    ingestion: Option<Box<crate::lib::ingestion::Ingestion>>,

    /// The substance ingested in this event.
    /// This field is wrapped in an `Option` and a `Box` to allow for optional
    /// ownership.
    #[serde(skip_serializing)]
    substance: Option<Box<crate::lib::substance::Substance>>,

    /// The classification of the dosage for this ingestion.
    /// This field is an `Option` to allow for cases where the dosage
    /// classification cannot be determined.
    dosage: Option<DosageClassification>,

    /// The current phase of the ingestion, if it can be determined.
    /// This field is an `Option` to allow for cases where the current phase
    /// cannot be determined.
    pub(crate) current_phase: Option<crate::lib::substance::PhaseClassification>,

    /// The start time of the ingestion event (copy of ingestion.ingestion_date)
    ingestion_start: IngestionDate,

    /// The end time of the ingestion event.
    /// Ingestion end time is a range of ingestion start time and duration of
    /// all phases (excluding afterglow).
    ingestion_end: IngestionDate,

    /// A vector of `IngestionPhase` structs representing the different phases
    /// of the ingestion event.
    pub(crate) phases: Vec<IngestionPhase>,

    /// The progress of the ingestion event, represented as a float between 0.0
    /// and 1.0. This value represents the fraction of the total duration
    /// (excluding the afterglow phase) that has elapsed.
    pub(crate) progress: f64,
}


#[derive(Debug, Clone, Serialize)]
pub struct IngestionPhase
{
    pub(crate) class: crate::lib::substance::PhaseClassification,
    pub(crate) duration_range: Range<IngestionDate>,
    pub(crate) prev: Option<Box<IngestionPhase>>,
    pub(crate) next: Option<Box<IngestionPhase>>,
}

pub fn progress_bar(progress: f64, width: usize) -> String
{
    let filled_length = (progress * width as f64).round() as usize;
    let empty_length = width - filled_length;
    let filled_bar = "█".repeat(filled_length);
    let empty_bar = "░".repeat(empty_length);
    format!("[{}{}]", filled_bar, empty_bar)
}

impl IngestionAnalysis
{
    pub async fn analyze(
        ingestion: crate::lib::ingestion::Ingestion,
        substance: crate::lib::substance::Substance,
    ) -> miette::Result<Self>
    {
        let roa = substance
            .routes_of_administration
            .get(&ingestion.route)
            .ok_or_else(|| miette!("Failed to find route of administration for substance"))?
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
                let duration_range = &phase;
                let end_time_range = start_time_range
                    .add(TimeDelta::from_std(duration_range.start.to_std().unwrap()).unwrap());

                total_start_time = total_start_time
                    .map_or(Some(start_time_range), |s| Some(s.min(start_time_range)));
                total_end_time =
                    total_end_time.map_or(Some(end_time_range), |e| Some(e.max(end_time_range)));

                // Update total_end_time_excl_afterglow
                if phase_type != crate::lib::substance::PhaseClassification::Afterglow
                {
                    total_end_time_excl_afterglow = total_end_time_excl_afterglow
                        .map_or(Some(end_time_range), |e| Some(e.max(end_time_range)));
                }

                let new_phase = IngestionPhase {
                    class: phase_type,
                    duration_range: start_time_range..end_time_range,
                    prev: prev_phase.as_ref().map(|p| Box::new(p.clone())),
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

        let total_range_excl_afterglow = total_start_time
            .zip(total_end_time_excl_afterglow)
            .map(|(start, end)| start..end)
            .ok_or_else(|| miette!("Could not compute total duration excluding afterglow"))?;

        let current_date = chrono::Local::now();
        let current_phase = phases
            .iter()
            .find(|phase| {
                current_date >= phase.duration_range.start
                    && current_date < phase.duration_range.end
            })
            .map(|phase| phase.class);

        let roa_dosages = roa.dosages;
        let dosage_classification = classify_dosage(ingestion.dosage.clone(), &roa_dosages)?;

        // Calculate progress
        let now = chrono::Local::now();
        let total_duration = total_range_excl_afterglow.end - total_range_excl_afterglow.start;
        let elapsed_time = if now < total_range_excl_afterglow.start
        {
            chrono::Duration::zero()
        }
        else
        {
            (now - total_range_excl_afterglow.start).min(total_duration)
        };

        let progress = elapsed_time.num_seconds() as f64 / total_duration.num_seconds() as f64;

        let progress = progress.clamp(0.0, 1.0);

        Ok(Self {
            ingestion: Some(Box::new(ingestion)),
            substance: Some(Box::new(substance)),
            dosage: Some(dosage_classification),
            current_phase,
            ingestion_start: total_range.start,
            ingestion_end: total_range.end,
            phases,
            progress,
        })
    }
}

use crate::lib::substance::route_of_administration::phase::PHASE_ORDER;
use chrono::Utc;
use owo_colors::OwoColorize;

impl fmt::Display for IngestionAnalysis
{
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result
    {
        let now = Utc::now();
        let substance_name = self
            .substance
            .as_ref()
            .map(|s| s.name.as_str())
            .unwrap_or("");
        let dosage = self
            .ingestion
            .as_ref()
            .map(|i| i.dosage.to_string())
            .unwrap_or_default();

        writeln!(
            f,
            "{} {} {}",
            "Ingestion Analysis:".bold(),
            substance_name.cyan(),
            dosage.yellow()
        )?;
        writeln!(f)?;

        let progress_bar = progress_bar(self.progress, 30);
        let progress_percentage = format!("{:.2}%", self.progress * 100.0);
        writeln!(
            f,
            "Progress: {} {}",
            progress_bar,
            progress_percentage.bold()
        )?;
        writeln!(f)?;

        let ingestion_symbol = if self.ingestion_start <= now && now < self.ingestion_end
        {
            "●".blue().to_string()
        }
        else
        {
            "○".dimmed().to_string()
        };

        let ingestion_time_info = format!("Ingested: {}", HumanTime::from(self.ingestion_start));
        writeln!(f, "{} {}", ingestion_symbol, ingestion_time_info)?;

        for phase in &self.phases
        {
            let is_passed = phase.duration_range.end < now;
            let is_current = phase.duration_range.start <= now && now < phase.duration_range.end;

            let symbol = if is_passed
            {
                "✓".green().to_string()
            }
            else if is_current
            {
                "●".yellow().to_string()
            }
            else
            {
                "○".dimmed().to_string()
            };

            let phase_name = if is_passed
            {
                phase.class.to_string().green().to_string()
            }
            else if is_current
            {
                phase.class.to_string().yellow().bold().to_string()
            }
            else
            {
                phase.class.to_string().dimmed().to_string()
            };

            let time_info = if is_passed
            {
                format!("completed {}", HumanTime::from(phase.duration_range.end))
                    .green()
                    .to_string()
            }
            else if is_current
            {
                format!("started {}", HumanTime::from(phase.duration_range.start))
                    .yellow()
                    .to_string()
            }
            else
            {
                format!("starts {}", HumanTime::from(phase.duration_range.start))
                    .dimmed()
                    .to_string()
            };

            writeln!(f, "{} {} {}", symbol, phase_name, time_info)?;
        }

        if let Some(phase_classification) = self.current_phase
        {
            writeln!(f)?;
            writeln!(
                f,
                "Current Phase: {}",
                phase_classification.to_string().yellow().bold()
            )?;
        }

        if let Some(dosage_class) = &self.dosage
        {
            writeln!(
                f,
                "Dosage Classification: {}",
                dosage_class.to_string().cyan()
            )?;
        }

        Ok(())
    }
}

pub fn classify_dosage(
    dosage: crate::lib::dosage::Dosage,
    roa_dosages: &Dosages,
) -> Result<DosageClassification, miette::Report>
{
    for (classification, range) in roa_dosages
    {
        if range.contains(&dosage)
        {
            return Ok(*classification);
        }
    }

    // If no range contains the dosage, find the closest classification
    let mut closest_classification = None;

    for (classification, range) in roa_dosages
    {
        if let Some(end) = &range.end
        {
            if &dosage <= end
            {
                closest_classification = Some(DosageClassification::Threshold);
                break;
            }
        }

        if let Some(start) = &range.start
        {
            if &dosage >= start
            {
                closest_classification = Some(DosageClassification::Heavy);
            }
        }
    }

    closest_classification
        .ok_or_else(|| miette!("No dosage classification found for value: {}", dosage))
}

#[cfg(test)]
mod tests
{
    use super::*;
    use crate::lib::DATABASE_CONNECTION;
    use crate::lib::dosage::Dosage;
    use crate::lib::migrate_database;

    use rstest::rstest;
    use std::str::FromStr;

    #[rstest]
    #[case("10mg", DosageClassification::Threshold)]
    #[case("100mg", DosageClassification::Medium)]
    #[case("1000mg", DosageClassification::Heavy)]
    async fn should_classify_dosage(
        #[case] dosage_str: &str,
        #[case] expected: DosageClassification,
    )
    {
        let db = &DATABASE_CONNECTION;
        migrate_database(db).await.unwrap();
        let caffeine = crate::lib::substance::repository::get_substance_by_name("caffeine", db)
            .await
            .unwrap();
        let oral_caffeine_roa = caffeine
            .routes_of_administration
            .get(&crate::lib::route_of_administration::RouteOfAdministrationClassification::Oral)
            .unwrap()
            .clone()
            .dosages;

        let dosage_instance = Dosage::from_str(dosage_str).unwrap();
        let classification = classify_dosage(dosage_instance, &oral_caffeine_roa).unwrap();

        assert_eq!(classification, expected);
    }
}
