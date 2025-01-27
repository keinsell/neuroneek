//! `SeaORM` Entity, @generated by sea-orm-codegen 1.1.4


use sea_orm::entity::prelude::*;
use serde::Deserialize;
use serde::Serialize;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "ingestion_phase")]
pub struct Model
{
    #[sea_orm(primary_key, auto_increment = false, column_type = "Text", unique)]
    pub id: String,
    pub ingestion_id: i32,
    #[sea_orm(column_type = "Text")]
    pub classification: String,
    #[sea_orm(column_type = "Text", nullable)]
    pub description: Option<String>,
    pub start_time: DateTime,
    pub end_time: DateTime,
    #[sea_orm(column_type = "Text", nullable)]
    pub duration_lower: Option<String>,
    #[sea_orm(column_type = "Text", nullable)]
    pub duration_upper: Option<String>,
    #[sea_orm(column_type = "Text", nullable)]
    pub intensity: Option<String>,
    #[sea_orm(column_type = "Text", nullable)]
    pub notes: Option<String>,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation
{
    #[sea_orm(
        belongs_to = "super::ingestion::Entity",
        from = "Column::IngestionId",
        to = "super::ingestion::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Ingestion,
}

impl Related<super::ingestion::Entity> for Entity
{
    fn to() -> RelationDef { Relation::Ingestion.def() }
}

impl ActiveModelBehavior for ActiveModel {}
