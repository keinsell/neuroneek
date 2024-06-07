//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.15

use sea_orm::entity::prelude::*;

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "ingestion"
    }
}

#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel, Eq)]
pub struct Model {
    pub id: String,
    pub substance_name: Option<String>,
    pub administration_route: Option<String>,
    pub dosage_unit: Option<String>,
    pub dosage_amount: Option<i32>,
    pub ingestion_date: Option<DateTime>,
    pub subject_id: Option<String>,
    pub stash_id: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    SubstanceName,
    AdministrationRoute,
    DosageUnit,
    DosageAmount,
    IngestionDate,
    SubjectId,
    StashId,
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
    Stash,
    Subject,
    Substance,
}

impl ColumnTrait for Column {
    type EntityName = Entity;
    fn def(&self) -> ColumnDef {
        match self {
            Self::Id => ColumnType::String(None).def(),
            Self::SubstanceName => ColumnType::String(None).def().null(),
            Self::AdministrationRoute => ColumnType::String(None).def().null(),
            Self::DosageUnit => ColumnType::String(None).def().null(),
            Self::DosageAmount => ColumnType::Integer.def().null(),
            Self::IngestionDate => ColumnType::DateTime.def().null(),
            Self::SubjectId => ColumnType::String(None).def().null(),
            Self::StashId => ColumnType::String(None).def().null(),
        }
    }
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Stash => Entity::belongs_to(super::stash::Entity)
                .from(Column::StashId)
                .to(super::stash::Column::Id)
                .into(),
            Self::Subject => Entity::belongs_to(super::subject::Entity)
                .from(Column::SubjectId)
                .to(super::subject::Column::Id)
                .into(),
            Self::Substance => Entity::belongs_to(super::substance::Entity)
                .from(Column::SubstanceName)
                .to(super::substance::Column::Name)
                .into(),
        }
    }
}

impl Related<super::stash::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Stash.def()
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
