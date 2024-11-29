#![feature(duration_constructors)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_db_pools;

mod graphql_schema;
mod orm;
#[cfg(test)]
mod tests;

use async_graphql::{
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptyMutation, EmptySubscription, Schema,
};
use async_graphql_rocket::*;
use async_std::task_local;
use graphql_schema::*;
use ndb::{IntoSchemaManagerConnection, Migrator, MigratorTrait};
use orm::setup_database;
use response::content;
use rocket::*;
use sea_orm::{DatabaseConnection, *};
use utoipa::{
    openapi::security::{ApiKey, ApiKeyValue, SecurityScheme},
    Modify, OpenApi, ToSchema,
};
use utoipa_scalar::{Scalar, Servable};

use crate::serde::json::Json;

type SchemaType = Schema<QueryRoot, EmptyMutation, EmptySubscription>;

#[post("/", data = "<request>", format = "application/json")]
async fn graphql_request(schema: &State<SchemaType>, request: GraphQLRequest) -> GraphQLResponse {
    request.execute(&**schema).await
}

#[rocket::get("/")]
fn graphql_playground() -> content::RawHtml<String> {
    content::RawHtml(playground_source(GraphQLPlaygroundConfig::new("/graphql")))
}

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
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {}
}

#[launch]
async fn rocket() -> _ {
    let db = match setup_database().await {
        Ok(db) => db,
        Err(err) => panic!("{}", err),
    };

    let schema = Schema::build(QueryRoot, EmptyMutation, EmptySubscription)
        .data(db.clone())
        .finish();

    println!("{:?}", schema.sdl().clone());

    rocket::build()
        .manage(db)
        .manage(schema)
        .mount("/", Scalar::with_url("/", ApiDoc::openapi()))
        .mount("/graphql", routes![graphql_request, graphql_playground])
        .mount(
            "/",
            routes![
                substance_api::list_substances,
                substance_api::get_substance_by_id
            ],
        )
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

    #[utoipa::path(
        path = "/substance/{id}",
        responses(
            (status = 200, description = "Substances retrieved successfully", body = Substance),
            (status = 500, description = "Internal server error"),
        ),
        security()
    )]
    #[get("/substance/<id>")]
    pub(super) async fn get_substance_by_id(
        db: &State<DatabaseConnection>,
        id: String,
    ) -> Json<Substance> {
        let database_connection = db as &DatabaseConnection;
        let substance: ndb::substance::Model = ndb::substance::Entity::find_by_id(id)
            .one(database_connection)
            .await
            .unwrap()
            .unwrap();

        Json(Substance {
            id: substance.id.to_string(),
        })
    }
}

mod account {}
mod authentication {}
mod ingestion {}
mod route_of_administration {}
mod dosage {}
mod phase {}
mod substance {}
mod subject {}
mod experience {}
mod search {}
