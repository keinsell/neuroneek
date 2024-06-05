use sea_orm::*;
use sea_orm::{DatabaseConnection, EntityTrait, QueryFilter};
use sea_orm::ActiveValue::Set;

use crate::core::route_of_administration::RouteOfAdministrationClassification;
use crate::db;
use crate::db::prelude::*;

pub struct CreateRouteOfAdministration {
    pub classification: RouteOfAdministrationClassification,
    pub substance_name: String,
}

pub async fn create_route_of_administration(
    db: &DatabaseConnection,
    roa: CreateRouteOfAdministration,
) -> Result<db::route_of_administration::Model, sea_orm::error::DbErr> {
    let substance_name = roa.substance_name.clone();

    let roa_active_model: db::route_of_administration::ActiveModel =
        db::route_of_administration::ActiveModel {
            id: Default::default(),
            classification: Set(serde_json::to_string(&roa.classification)
                .unwrap()
                .to_string()),
            substance_name: Set(substance_name.clone()),
        };

    let existing_roa = RouteOfAdministration::find()
        .filter(
            db::route_of_administration::Column::Classification
                .eq(serde_json::to_string(&roa.classification).unwrap())
                .and(db::route_of_administration::Column::SubstanceName.eq(substance_name.clone())),
        )
        .one(db)
        .await?;

    match existing_roa {
        Some(roa) => Ok(roa),
        None => {
            let inserted_roa = RouteOfAdministration::insert(roa_active_model)
                .exec_with_returning(db)
                .await?;
            Ok(inserted_roa)
        }
    }
}
