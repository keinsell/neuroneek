//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.15

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "stash"
    }
}

#[derive(
    Clone,
    Debug,
    PartialEq,
    DeriveModel,
    DeriveActiveModel,
    Eq,
    Serialize,
    Deserialize,
    async_graphql :: SimpleObject,
)]
pub struct Model {
    pub id: String,
    pub owner_id: String,
    pub substance_id: String,
    pub added_date: Option<DateTime>,
    pub expiration: Option<DateTime>,
    pub amount: Option<i32>,
    pub price: Option<String>,
    pub vendor: Option<String>,
    pub description: Option<String>,
    pub purity: Option<i32>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    OwnerId,
    SubstanceId,
    #[sea_orm(column_name = "addedDate")]
    AddedDate,
    Expiration,
    Amount,
    Price,
    Vendor,
    Description,
    Purity,
}

#[derive(Copy, Clone, Debug, EnumIter, DerivePrimaryKey)]
pub enum PrimaryKey {
    Id,
}

impl PrimaryKeyTrait for PrimaryKey {
    type ValueType = String;
    fn auto_increment() -> bool {
        false
    }
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Ingestion,
    Subject,
    Substance,
}

impl ColumnTrait for Column {
    type EntityName = Entity;
    fn def(&self) -> ColumnDef {
        match self {
            Self::Id => ColumnType::String(None).def(),
            Self::OwnerId => ColumnType::String(None).def(),
            Self::SubstanceId => ColumnType::String(None).def(),
            Self::AddedDate => ColumnType::DateTime.def().null(),
            Self::Expiration => ColumnType::DateTime.def().null(),
            Self::Amount => ColumnType::Integer.def().null(),
            Self::Price => ColumnType::String(None).def().null(),
            Self::Vendor => ColumnType::String(None).def().null(),
            Self::Description => ColumnType::String(None).def().null(),
            Self::Purity => ColumnType::Integer.def().null(),
        }
    }
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Ingestion => Entity::has_many(super::ingestion::Entity).into(),
            Self::Subject => Entity::belongs_to(super::subject::Entity)
                .from(Column::OwnerId)
                .to(super::subject::Column::Id)
                .into(),
            Self::Substance => Entity::belongs_to(super::substance::Entity)
                .from(Column::SubstanceId)
                .to(super::substance::Column::Name)
                .into(),
        }
    }
}

impl Related<super::ingestion::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Ingestion.def()
    }
}

impl Related<super::subject::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Subject.def()
    }
}

impl Related<super::substance::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Substance.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelatedEntity)]
pub enum RelatedEntity {
    #[sea_orm(entity = "super::ingestion::Entity")]
    Ingestion,
    #[sea_orm(entity = "super::subject::Entity")]
    Subject,
    #[sea_orm(entity = "super::substance::Entity")]
    Substance,
}
