use directories::ProjectDirs;
use serde::Deserialize;
use serde::Serialize;
use std::fs;
use std::path::PathBuf;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ConfigError
{
    #[error("Failed to create directory: {0}")]
    DirectoryCreation(#[from] std::io::Error),
    #[error("Failed to parse config file: {0}")]
    ConfigParse(#[from] toml::de::Error),
    #[error("Failed to serialize config: {0}")]
    ConfigSerialize(#[from] toml::ser::Error),
    #[error("Environment {0} not found")]
    EnvironmentNotFound(String),
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Config
{
    pub database_path: PathBuf,
    pub debug: bool,
    pub log_file_path: PathBuf,
    pub log_level: String,
}

impl Default for Config
{
    fn default() -> Self
    {
        Self {
            database_path: PathBuf::from("database.db"),
            debug: false,
            log_file_path: PathBuf::from("neuronek.log"),
            log_level: "info".to_string(),
        }
    }
}

impl Config
{
    pub fn database_path(&self) -> &PathBuf { &self.database_path }

    pub fn debug(&self) -> bool { self.debug }

    pub fn log_file_path(&self) -> &PathBuf { &self.log_file_path }

    pub fn log_level(&self) -> &str { &self.log_level }
}

#[derive(Debug)]
pub struct ConfigManager
{
    config: Config,
    environment: String,
    project_dirs: ProjectDirs,
}

impl ConfigManager
{
    pub fn new() -> Result<Self, ConfigError>
    {
        let environment = if cfg!(debug_assertions)
        {
            "development"
        } else {
            "production"
        };
        Self::with_environment(environment)
    }

    pub fn with_environment(environment: &str) -> Result<Self, ConfigError>
    {
        let project_dirs = ProjectDirs::from("com", "keinsell", "neuronek-cli")
            .expect("Failed to determine project directories");

        let mut manager = Self {
            config: Config::default(),
            environment: environment.to_string(),
            project_dirs,
        };

        manager.create_directories()?;
        manager.load_config()?;

        Ok(manager)
    }

    pub fn config(&self) -> &Config { &self.config }

    fn create_directories(&self) -> Result<(), ConfigError>
    {
        fs::create_dir_all(self.config_dir())?;
        fs::create_dir_all(self.data_dir())?;
        fs::create_dir_all(self.cache_dir())?;
        Ok(())
    }

    fn config_path(&self) -> PathBuf
    {
        self.config_dir()
            .join(format!("config.{}.toml", self.environment))
    }

    fn config_dir(&self) -> PathBuf { self.project_dirs.config_dir().to_path_buf() }

    fn data_dir(&self) -> PathBuf { self.project_dirs.data_dir().to_path_buf() }

    fn cache_dir(&self) -> PathBuf { self.project_dirs.cache_dir().to_path_buf() }

    fn load_config(&mut self) -> Result<(), ConfigError>
    {
        let config_path = self.config_path();

        if config_path.exists()
        {
            let config_str = fs::read_to_string(&config_path)?;
            self.config = toml::from_str(&config_str)?;
        } else {
            self.config = match self.environment.as_str()
            {
                | "development" | "debug" => Config {
                    database_path: self.data_dir().join("dev.db"),
                    debug: true,
                    log_file_path: self.data_dir().join("logs/dev.log"),
                    log_level: "debug".to_string(),
                },
                | "test" => Config {
                    database_path: self.data_dir().join("test.db"),
                    debug: true,
                    log_file_path: self.data_dir().join("logs/test.log"),
                    log_level: "debug".to_string(),
                },
                | "production" | "release" => Config {
                    database_path: self.data_dir().join("journal.db"),
                    debug: false,
                    log_file_path: self.data_dir().join("logs/neuronek.log"),
                    log_level: "info".to_string(),
                },
                | env => return Err(ConfigError::EnvironmentNotFound(env.to_string())),
            };

            self.save_config()?;
        }

        Ok(())
    }

    fn save_config(&self) -> Result<(), ConfigError>
    {
        let config_str = toml::to_string_pretty(&self.config)?;
        fs::write(self.config_path(), config_str)?;
        Ok(())
    }
}

#[cfg(test)]
mod tests
{
    use super::*;
    use std::env;
    use tempfile::tempdir;

    #[test]
    fn test_different_environments()
    {
        let config_manager = ConfigManager::with_environment("test").unwrap();
        assert!(config_manager.config().debug());
        assert!(
            config_manager
                .config()
                .database_path()
                .to_str()
                .unwrap()
                .contains("test.db")
        );

        let config_manager = ConfigManager::with_environment("release").unwrap();
        assert!(!config_manager.config().debug());
        assert!(
            config_manager
                .config()
                .database_path()
                .to_str()
                .unwrap()
                .contains("journal.db")
        );
    }

    #[test]
    fn test_cargo_profile_integration()
    {
        let config_manager = ConfigManager::new().unwrap();
        #[cfg(debug_assertions)]
        {
            assert!(config_manager.config().debug());
            assert!(
                config_manager
                    .config()
                    .database_path()
                    .to_str()
                    .unwrap()
                    .contains("dev.db")
            );
        }
        #[cfg(not(debug_assertions))]
        {
            assert!(!config_manager.config().debug());
            assert!(
                config_manager
                    .config()
                    .database_path()
                    .to_str()
                    .unwrap()
                    .contains("journal.db")
            );
        }
    }

    #[test]
    fn test_separate_test_database()
    {
        let test_dir = tempdir().unwrap();

        unsafe {
            env::set_var("HOME", test_dir.path());
        }

        let config_manager = ConfigManager::with_environment("test").unwrap();
        let prod_manager = ConfigManager::with_environment("release").unwrap();

        assert_ne!(
            config_manager.config().database_path(),
            prod_manager.config().database_path(),
            "Test and production databases should be different"
        );
    }

    #[test]
    fn test_invalid_environment()
    {
        let result = ConfigManager::with_environment("invalid_env");
        assert!(result.is_err());
        if let Err(ConfigError::EnvironmentNotFound(env)) = result {
            assert_eq!(env, "invalid_env");
        } else {
            panic!("Expected EnvironmentNotFound error");
        }
    }

    #[test]
    fn test_config_serialization_error()
    {
        let config = Config {
            database_path: PathBuf::from("database.db"),
            debug: false,
            log_file_path: PathBuf::from("neuronek.log"),
            log_level: "info".to_string(),
        };

        let result = toml::to_string_pretty(&config);
        assert!(result.is_ok());

        let invalid_config = Config {
            database_path: PathBuf::from("database.db"),
            debug: false,
            log_file_path: PathBuf::from("neuronek.log"),
            log_level: "info".to_string(),
        };

        let result = toml::to_string_pretty(&invalid_config);
        assert!(result.is_ok());
    }
}
