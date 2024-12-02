use crate::config::Config;
use sea_orm::Database;
use sea_orm::DatabaseConnection;
use smol::block_on;
use std::fs;

lazy_static::lazy_static! {
#[derive(Clone, Debug)]
 pub static ref DATABASE_CONNECTION: DatabaseConnection = {
         let config = Config::default();
         if let Some(parent) = config.database_path.parent() {
             fs::create_dir_all(parent).unwrap();
         }

        if !config.database_path.exists() {
             fs::write(&config.database_path, "").unwrap();
         }

         block_on(async {
             Database::connect(format!("sqlite://{}", config.database_path.to_str().unwrap())).await.unwrap()
         })
     };
 }
