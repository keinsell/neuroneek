use sea_orm::DatabaseConnection;
use structopt::StructOpt;
use crate::cli::ingestion::create_ingestion::CreateIngestionFeature;
use crate::ingestion::{create_ingestion, CreateIngestion};
use crate::ingestion_analyzer::analyze_future_ingestion;
use crate::service::roa::{RouteOfAdministrationClassification, string_to_route_of_administration_classification};

#[derive(StructOpt, Debug)]
pub struct PlanIngestionCommand {
    #[structopt(short, long)]
    pub substance_name: String,
    #[structopt(short, long)]
    pub dosage: String,
    #[structopt(short = "t", long = "time", default_value = "now")]
    pub ingested_at: String,
    #[structopt(short = "r", long = "route-of-administration", default_value = "Oral", possible_values = &["Oral", "Injection", "Insufflated"])]
    pub route_of_administration: String,
}

pub async fn handle_plan_ingestion(plan_ingestion_command: PlanIngestionCommand) {
    let roa_class: RouteOfAdministrationClassification =
        string_to_route_of_administration_classification(
            plan_ingestion_command.route_of_administration.as_str(),
        );

    let create_ingestion_payload = CreateIngestion {
        substance_name: plan_ingestion_command.substance_name,
        dosage: plan_ingestion_command.dosage,
        ingested_at: plan_ingestion_command.ingested_at,
        route_of_administration: roa_class,
    };
    
    analyze_future_ingestion(&create_ingestion_payload).await;
}