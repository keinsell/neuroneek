//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.15

use sea_orm::entity::prelude::*;

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "substance_route_of_administration_phase"
    }
}

#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel, Eq)]
pub struct Model {
    pub id: String,
    pub classification: String,
    pub min_duration: Option<i32>,
    pub max_duration: Option<i32>,
    pub route_of_administration_id: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Classification,
    MinDuration,
    MaxDuration,
    #[sea_orm(column_name = "routeOfAdministrationId")]
    RouteOfAdministrationId,
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
    SubstanceRouteOfAdministration,
}

impl ColumnTrait for Column {
    type EntityName = Entity;
    fn def(&self) -> ColumnDef {
        match self {
            Self::Id => ColumnType::String(None).def(),
            Self::Classification => ColumnType::String(None).def(),
            Self::MinDuration => ColumnType::Integer.def().null(),
            Self::MaxDuration => ColumnType::Integer.def().null(),
            Self::RouteOfAdministrationId => ColumnType::String(None).def().null(),
        }
    }
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::SubstanceRouteOfAdministration => {
                Entity::belongs_to(super::substance_route_of_administration::Entity)
                    .from(Column::RouteOfAdministrationId)
                    .to(super::substance_route_of_administration::Column::Id)
                    .into()
            }
        }
    }
}

impl Related<super::substance_route_of_administration::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::SubstanceRouteOfAdministration.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
