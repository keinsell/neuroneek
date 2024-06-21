// TODO: Get active ingestions along their progress
// TODO: Get analisis of side-effects and when they will likely occur

use std::collections::HashMap;
use std::str::FromStr;

use chrono::{Duration, Local, Utc};
use chrono_humanize::Humanize;
use futures::stream;
use futures::stream::StreamExt;
use indicatif::{ProgressBar, ProgressStyle};
use tabled::Table;

use db::sea_orm::*;
use db::sea_orm::DatabaseConnection;

use crate::core::dosage::Dosage;
use crate::core::ingestion::Ingestion;
use crate::core::phase::PhaseClassification;
use crate::service::ingestion::get_ingestion_by_id;

pub async fn handle_show_dashboard(database_connection: &DatabaseConnection) {
    // Fetch and map all ingestions from database
    let ingestion = db::ingestion::Entity::find()
        .all(database_connection)
        .await
        .unwrap();
    let ingestions_stream = stream::iter(ingestion.into_iter());
    let ingestions = futures::future::join_all(
        ingestions_stream
            .map(|ingestion| {
                let ingestion_id = ingestion.id;
                async move { get_ingestion_by_id(ingestion_id).await.unwrap() }
            })
            .collect::<Vec<_>>()
            .await,
    )
    .await;

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
                .filter(|ingestion| ingestion.ingested_at >= Utc::now() - Duration::days(7))
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
                .filter(|ingestion| ingestion.ingested_at >= Utc::now() - Duration::days(7))
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
    
    let table = Table::from_iter(
        rows.iter().cloned()
    );

    println!("{}", table.to_string());

    // Filter all ingestions to find those which are active (onset, comeup, peak, offset)
    let active_ingestions = ingestions
        .into_iter()
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
        .collect::<Vec<Ingestion>>();

    println!("Active ingestions: {:#?}", active_ingestions.len());

    // Iterate through active ingestions to print percentage of completion,
    // time left and other useful information such as ingestion id and substance name.
    active_ingestions.into_iter().for_each(|ingestion| {
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

        let progress = elapsed_duration.num_seconds() as f64 / total_duration.num_seconds() as f64 * 100.0;

        let pb = ProgressBar::new(100);
        pb.set_style(
            ProgressStyle::default_bar()
                .template("[{bar:.white/grey}] {msg}",).unwrap()
                );
        pb.set_position(progress as u64);
        pb.set_message(format!(
            "#{} {} ({} {:.0}) will come off {} (ingested {})",
            ingestion.id,
            ingestion.substance_name,
            ingestion.administration_route,
            ingestion.dosage,
            &remaining_duration.humanize(),
                        ingestion.ingested_at.humanize(),
        ));

        println!()

        // println!(
        //     "#{} {} ({:.0} mg) | Time left: {}",
        //     ingestion.id,
        //     ingestion.substance_name,
        //     ingestion.dosage,
        //     format_duration(remaining_duration.to_std().unwrap())
        // );
    });
}
