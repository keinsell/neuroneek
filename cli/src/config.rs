use config::Config as ConfigBuilder;
use config::Environment;
use config::File;
use directories::ProjectDirs;
use serde::Deserialize;
use serde::Serialize;
use std::env;
use std::path::PathBuf;
use thiserror::Error;
use tracing::Level;

#[derive(Error, Debug)]
pub enum ConfigError
{
    #[error("Configuration error: {0}")]
    ConfigurationError(#[from] config::ConfigError),
    #[error("Failed to create directory: {0}")]
    DirectoryCreation(#[from] std::io::Error),
    #[error("Invalid log level: {0}")]
    InvalidLogLevel(String),
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppConfig
{
    pub database_url: String,

    #[serde(default)]
    pub debug: bool,

    #[serde(default = "default_log_level")]
    pub log_level: String,

    #[serde(skip_deserializing)]
    pub config_path: Option<PathBuf>,
}

fn default_database_url() -> String
{
    let mut database_filename: &str = "journal.db";
    if cfg!(test)
    {
        database_filename = "sqlite::memory:";
    }
    if cfg!(debug_assertions)
    {
        database_filename = "dev.db";
    }

    let project_dirs =
        ProjectDirs::from("com", "neuronek", "cli").expect("Failed to get project directories");
    let data_directory = project_dirs.data_dir();

    let database_path = &data_directory.clone().join(database_filename);

    if !database_path.exists()
    {
        std::fs::write(&database_path, "").unwrap_or_default();
    }

    println!("Database path: {}", database_path.display());
    format!("sqlite:{}", database_path.display())
}

fn default_log_level() -> String { "info".to_string() }

impl Default for AppConfig
{
    fn default() -> Self
    {
        Self {
            database_url: default_database_url(),
            debug: false,
            log_level: default_log_level(),
            config_path: None,
        }
    }
}

impl AppConfig
{
    pub fn new() -> Result<Self, ConfigError>
    {
        let mut builder = ConfigBuilder::builder()
            // Start off with default values
            .set_default("database_url", default_database_url())?
            .set_default("debug", false)?
            .set_default("log_level", default_log_level())?;

        builder = builder.add_source(
            Environment::with_prefix("NEURONEK")
                .separator("_")
                .try_parsing(true),
        );

        let config = builder.build()?;
        let mut app_config: AppConfig = config.try_deserialize()?;

        Ok(app_config)
    }

    pub fn get_log_level(&self) -> Result<Level, ConfigError>
    {
        match self.log_level.to_lowercase().as_str()
        {
            | "trace" => Ok(Level::TRACE),
            | "debug" => Ok(Level::DEBUG),
            | "info" => Ok(Level::INFO),
            | "warn" => Ok(Level::WARN),
            | "error" => Ok(Level::ERROR),
            | invalid => Err(ConfigError::InvalidLogLevel(invalid.to_string())),
        }
    }
}

#[cfg(test)]
mod tests
{
    use std::env;

    use super::*;
    use temp_dir::TempDir;

    #[test]
    fn test_config_file_creation()
    {
        let temp_dir = TempDir::new().unwrap();
        let config_path = temp_dir.path().join("config.toml");

        unsafe {
            env::set_var("NEURONEK_CONFIG_PATH", config_path.to_str().unwrap());
        }

        let config = AppConfig::new().unwrap();
        assert!(config_path.exists());
    }
}
