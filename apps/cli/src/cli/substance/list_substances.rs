use db::prelude::*;
use sea_orm::*;

pub async fn list_substances(db: &DatabaseConnection) {
    let substances = Substance::find().all(db).await.unwrap();

    println!("{:?}", substances);
}
