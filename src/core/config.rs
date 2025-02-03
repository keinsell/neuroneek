use serde::{Deserialize, Serialize};
use std::env;
use std::env::temp_dir;
use std::path::PathBuf;
use directories::ProjectDirs;
use lazy_static::lazy_static;
use crate::cli::Cli;

pub const NAME: &str = env!("CARGO_PKG_NAME");
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

lazy_static! {
    pub static ref DATA_DIR: PathBuf = {
        ProjectDirs::from("com", "keinsell", NAME)
            .expect("project data directory not found")
            .data_dir()
            .to_path_buf()
    };
    pub static ref CACHE_DIR: PathBuf = {
        ProjectDirs::from("com", "keinsell", NAME)
            .expect("project cache directory not found")
            .cache_dir()
            .to_path_buf()
    };
    pub static ref CONFIG_DIR: PathBuf = {
        ProjectDirs::from("com", "keinsell", NAME)
            .expect("project config directory not found")
            .config_dir()
            .to_path_buf()
    };
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Config {
    pub sqlite_path: PathBuf,
    pub version: Option<u32>,
}

impl Default for Config {
    fn default() -> Self {
        let default_db = if cfg!(test) || cfg!(debug_assertions) {
            temp_dir().join("neuronek.sqlite")
        } else {
            DATA_DIR.join("journal.db")
        };
        Config {
            sqlite_path: default_db,
            version: Some(1),
        }
    }
}

impl Config {
    pub fn load() -> Self {
        confy::load(NAME, None).unwrap_or_default()
    }
}

lazy_static! {
    pub static ref CONFIG: Config = Config::default();
}
