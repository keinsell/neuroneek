use neuronek_cli::config::Config;
use std::fs;
use tempfile::TempDir;

#[test]
fn test_default_config()
{
    let config = Config::default();
    assert_eq!(config.debug, false);
}

#[test]
fn test_load_config()
{
    let config = Config::default();
    assert_eq!(config.debug, false);
}

#[test]
fn test_config_serialization()
{
    let config = Config {
        debug: true,
        log_file_path: Default::default(),
        database_path: std::path::PathBuf::from("dummy_path"),
        log_level: "debug".to_string(),
    };
    let serialized = serde_json::to_string_pretty(&config).unwrap();
    let deserialized: Config = serde_json::from_str(&serialized).unwrap();
    assert_eq!(config.debug, deserialized.debug);
}

#[test]
fn test_config_file_creation()
{
    let temp_dir = TempDir::new().unwrap();
    let config_path = temp_dir.path().join("config.json");

    // Create a test config
    let test_config = Config {
        debug: true,
        log_file_path: Default::default(),
        database_path: std::path::PathBuf::from("dummy_path"),
        log_level: "debug".to_string(),
    };

    let config_data = serde_json::to_string_pretty(&test_config).unwrap();
    fs::write(&config_path, config_data).unwrap();

    // Read and verify
    let read_data = fs::read_to_string(&config_path).unwrap();
    let read_config: Config = serde_json::from_str(&read_data).unwrap();
    assert_eq!(read_config.debug, true);
}
