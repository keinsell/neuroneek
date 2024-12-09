use crate::database::ingestion::Entity as Ingestion;
use crate::database::{self};
use crate::ingestion::ViewModel;
use crate::lib::CommandHandler;
use crate::route_of_administration::RouteOfAdministrationClassification;
use anyhow::Context;
use anyhow::Result;
use async_trait::async_trait;
use chrono::DateTime;
use chrono::Local;
use chrono_english::Dialect;
use chrono_english::parse_date_string;
use clap::Error;
use clap::Parser;
use sea_orm::ActiveValue;
use sea_orm::DatabaseConnection;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;
use smol::block_on;
use std::fmt::Display;
use thiserror::Error;
use tracing::Level;
use tracing::event;
use tracing::info;
use tracing_attributes::instrument;

#[derive(Parser, Debug)]
#[command(version, about = "Store information about new ingestion", long_about)]
pub struct LogIngestion
{
    /// Name of the substance ingested.
    #[arg(short = 's', long)]
    pub substance_name: String,
    /// Unit in which the substance is ingested (default is "mg").
    #[arg(short = 'u', long, default_value_t=String::from("mg"))]
    pub dosage_unit: String,
    /// Volume of substance ingested.
    #[arg(short = 'v', long)]
    pub dosage_amount: f64,
    /// Date of ingestion, by default current date is used if not provided.
    ///
    /// Date can be provided as timestamp and in human-readable format such as
    /// "today 10:00", "yesterday 13:00", "monday 15:34" which will be later
    /// parsed into proper timestamp.
    #[arg(
        short='t',
        long,
        value_parser = parse_human_date,
        default_value_t=Local::now(),
        default_value="now",
    )]
    pub ingestion_date: DateTime<Local>,
    #[arg(short = 'r', long, default_value_t, value_enum)]
    pub route_of_administration: RouteOfAdministrationClassification,
}

fn parse_human_date(date_str: &str) -> Result<DateTime<Local>, Error>
{
    parse_date_string(date_str, Local::now(), Dialect::Uk)
        .map(|dt| dt.with_timezone(&Local))
        .map_err(|e| {
            Error::raw(
                clap::error::ErrorKind::InvalidValue,
                format!("Invalid date format: {}", e),
            )
        })
}

#[derive(Error, Debug)]
pub enum LogIngestionError
{
    #[error("Database error: {0}")]
    DatabaseError(#[from] sea_orm::DbErr),
}

#[async_trait]
impl CommandHandler for LogIngestion
{
    #[instrument(name = "log_ingestion", level = Level::INFO)]
    async fn handle(&self, database_connection: &DatabaseConnection) -> Result<(), String>
    {
        let ingestion = block_on(async {
            database::ingestion::Entity::insert(database::ingestion::ActiveModel {
                id: ActiveValue::default(),
                substance_name: ActiveValue::Set(self.substance_name.to_lowercase()),
                route_of_administration: ActiveValue::Set(self.route_of_administration.serialize()),
                dosage: ActiveValue::Set(self.dosage_amount as f32),
                dosage_unit: ActiveValue::Set(self.dosage_unit.to_lowercase()),
                notes: ActiveValue::NotSet,
                ingested_at: ActiveValue::Set(self.ingestion_date.to_utc()),
                updated_at: ActiveValue::Set(Local::now().to_utc()),
                created_at: ActiveValue::Set(Local::now().to_utc()),
            })
            .exec_with_returning(database_connection)
            .await
            .context("Failed to insert ingestion record")
            .map_err(|e| e.to_string())
        })?;

        event!(Level::INFO, "Ingestion Logged {:?}", &ingestion);
        info!("Ingestion successfully logged. {:?}", ingestion);

        println!("Ingestion Logged {:?}", &ingestion);

        Ok(())
    }
}

#[cfg(test)]
mod test
{
    use super::*;
    use assert_cmd::Command;
    use chrono::Local;

    #[test]
    fn should_parse_human_readable_dates()
    {
        let test_cases = vec![
            ("now", true),
            ("today 15:30", true),
            ("yesterday 13:00", true),
            ("tomorrow 10:00", true),
            ("invalid date", false),
        ];

        for (input, should_succeed) in test_cases
        {
            let result = parse_human_date(input);
            assert_eq!(
                result.is_ok(),
                should_succeed,
                "Testing date string: {}",
                input
            );

            if should_succeed
            {
                let parsed_date = result.unwrap();
                assert!(parsed_date.timestamp() > 0, "Parsed date should be valid");
            }
        }
    }

    #[test]
    fn should_log_ingestion() -> Result<(), Box<dyn std::error::Error>>
    {
        let mut cmd = Command::cargo_bin("neuronek-cli")?;

        let substance_name = "Aspirin";
        let ingestion_date = Local::now().to_string();

        cmd.arg("log")
            .arg("-s")
            .arg(substance_name)
            .arg("-v")
            .arg("500")
            .arg("-u")
            .arg("mg")
            .arg("-t")
            .arg(&ingestion_date);

        // Simulate `neuronek` command and ensure it succeeds
        cmd.assert()
            .success()
            .to_string()
            .contains("Ingestion Logged");

        Ok(())
    }
}
