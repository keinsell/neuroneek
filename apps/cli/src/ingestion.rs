use db::sea_orm::{DatabaseConnection, EntityTrait};

use crate::core::ingestion::Ingestion;
use crate::orm::DB_CONNECTION;

pub(super) async fn list_ingestions() -> Result<Vec<Ingestion>, anyhow::Error> {
    let ingestions = db::ingestion::Entity::find()
        .all(&DB_CONNECTION as &DatabaseConnection)
        .await?;

    let result: Vec<Ingestion> = ingestions.into_iter().map(Ingestion::from).collect();

    Ok(result)
}

/// This function will return a single ingestion
/// (internal application model) by its ID or will throw an
/// error if the ingestion is not found or could not be constructed.
/// This is intended to be used for
/// all the internal analysis and processing of ingestion data.
/// Ingestion should be most likely serializable
/// and deserializable
/// as this function will be expensive in time and resources it can be memoized to some
/// local cache.
pub(super) async fn get_ingestion_by_id(id: i32) -> Result<Ingestion, anyhow::Error> {
    let ingestion = db::ingestion::Entity::find_by_id(id)
        .one(&DB_CONNECTION as &DatabaseConnection)
        .await?;

    if ingestion.is_none() {
        return Err(anyhow::anyhow!("Ingestion not found"));
    }

    let result = Ingestion::from(ingestion.unwrap());

    Ok(result)
}
