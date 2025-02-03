//! `SeaORM` Entity, @generated by sea-orm-codegen 1.1.4


use sea_orm::entity::prelude::*;
use serde::Deserialize;
use serde::Serialize;

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity
{
    fn table_name(&self) -> &str { "ingestion" }
}

#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel, Serialize, Deserialize)]
pub struct Model
{
    pub id: i32,
    pub substance_name: String,
    pub route_of_administration: String,
    pub dosage: f32,
    pub dosage_classification: Option<String>,
    pub ingested_at: DateTime,
    pub updated_at: DateTime,
    pub created_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column
{
    Id,
    SubstanceName,
    RouteOfAdministration,
    Dosage,
    DosageClassification,
    IngestedAt,
    UpdatedAt,
    CreatedAt,
}

#[derive(Copy, Clone, Debug, EnumIter, DerivePrimaryKey)]
pub enum PrimaryKey
{
    Id,
}

impl PrimaryKeyTrait for PrimaryKey
{
    type ValueType = i32;
    fn auto_increment() -> bool { true }
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation
{
    IngestionPhase,
}

impl ColumnTrait for Column
{
    type EntityName = Entity;
    fn def(&self) -> ColumnDef
    {
        match self
        {
            | Self::Id => ColumnType::Integer.def(),
            | Self::SubstanceName => ColumnType::String(StringLen::None).def(),
            | Self::RouteOfAdministration => ColumnType::String(StringLen::None).def(),
            | Self::Dosage => ColumnType::Float.def(),
            | Self::DosageClassification => ColumnType::Text.def().null(),
            | Self::IngestedAt => ColumnType::DateTime.def(),
            | Self::UpdatedAt => ColumnType::DateTime.def(),
            | Self::CreatedAt => ColumnType::DateTime.def(),
        }
    }
}

impl RelationTrait for Relation
{
    fn def(&self) -> RelationDef
    {
        match self
        {
            | Self::IngestionPhase => Entity::has_many(super::ingestion_phase::Entity).into(),
        }
    }
}

impl Related<super::ingestion_phase::Entity> for Entity
{
    fn to() -> RelationDef { Relation::IngestionPhase.def() }
}

impl ActiveModelBehavior for ActiveModel {}
