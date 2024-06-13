use crate::*;
use async_graphql::dynamic::*;
use sea_orm::DatabaseConnection;
use seaography::{Builder, BuilderContext};

lazy_static::lazy_static! { static ref CONTEXT : BuilderContext = BuilderContext :: default () ; }

pub fn schema(
    database: DatabaseConnection,
    depth: Option<usize>,
    complexity: Option<usize>,
) -> Result<Schema, SchemaError> {
    let mut builder = Builder::new(&CONTEXT, database.clone());
    seaography::register_entities!(
        builder,
        [
            account,
            chemical_class,
            effect,
            ingestion,
            psychoactive_class,
            stash,
            subject,
            substance,
            substance_interactions,
            substance_route_of_administration,
            substance_route_of_administration_dosage,
            substance_route_of_administration_phase,
            substance_synonym,
            substance_tolerance,
        ]
    );
    let schema = builder.schema_builder();
    let schema = if let Some(depth) = depth {
        schema.limit_depth(depth)
    } else {
        schema
    };
    let schema = if let Some(complexity) = complexity {
        schema.limit_complexity(complexity)
    } else {
        schema
    };
    schema.data(database).finish()
}
