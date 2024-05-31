use sea_orm::*;
use tabled::Table;
use crate::db::prelude::Substance;


pub async fn list_substances(db: &DatabaseConnection) {
    let substances = Substance::find().all(db).await.unwrap();

    let table = Table::new(substances);

    println!("{}", table);
}
