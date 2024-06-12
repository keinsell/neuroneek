#![feature(duration_constructors)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_db_pools;

mod orm;
#[cfg(test)]
mod tests;

use ndb::Migrator;
use orm::setup_database;
use rocket::*;
use sea_orm::{DatabaseConnection, *};
use sea_orm_migration::*;
use utoipa::{
    openapi::security::{ApiKey, ApiKeyValue, SecurityScheme},
    Modify, OpenApi, ToSchema,
};
use utoipa_scalar::{Scalar, Servable};

use crate::serde::json::Json;

#[launch]
async fn rocket() -> _ {
    #[derive(OpenApi)]
    #[openapi(
        paths(
            substance_api::list_substances
        ),
        components(
            schemas(
                substance_api::Substance,
            )
        ),
        tags(
            (name = "substance", description = "Substance-related operations.")
        ),
        modifiers(&SecurityAddon)
    )]
    struct ApiDoc;

    struct SecurityAddon;

    impl Modify for SecurityAddon {
        fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
            // let components = openapi.components.as_mut().unwrap();
            // components.add_security_scheme(
            //     "api_key",
            //     SecurityScheme::ApiKey(ApiKey::Header(ApiKeyValue::new("
            // todo_apikey"))), )
        }
    }

    let db = match setup_database().await {
        Ok(db) => db,
        Err(err) => panic!("{}", err),
    };

    match Migrator::up(db.into_schema_manager_connection(), None).await {
        Ok(_) => debug!("Migrations applied"),
        Err(error) => panic!("Could not migrate database schema: {}", error),
    };

    rocket::build()
        .manage(db)
        .mount("/", Scalar::with_url("/", ApiDoc::openapi()))
        .mount("/", routes![substance_api::list_substances])
}

mod substance_api {
    use std::sync::{Arc, Mutex};

    use rocket::{
        delete, get,
        http::Status,
        outcome::Outcome,
        post, put,
        request::{self, FromRequest},
        response::{status::Custom, Responder},
        serde::json::Json,
        FromForm, Request, State,
    };
    use sea_orm::{DatabaseConnection, *};
    use serde::{Deserialize, Serialize};
    use utoipa::{IntoParams, ToSchema};

    #[derive(Serialize, ToSchema, Responder, Debug)]
    pub(super) enum SubstanceError {
        /// When there is conflict creating a new todo.
        #[response(status = 409)]
        Conflict(String),

        /// When todo item is not found from storage.
        #[response(status = 404)]
        NotFound(String),

        /// When unauthorized to complete operation
        #[response(status = 401)]
        Unauthorized(String),

        #[response(status = 500)]
        InternalServerError(String),
    }

    #[derive(Serialize, Deserialize, ToSchema, Clone)]
    pub(super) struct Substance {
        /// Unique identifier of substance based on BLAKE2 hash of IUPAC name.
        #[schema(
            example = "3ab37fdea136ae2c01e5d7670e7ee0d7ea1c700367f9d4dfb65d4249fc7c0282f6fe70443f2506c6a5de71bda8e220b1c94de53ff0d4e34e697341e2728c4259"
        )]
        id: String,
    }

    #[utoipa::path(
        path = "/substance",
        responses(
            (status = 200, description = "Substances retrieved successfully", body = [Substance]),
            (status = 500, description = "Internal server error"),
        ),
        security()
    )]
    #[get("/substance")]
    pub(super) async fn list_substances(db: &State<DatabaseConnection>) -> Json<Vec<Substance>> {
        let database_connection = db as &DatabaseConnection;
        let substances = ndb::substance::Entity::find()
            .all(database_connection)
            .await
            .unwrap()
            .into_iter()
            .map(|s| Substance {
                id: s.id.to_string(),
            })
            .collect();

        Json(substances)
    }
}
