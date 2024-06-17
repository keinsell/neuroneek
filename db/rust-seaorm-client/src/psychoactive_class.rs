//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.15

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "psychoactive_class"
    }
}

#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel, Eq, Serialize, Deserialize)]
pub struct Model {
    pub id: String,
    pub name: String,
    pub summary: Option<String>,
    pub description: Option<String>,
    pub substance_id: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Name,
    Summary,
    Description,
    #[sea_orm(column_name = "substanceId")]
    SubstanceId,
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
    Substance,
}

impl ColumnTrait for Column {
    type EntityName = Entity;
    fn def(&self) -> ColumnDef {
        match self {
            Self::Id => ColumnType::String(None).def(),
            Self::Name => ColumnType::String(None).def(),
            Self::Summary => ColumnType::String(None).def().null(),
            Self::Description => ColumnType::String(None).def().null(),
            Self::SubstanceId => ColumnType::String(None).def().null(),
        }
    }
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Substance => Entity::belongs_to(super::substance::Entity)
                .from(Column::SubstanceId)
                .to(super::substance::Column::Id)
                .into(),
        }
    }
}

impl Related<super::substance::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Substance.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
