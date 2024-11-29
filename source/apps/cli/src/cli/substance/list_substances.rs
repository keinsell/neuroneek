use db::sea_orm::{DatabaseConnection, EntityTrait};

pub async fn list_substances(db: &DatabaseConnection) {
    let substances = db::substance::Entity::find().all(db).await.unwrap();

    for substance in substances {
        println!("{:?}", substance);
    }
}
