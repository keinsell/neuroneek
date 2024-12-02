// TODO: Get active ingestions along their progress
// TODO: Get analisis of side-effects and when they will likely occur

use std::collections::HashMap;
use std::str::FromStr;
use std::sync::{Arc, Mutex};

use chrono::{Duration, Local, Utc};
use chrono_humanize::Humanize;
use indicatif::{ProgressBar, ProgressStyle};
use rayon::prelude::*;
use tabled::Table;
use tokio::task::spawn_blocking;

use db::sea_orm::DatabaseConnection;
use db::sea_orm::*;

use crate::core::dosage::Dosage;
use crate::core::ingestion::Ingestion;
use crate::core::ingestion_analysis::IngestionAnalysis;
use crate::core::phase::PhaseClassification;
use crate::ingestion_analyzer::{analyze_ingestion, analyze_ingestion_from_ingestion};

pub async fn handle_show_dashboard(database_connection: &DatabaseConnection) {
    // TODO: Add filter to command that will allow to customize window for statistics
    let ingestions: Vec<Ingestion> = db::ingestion::Entity::find()
        .all(database_connection)
        .await
        .unwrap()
        .iter()
        .map(Ingestion::from)
        .collect();
    let statistic_window_interval = Duration::days(7);

    // For each ingestion we need to use ingestion analyzer and store these
    // results in a hashmap with the ingestion id as key, this is to calculate
    // all data needed once and then reuse it for the dashboard.
    let ingestion_analysis_map: Arc<Mutex<HashMap<i32, IngestionAnalysis>>> =
        Arc::new(Mutex::new(HashMap::new()));

    let analysis_results: Vec<_> = ingestions
        .par_iter()
        .map_init(
            || tokio::runtime::Runtime::new().unwrap(),
            |rt, ingestion| {
                let ingestion_analysis_map = Arc::clone(&ingestion_analysis_map);
                rt.block_on(async move {
                    let ingestion_analysis = analyze_ingestion(
                        analyze_ingestion_from_ingestion(ingestion.clone())
                            .await
                            .unwrap(),
                    )
                    .await
                    .unwrap();
                    let mut map = ingestion_analysis_map.lock().unwrap();
                    map.insert(ingestion.id, ingestion_analysis);
                    Ok::<_, anyhow::Error>(())
                })
            },
        )
        .collect();

    spawn_blocking(move || {
        analysis_results
            .into_iter()
            .collect::<Result<Vec<_>, _>>()
            .unwrap();
    })
    .await
    .unwrap();

    let ingestion_analysis_map = Arc::try_unwrap(ingestion_analysis_map).unwrap();
    let ingestion_analysis_map = ingestion_analysis_map.into_inner().unwrap();

    // Group ingestion by substance name
    let ingestion_by_substance = ingestions.clone().into_iter().fold(
        HashMap::<String, Vec<Ingestion>>::new(),
        |mut acc, ingestion| {
            let substance_name = ingestion.substance_name.clone();
            let ingestion_entry = acc.entry(substance_name).or_insert(vec![]);
            ingestion_entry.push(ingestion);
            acc
        },
    );

    // Calculate total dosage per substance for last 7 days
    let total_dosage_per_substance_for_last_7_days = ingestion_by_substance
        .clone()
        .into_iter()
        .map(|(substance_name, ingestions)| {
            let total_dosage: Dosage = ingestions
                .iter()
                .filter(|ingestion| ingestion.ingested_at >= Utc::now() - statistic_window_interval)
                .map(|ingestion| ingestion.dosage)
                .collect::<Vec<Dosage>>()
                .into_iter()
                // Use custom summing implementation
                .fold(Dosage::from_str("0.0 mg").unwrap(), |acc, dosage| {
                    acc + dosage
                });

            (substance_name, total_dosage)
        })
        .collect::<HashMap<String, Dosage>>();

    let average_dosage_per_day_per_substance_for_last_7_days = ingestion_by_substance
        .clone()
        .into_iter()
        .map(|(substance_name, ingestions)| {
            let total_dosage: Dosage = ingestions
                .iter()
                .filter(|ingestion| ingestion.ingested_at >= Utc::now() - statistic_window_interval)
                .map(|ingestion| ingestion.dosage)
                .collect::<Vec<Dosage>>()
                .into_iter()
                // Use custom summing implementation
                .fold(Dosage::from_str("0.0 mg").unwrap(), |acc, dosage| {
                    acc + dosage
                });

            let average_dosage = total_dosage / 7.0;
            (substance_name, average_dosage)
        })
        .collect::<HashMap<String, Dosage>>();

    let headers = vec![
        "Substance Name".to_string(),
        "Total Dosage".to_string(),
        "Average Dosage per Day".to_string(),
    ];

    let data_rows: Vec<Vec<String>> = total_dosage_per_substance_for_last_7_days
        .into_iter()
        .map(|(substance_name, total_dosage)| {
            vec![
                substance_name.clone(),
                format!("{:.0}", total_dosage).to_string(),
                format!(
                    "{:.0}",
                    average_dosage_per_day_per_substance_for_last_7_days
                        .get(&substance_name)
                        .unwrap()
                )
                .to_string(),
            ]
        })
        .collect();

    // Combine headers and data rows
    let mut rows = vec![headers];
    rows.extend(data_rows);

    let table = Table::from_iter(rows.iter().cloned());

    println!("{}", table.to_string());

    // Filter all ingestions to find those which are active (onset, comeup, peak, offset)
    let active_ingestion_analysis = ingestion_analysis_map
        .into_values()
        .filter(|ingestion| {
            let ingestion_start = ingestion
                .phases
                .get(&PhaseClassification::Onset)
                .unwrap()
                .start_time;
            let ingestion_end = ingestion
                .phases
                .get(&PhaseClassification::Offset)
                .unwrap()
                .end_time;
            let daterange = ingestion_start..ingestion_end;
            daterange.contains(&Local::now())
        })
        .collect::<Vec<_>>();

    println!("Active ingestion's: {:#?}", active_ingestion_analysis.len());

    // Render active ingestion with progress bars and core information about ingestions
    active_ingestion_analysis
        .into_iter()
        .for_each(render_active_ingestion_from_ingestion_analysis);
}

fn render_active_ingestion_from_ingestion_analysis(ingestion: IngestionAnalysis) {
    let ingestion_start = ingestion
        .phases
        .get(&PhaseClassification::Onset)
        .unwrap()
        .start_time;
    let ingestion_end = ingestion
        .phases
        .get(&PhaseClassification::Offset)
        .unwrap()
        .end_time;
    let now = Local::now();
    let total_duration = ingestion_end - ingestion_start;
    let elapsed_duration = now - ingestion_start;
    let remaining_duration = total_duration - elapsed_duration;
    let progress =
        elapsed_duration.num_seconds() as f64 / total_duration.num_seconds() as f64 * 100.0;
    let pb = ProgressBar::new(100);

    pb.set_style(
        ProgressStyle::default_bar()
            .template("[{bar:.white/grey}] {msg}")
            .unwrap(),
    );
    pb.set_position(progress as u64);
    pb.set_message(format!(
        "#{} {} ({} {:.0}) will come off {} (ingested {})",
        ingestion.id,
        ingestion.substance_name,
        ingestion.route_of_administration_classification,
        ingestion.dosage,
        &remaining_duration.humanize(),
        ingestion.ingested_at.humanize(),
    ));

    pb.abandon()
}
