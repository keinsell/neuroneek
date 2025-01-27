use crate::analyzer::model::IngestionAnalysis;
use crate::analyzer::model::IngestionPhase;
use crate::ingestion::model::Ingestion;
use crate::ingestion::model::IngestionDate;
use crate::substance::route_of_administration::dosage;
use crate::substance::route_of_administration::phase::PHASE_ORDER;
use crate::substance::Substance;
use chrono::TimeDelta;
use miette::miette;
use std::ops::Add;
use sea_orm::DatabaseConnection;
use sea_orm::ActiveValue;
use crate::database::entities::ingestion_phase;
use sea_orm::EntityTrait;
use sea_orm::ActiveModelTrait;
use chrono::Local;
use futures::future::ok;
use crate::utils::DATABASE_CONNECTION;

impl IngestionAnalysis
{
    pub async fn analyze(ingestion: Ingestion, substance: Substance) -> miette::Result<Self>
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

        let dosage_classification = dosage::classify_dosage(ingestion.dosage.clone(), &roa.dosages);

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
