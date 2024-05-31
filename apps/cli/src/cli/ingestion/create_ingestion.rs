use sea_orm::DatabaseConnection;
use structopt::StructOpt;
use crate::ingestion::{
    create_ingestion, CreateIngestion,
};
use crate::service::roa::{RouteOfAdministrationClassification, string_to_route_of_administration_classification};

#[derive(StructOpt, Debug)]
pub(crate) struct CreateIngestionFeature {
    #[structopt(short, long)]
    pub substance_name: String,
    #[structopt(short, long)]
    pub dosage: String,
    #[structopt(short = "t", long = "time", default_value = "now")]
    pub ingested_at: String,
    #[structopt(short = "r", long = "route-of-administration", default_value = "Oral", possible_values = &["Oral", "Injection", "Insufflated"])]
    pub route_of_administration: String,
}

pub async fn handle_create_ingestion(
    create_ingestion_command: CreateIngestionFeature,
    db: &DatabaseConnection,
) {
    let roa_class: RouteOfAdministrationClassification =
        string_to_route_of_administration_classification(
            create_ingestion_command.route_of_administration.as_str(),
        );

    let create_ingestion_payload = CreateIngestion {
        substance_name: create_ingestion_command.substance_name,
        dosage: create_ingestion_command.dosage,
        ingested_at: create_ingestion_command.ingested_at,
        route_of_administration: roa_class,
    };

    create_ingestion(db, create_ingestion_payload).await;
}
