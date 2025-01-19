use lazy_static::lazy_static;
use std::env::temp_dir;
use std::path::Path;
use std::path::PathBuf;

pub const NAME: &str = env!("CARGO_PKG_NAME");
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

lazy_static::lazy_static! {
    pub static ref CONFIG: Config = Config::default();
    /// Returns the path to the project's data directory.
   pub static ref DATA_DIR: Box<Path> = directories::ProjectDirs::from("com", "keinsell", NAME).unwrap_or_else(|| panic!("project data directory not found")).data_dir().into();
    /// Returns the path to the project's cache directory.
  pub  static ref CACHE_DIR: Box<Path> = directories::ProjectDirs::from("com", "keinsell", NAME).unwrap_or_else(|| panic!("project data directory not found")).cache_dir().into();
    /// Returns the path to the project's config directory.
  pub   static ref CONFIG_DIR: Box<Path> = directories::ProjectDirs::from("com", "keinsell", NAME).unwrap_or_else(|| panic!("project data directory not found")).config_dir().into();
}


// TODO(NEU-1): Implement
#[derive(Debug, Clone)]
pub struct Config
{
    pub sqlite_path: PathBuf,
}

impl Default for Config
{
    fn default() -> Self
    {
        let mut journal_path = DATA_DIR.join("journal.db").clone();

        if cfg!(test) || cfg!(debug_assertions)
        {
            journal_path = temp_dir().join("neuronek.sqlite");
        }

        Config {
            sqlite_path: journal_path,
        }
    }
}
