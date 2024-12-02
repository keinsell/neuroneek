use std::env;
use config::Config as ConfigBuilder;
use config::Environment;
use config::File;
use directories::ProjectDirs;
use serde::Deserialize;
use serde::Serialize;
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
    #[serde(default = "default_database_url")]
    pub database_url: String,

    #[serde(default)]
    pub debug: bool,

    #[serde(default = "default_log_level")]
    pub log_level: String,

    #[serde(skip_deserializing)]
    pub config_path: Option<PathBuf>,
}

fn default_database_url() -> String {
    if cfg!(test) {
        "sqlite::memory:".to_string()
    } else {
        let proj_dirs = ProjectDirs::from("com", "neuronek", "cli")
            .expect("Failed to get project directories");
        
        #[cfg(debug_assertions)]
        let data_dir = proj_dirs.data_dir().join("debug");
        
        #[cfg(not(debug_assertions))]
        let data_dir = proj_dirs.data_dir().join("release");

        std::fs::create_dir_all(&data_dir).unwrap_or_default();
        let db_path = data_dir.join("database.db");
        if !db_path.exists() {
            std::fs::write(&db_path, "").unwrap_or_default();
        }
        format!("sqlite:{}", db_path.display())
    }
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
        // Allow override of config path through env var
        let config_path = if let Ok(path) = env::var("NEURONEK_CONFIG_PATH") {
            PathBuf::from(path)
        } else {
            ProjectDirs::from("com", "neuronek", "cli")
                .map(|proj_dirs| proj_dirs.config_dir().join("config.toml"))
                .unwrap_or_else(|| PathBuf::from("config.toml"))
        };

        let mut builder = ConfigBuilder::builder()
            // Start off with default values
            .set_default("database_url", default_database_url())?
            .set_default("debug", false)?
            .set_default("log_level", default_log_level())?;

        // Layer 1: Add config file if it exists
        if config_path.exists()
        {
            builder = builder.add_source(File::from(config_path.clone()));
        }

        // Layer 2: Add environment variables with prefix "NEURONEK_"
        builder = builder.add_source(
            Environment::with_prefix("NEURONEK")
                .separator("_")
                .try_parsing(true),
        );

        // Build final config
        let config = builder.build()?;

        // Deserialize config
        let mut app_config: AppConfig = config.try_deserialize()?;

        // Set config path
        app_config.config_path = Some(config_path.clone());

        // Ensure config directory exists
        if let Some(parent) = config_path.parent() {
            std::fs::create_dir_all(parent)
                .map_err(|e| ConfigError::DirectoryCreation(e))?;
        }

        // Auto-migrate: Save current config if file doesn't exist
        if !config_path.clone().exists()
        {
            let toml = toml::to_string_pretty(&app_config).map_err(|e| {
                ConfigError::ConfigurationError(config::ConfigError::Message(e.to_string()))
            })?;
            std::fs::write(&config_path, toml)?;
        }

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
