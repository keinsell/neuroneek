// Ingestion Intelligence is a tool that helps to calculate all of the metrics
// related to an ingestions in a cache-able format to be later used for ingestion
// analysis. This is a ciritial tool for Neuronek project.

use crate::core::dosage::Dosage;
use crate::orm::DB_CONNECTION;
use chrono::Utc;
use db::*;
use std::str::FromStr;

pub(super) async fn get_total_dosage_of_substance(
    substance_name: String,
    date_range: Option<(chrono::DateTime<Utc>, chrono::DateTime<Utc>)>,
) -> Result<Dosage, Box<dyn std::error::Error>> {
    // Fetch all ingestions of substance
    let mut database_ingestions = db::ingestion::Entity::find()
        .filter(db::ingestion::Column::SubstanceName.contains(substance_name))
        .all(&DB_CONNECTION as &DatabaseConnection)
        .await?;

    // If a date range is provided, filter the ingestions to include only those that fall within the date range.
    if let Some((start_date, end_date)) = date_range {
        database_ingestions = database_ingestions
            .into_iter()
            .filter(|ingestion| {
                let ingestion_date: chrono::DateTime<Utc> =
                    ingestion.ingestion_date.unwrap().and_utc();
                let dr: (chrono::DateTime<Utc>, chrono::DateTime<Utc>) = (start_date, end_date);

                // If the ingestion date is within the date range, include it in the filtered list.
                let is_within_date_range = dr.0.le(&ingestion_date) && dr.1.ge(&ingestion_date);
                is_within_date_range
            })
            .collect();
    }

    // Calculate the total dosage by summing up the dosage of each ingestion.
    let total_dosage = database_ingestions
        .iter()
        .map(|ingestion| {
            let cloned_ingestion = ingestion.clone();
            return Dosage::from_str(
                format!(
                    "{} {}",
                    cloned_ingestion.dosage_amount.unwrap(),
                    cloned_ingestion.dosage_unit.unwrap(),
                )
                .as_str(),
            )
            .unwrap()
            .to_owned();
        })
        .fold(Dosage::from_str("0.0 mg").unwrap(), |acc, dosage| {
            acc + dosage
        });

    Ok(total_dosage)
}

pub(crate) async fn get_average_dosage_of_substance(
    substance_name: String,
    date_range: Option<(chrono::DateTime<Utc>, chrono::DateTime<Utc>)>,
) -> Result<Dosage, Box<dyn std::error::Error>> {
    // Fetch all ingestions of substance
    let mut database_ingestions = db::ingestion::Entity::find()
        .filter(db::ingestion::Column::SubstanceName.contains(substance_name))
        .all(&DB_CONNECTION as &DatabaseConnection)
        .await?;

    // If a date range is provided, filter the ingestions to include only those that fall within the date range.
    if let Some((start_date, end_date)) = date_range {
        database_ingestions = database_ingestions
            .into_iter()
            .filter(|ingestion| {
                let ingestion_date: chrono::DateTime<Utc> =
                    ingestion.ingestion_date.unwrap().and_utc();
                let dr: (chrono::DateTime<Utc>, chrono::DateTime<Utc>) = (start_date, end_date);

                // If the ingestion date is within the date range, include it in the filtered list.
                let is_within_date_range = dr.0.le(&ingestion_date) && dr.1.ge(&ingestion_date);
                is_within_date_range
            })
            .collect();
    }

    // Calculate the average dosage by summing up the dosage of each ingestion.
    let average_dosage = database_ingestions
        .iter()
        .map(|ingestion| {
            let cloned_ingestion = ingestion.clone();
            return Dosage::from_str(
                format!(
                    "{} {}",
                    cloned_ingestion.dosage_amount.unwrap(),
                    cloned_ingestion.dosage_unit.unwrap(),
                )
                .as_str(),
            )
            .unwrap()
            .to_owned();
        })
        .fold(Dosage::from_str("0.0 mg").unwrap(), |acc, dosage| {
            acc + dosage
        });

    Ok(average_dosage)
}

pub(crate) async fn get_average_daily_dosage_of_substance(
    substance_name: String,
    date_range: Option<(chrono::DateTime<Utc>, chrono::DateTime<Utc>)>,
) -> Result<Dosage, Box<dyn std::error::Error>> {
    // Fetch all ingestions of substance
    let mut database_ingestions = db::ingestion::Entity::find()
        .filter(db::ingestion::Column::SubstanceName.contains(substance_name))
        .all(&DB_CONNECTION as &DatabaseConnection)
        .await?;

    // If a date range is provided, filter the ingestions to include only those that fall within the date range.
    if let Some((start_date, end_date)) = date_range {
        database_ingestions = database_ingestions
            .into_iter()
            .filter(|ingestion| {
                let ingestion_date: chrono::DateTime<Utc> =
                    ingestion.ingestion_date.unwrap().and_utc();
                let dr: (chrono::DateTime<Utc>, chrono::DateTime<Utc>) = (start_date, end_date);

                // If the ingestion date is within the date range, include it in the filtered list.
                let is_within_date_range = dr.0.le(&ingestion_date) && dr.1.ge(&ingestion_date);
                is_within_date_range
            })
            .collect();
    }

    // Calculate the average dosage by summing up the dosage of each ingestion.
    let average_daily_dosage = database_ingestions
        .iter()
        .map(|ingestion| {
            let cloned_ingestion = ingestion.clone();
            return Dosage::from_str(
                format!(
                    "{} {}",
                    cloned_ingestion.dosage_amount.unwrap(),
                    cloned_ingestion.dosage_unit.unwrap(),
                )
                .as_str(),
            )
            .unwrap()
            .to_owned();
        })
        .fold(Dosage::from_str("0.0 mg").unwrap(), |acc, dosage| {
            acc + dosage
        });

    Ok(average_daily_dosage)
}
