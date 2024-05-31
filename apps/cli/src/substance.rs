use rust_embed::{Embed, EmbeddedFile};
use sea_orm::*;
use sea_orm::ActiveValue::Set;
use serde::{Deserialize, Serialize};
use tabled::Table;

use crate::entities::{self, prelude::Substance, substance::ActiveModel};
use crate::service::roa::{CreateRouteOfAdministration, RouteOfAdministrationClassification};


pub async fn list_substances(db: &DatabaseConnection) {
    let substances = Substance::find().all(db).await.unwrap();

    let table = Table::new(substances);

    println!("{}", table);
}
