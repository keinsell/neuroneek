use sea_orm::*;
use tabled::Table;
use migrator::any;
use crate::entities::prelude::Substance;
use crate::entities::substance::Model;

pub async fn list_substances(db: &DatabaseConnection) {
    let substances = Substance::find().all(db).await.unwrap();
    let string_table = Table::new(substances);
    println!("{}", string_table.to_string());
}
pub async fn create_substance(db: &DatabaseConnection, create_substance: Box<dyn std::any::Any>) -> Model {
    println!("Creating substance with ID: {}", create_substance.downcast_ref::<i32>().unwrap());
}