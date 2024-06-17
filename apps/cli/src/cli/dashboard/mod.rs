// TODO: Get active ingestions along their progress
// TODO: Get analisis of side-effects and when they will likely occur

use std::collections::HashMap;
use std::str::FromStr;

use chrono::{Duration, Local, Utc};
use futures::stream;
use futures::stream::StreamExt;
use humantime::format_duration;
use tabled::Table;

use db::sea_orm::*;
use db::sea_orm::DatabaseConnection;

use crate::core::dosage::Dosage;
use crate::core::ingestion::Ingestion;
use crate::core::phase::PhaseClassification;
use crate::service::ingestion::get_ingestion_by_id;

pub async fn handle_show_dashboard(database_connection: &DatabaseConnection) {
    // Fetch and map all ingestions from database
    let ingestion = db::ingestion::Entity::find().all(database_connection).await.unwrap();
    let ingestions_stream = stream::iter(ingestion.into_iter());
    let ingestions = futures::future::join_all(ingestions_stream
        .map(|ingestion| {
            let ingestion_id = ingestion.id;
            async move {
                get_ingestion_by_id(ingestion_id).await.unwrap()
            }
        }).collect::<Vec<_>>().await).await;

    // Group ingestion by substance name
    let ingestion_by_substance = ingestions.clone()
        .into_iter()
        .fold(HashMap::<String, Vec<Ingestion>>::new(), |mut acc, ingestion| {
            let substance_name = ingestion.substance_name.clone();
            let ingestion_entry = acc.entry(substance_name).or_insert(vec![]);
            ingestion_entry.push(ingestion);
            acc
        });

    // Calculate total dosage per substance for last 7 days
    let total_dosage_per_substance_for_last_7_days = ingestion_by_substance.clone()
        .into_iter()
        .map(|(substance_name, ingestions)| {
            let total_dosage: Dosage = ingestions
                .iter()
                .filter(|ingestion| ingestion.ingested_at >= Utc::now() - Duration::days(7))
                .map(|ingestion| ingestion.dosage)
                .collect::<Vec<Dosage>>()
                .into_iter()
                // Use custom summing implementation
                .fold(Dosage::from_str(
                    "0.0 mg"
                ).unwrap(), |acc, dosage| acc + dosage);

            (substance_name, total_dosage)
        })
        .collect::<HashMap<String, Dosage>>();
    
    let average_dosage_per_day_per_substance_for_last_7_days = ingestion_by_substance.clone()
        .into_iter()
        .map(|(substance_name, ingestions)| {
            let total_dosage: Dosage = ingestions
                .iter()
                .filter(|ingestion| ingestion.ingested_at >= Utc::now() - Duration::days(7))
                .map(|ingestion| ingestion.dosage)
                .collect::<Vec<Dosage>>()
                .into_iter()
                // Use custom summing implementation
                .fold(Dosage::from_str(
                    "0.0 mg"
                ).unwrap(), |acc, dosage| acc + dosage);

            let average_dosage = total_dosage / 7.0;
            (substance_name, average_dosage)
        })
        .collect::<HashMap<String, Dosage>>();

    println!("\n");
    println!("Substance Name, Total Dosage, Average Dosage per Day");

    let table = Table::from_iter(total_dosage_per_substance_for_last_7_days.into_iter()
        .map(|(substance_name, total_dosage)| {
            vec![
                substance_name.clone(),
                format!("{:.0}", total_dosage).to_string(),
                format!("{:.0}", average_dosage_per_day_per_substance_for_last_7_days.get(&substance_name).unwrap()).to_string(),
            ]
        })
        .collect::<Vec<_>>().iter().cloned());
    
    println!("{}", table.to_string());
    println!("\n");
    
    // Filter all ingestions to find those which are active (onset, comeup, peak, offset)
    let active_ingestions = ingestions
        .into_iter()
        .filter(|ingestion| {
            let ingestion_start = ingestion.phases.get(&PhaseClassification::Onset).unwrap().start_time;
            let ingestion_end = ingestion.phases.get(&PhaseClassification::Offset).unwrap().end_time;
            let daterange = ingestion_start..ingestion_end;
           daterange.contains( &Local::now() )
        })
        .collect::<Vec<Ingestion>>();

    println!("Active ingestions: {:#?}", active_ingestions.len());

    // Iterate through active ingestions to print procentage of completion,
    // time left and other useful information such as ingestion id and substance name.

    active_ingestions.into_iter().for_each(|ingestion| {
        let ingestion_start = ingestion.phases.get(&PhaseClassification::Onset).unwrap().start_time;
        let ingestion_end = ingestion.phases.get(&PhaseClassification::Offset).unwrap().end_time;
        let now = Local::now();
        let total_duration = ingestion_end - ingestion_start;
        let elapsed_duration = now - ingestion_start;
        let remaining_duration = total_duration - elapsed_duration;

        println!("#{} {} ({:.0}) | {}", ingestion.id, ingestion.substance_name, ingestion.dosage,  format_duration(remaining_duration.to_std().unwrap()));
    });

    // We need to create progress bar for each active ingestion and
    // put them all into easy-readable table allowing end-user to
    // quickly see how long each ingestion will last.

    // active_ingestions.into_iter().for_each(|ingestion| {
    //     let ingestion_start = ingestion.phases.get(&PhaseClassification::Onset).unwrap().start_time;
    //     let ingestion_end = ingestion.phases.get(&PhaseClassification::Offset).unwrap().end_time;
    //     let now = Local::now();
    //     let total_duration = (ingestion_end - ingestion_start).num_seconds() as u64;
    //     let elapsed_duration = (now - ingestion_start).num_seconds() as u64;
    //
    //     println!("{}:", ingestion.substance_name);
    //     let pb = ProgressBar::new(total_duration).with_prefix(Cow::from(format!("{}:", ingestion.substance_name)));
    //     pb.set_style(ProgressStyle::default_bar());
    //     pb.set_position(elapsed_duration);
    //
    //     pb.finish_and_clear();
    // });
}