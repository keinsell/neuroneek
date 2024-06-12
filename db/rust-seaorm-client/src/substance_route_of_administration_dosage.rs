//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.15

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "substance_route_of_administration_dosage"
    }
}

#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel, Serialize, Deserialize)]
pub struct Model {
    pub id: String,
    pub intensity: String,
    pub lower_bound_amount: Option<f64>,
    pub upper_bound_amount: Option<f64>,
    pub unit: String,
    pub route_of_administration_id: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Intensity,
    LowerBoundAmount,
    UpperBoundAmount,
    Unit,
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
            Self::Intensity => ColumnType::String(None).def(),
            Self::LowerBoundAmount => ColumnType::Double.def().null(),
            Self::UpperBoundAmount => ColumnType::Double.def().null(),
            Self::Unit => ColumnType::String(None).def(),
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

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelatedEntity)]
pub enum RelatedEntity {
    #[sea_orm(entity = "super::substance_route_of_administration::Entity")]
    SubstanceRouteOfAdministration,
}
