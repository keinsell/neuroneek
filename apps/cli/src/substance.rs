use sea_orm::*;
use tabled::Table;
use crate::entities::prelude::Substance;

pub async fn list_substances(db: &DatabaseConnection) {
    let substances = Substance::find().all(db).await.unwrap();
    let string_table = Table::new(substances);
    println!("{}", string_table.to_string());
}