use structopt::StructOpt;

use db::sea_orm::{DatabaseConnection, EntityTrait};

#[derive(StructOpt, Debug)]
pub struct DeleteIngestion {
    #[structopt(short, long)]
    pub ingestion_id: i32,
}

pub async fn delete_ingestion(db: &DatabaseConnection, ingestion_id: i32) {
    let res = db::ingestion::Entity::delete_by_id(ingestion_id).exec(db).await;
    let delete_response = res.expect("Error deleting ingestion");

    assert_eq!(delete_response.rows_affected, 1);
    println!("Ingestion with ID {} deleted.", &ingestion_id);
}
