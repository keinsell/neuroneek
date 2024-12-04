use crate::config::AppConfig;
use sea_orm::Database;
use sea_orm::DatabaseConnection;
use smol::block_on;

lazy_static::lazy_static! {
#[derive(Clone, Debug)]
 pub static ref DATABASE_CONNECTION: DatabaseConnection = {
         let config = AppConfig::new().expect("Failed to load config");
         block_on(async {
             println!("🗄️ Using persistence: {}", config.database_url.clone());
             Database::connect(&config.database_url).await.unwrap()
         })
     };
 }
