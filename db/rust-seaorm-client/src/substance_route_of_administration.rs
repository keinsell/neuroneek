//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.15

use sea_orm::entity::prelude::*;

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "substance_route_of_administration"
    }
}

#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel, Eq)]
pub struct Model {
    pub id: String,
    pub substance_name: String,
    pub name: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    #[sea_orm(column_name = "substanceName")]
    SubstanceName,
    Name,
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
    SubstanceRouteOfAdministrationDosage,
    SubstanceRouteOfAdministrationPhase,
}

impl ColumnTrait for Column {
    type EntityName = Entity;
    fn def(&self) -> ColumnDef {
        match self {
            Self::Id => ColumnType::String(None).def(),
            Self::SubstanceName => ColumnType::String(None).def(),
            Self::Name => ColumnType::String(None).def(),
        }
    }
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Substance => Entity::belongs_to(super::substance::Entity)
                .from(Column::SubstanceName)
                .to(super::substance::Column::Name)
                .into(),
            Self::SubstanceRouteOfAdministrationDosage => {
                Entity::has_many(super::substance_route_of_administration_dosage::Entity).into()
            }
            Self::SubstanceRouteOfAdministrationPhase => {
                Entity::has_many(super::substance_route_of_administration_phase::Entity).into()
            }
        }
    }
}

impl Related<super::substance::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Substance.def()
    }
}

impl Related<super::substance_route_of_administration_dosage::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::SubstanceRouteOfAdministrationDosage.def()
    }
}

impl Related<super::substance_route_of_administration_phase::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::SubstanceRouteOfAdministrationPhase.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
