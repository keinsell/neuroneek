use chrono::{DateTime, Local};
use crate::lib::CommandHandler;
use clap::Parser;
use sea_orm::DatabaseConnection;
use crate::route_of_administration::RouteOfAdministrationClassification;

#[derive(Parser, Debug)]
#[command(version, about = "Update ingestion", long_about)]
pub struct UpdateIngestion {
    ///.Identifier of the ingestion to update
    #[clap(short, long="id")]
    pub ingestion_id: String,
    /// Name of the substance ingested.
    #[arg(short = 's', long)]
    pub substance_name: Option<String>,
    /// Unit in which the substance is ingested (default is "mg").
    #[arg(short = 'u', long)]
    pub dosage_unit: Option<String>,
    /// Volume of substance ingested.
    #[arg(short = 'v', long)]
    pub dosage_amount: Option<u64>,
    /// Date of ingestion, by default current date is used if not provided.
    ///
    /// Date can be provided as timestamp and in human-readable format such as
    /// "today 10:00", "yesterday 13:00", "monday 15:34" which will be later
    /// parsed into proper timestamp.
    #[arg(
        short='t',
        long,
    )]
    pub ingestion_date: Option<DateTime<Local>>,
    #[arg(short = 'r', long = "roa")]
    pub route_of_administration: RouteOfAdministrationClassification,
}

impl CommandHandler for UpdateIngestion
{
    fn handle(&self, database_connection: &DatabaseConnection) -> Result<(), String> { todo!() }
}
