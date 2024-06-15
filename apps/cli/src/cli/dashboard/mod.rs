// TODO: Get active ingestions along their progress
// TODO: Get analisis of side-effects and when they will likely occur

use itertools::Itertools;

use db::sea_orm::*;
use db::sea_orm::DatabaseConnection;

pub async fn handle_show_dashboard(database_connection: &DatabaseConnection) {
    println!("Dashboard is not implemented yet.");

    // Show average dosage per day of each substance that was ingested
    let ingestions =   db::ingestion::Entity::find().all(database_connection).await.unwrap();

    // Group ingestions by substance name
    let ingestions_by_substance = ingestions
        .into_iter()
        .chunk_by(|ingestion| ingestion.substance_name.as_ref().unwrap().clone()).into_iter();

    println!("Ingestions by substance:");
}