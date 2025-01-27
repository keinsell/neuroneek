use chrono::Local;
use miette::miette;
use sea_orm::{ActiveValue, DatabaseConnection, EntityTrait};
use sea_orm::sea_query::PgFunction::GenRandomUUID;
use sea_orm_migration::IntoSchemaManagerConnection;
use crate::analyzer::model::IngestionAnalysis;
use crate::database::entities::ingestion_phase;
use crate::utils::DATABASE_CONNECTION;
use uuid::Uuid;

pub async fn save_ingestion_analysis(ingestion_analysis: IngestionAnalysis) -> miette::Result<()> {
    if ingestion_analysis.ingestion.as_ref().is_none() || ingestion_analysis.ingestion.as_ref().unwrap().id.is_none() {
        return Ok(())
    }

    for phase in &ingestion_analysis.phases {
        let phase_model = ingestion_phase::ActiveModel {
            id: ActiveValue::Set(uuid::Uuid::new_v4().to_string()),
            ingestion_id: ActiveValue::Set(ingestion_analysis.ingestion.as_ref().unwrap().id.unwrap()),
            classification: ActiveValue::Set(phase.class.to_string()),
            description: ActiveValue::NotSet,
            start_time: ActiveValue::Set(phase.duration_range.start.naive_utc()),
            end_time: ActiveValue::Set(phase.duration_range.end.naive_utc()),
            duration_lower: ActiveValue::NotSet,
            duration_upper: ActiveValue::NotSet,
            intensity: ActiveValue::NotSet,
            notes: ActiveValue::NotSet,
            created_at: ActiveValue::Set(Local::now().naive_utc()),
            updated_at: ActiveValue::Set(Local::now().naive_utc()),
        };

        ingestion_phase::Entity::insert(phase_model)
            .exec(&DATABASE_CONNECTION.into_schema_manager_connection())
            .await
            .map_err(|e| miette!("Failed to save ingestion phase: {}", e))
            .map(|ok|
                println!("IngestionPhase {:?} created", ok.last_insert_id))?;
    }

    Ok(())
}