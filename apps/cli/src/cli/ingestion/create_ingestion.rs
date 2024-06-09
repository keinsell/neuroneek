use std::str::FromStr;

use sea_orm::DatabaseConnection;
use structopt::StructOpt;

use crate::core::route_of_administration::RouteOfAdministrationClassification;
use crate::ingestion::{create_ingestion, CreateIngestion};
use crate::ingestion_analyzer::analyze_future_ingestion;

#[derive(StructOpt, Debug)]
pub(crate) struct CreateIngestionFeature {
    #[structopt(short, long)]
    pub substance_name: String,
    #[structopt(short = "d", long = "dosage")]
    pub dosage: String,
    #[structopt(short = "t", long = "time", default_value = "now")]
    pub ingested_at: String,
    #[structopt(short = "r", long = "route-of-administration", default_value = "oral", possible_values = &["oral", "injection", "insufflated"])]
    pub route_of_administration: String,
    #[structopt(
        short,
        long = "plan",
        about = "Ingestion will be not stored, yet analyzed."
    )]
    pub plan: bool,
}

// Input -> Valid internal structure -> database -> Presentation structure

pub async fn handle_create_ingestion(
    create_ingestion_command: CreateIngestionFeature,
    db: &DatabaseConnection,
) {
    let roa_class: RouteOfAdministrationClassification =
        RouteOfAdministrationClassification::from_str(
            create_ingestion_command.route_of_administration.as_str(),
        )
        .unwrap();

    let create_ingestion_payload = CreateIngestion {
        substance_name: create_ingestion_command.substance_name,
        dosage: create_ingestion_command.dosage,
        ingested_at: create_ingestion_command.ingested_at,
        route_of_administration: roa_class,
    };

    if create_ingestion_command.plan {
        analyze_future_ingestion(&create_ingestion_payload)
            .await
            .unwrap_or_else(|e| println!("Error: {}", e));
        return;
    }

    create_ingestion(db, create_ingestion_payload).await;
}
