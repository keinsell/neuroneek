use neuronek_cli::config::AppConfig;
use std::fs;
use tempfile::TempDir;
use std::env;

#[test]
fn test_default_config() {
    let temp_dir = TempDir::new().unwrap();
    let config_path = temp_dir.path().join("config.toml");
    
    // Set environment variable for test
    env::set_var("NEURONEK_CONFIG_PATH", config_path.to_str().unwrap());
    
    let config = AppConfig::new().unwrap();
    assert_eq!(config.debug, false);
    assert_eq!(config.log_level, "info");
    assert!(config_path.exists());
    
    // Verify config file contents
    let config_contents = fs::read_to_string(&config_path).unwrap();
    assert!(config_contents.contains("database_url"));
    assert!(config_contents.contains("debug = false"));
}

#[test]
fn test_load_config() {
    let temp_dir = TempDir::new().unwrap();
    let config_path = temp_dir.path().join("config.toml");
    
    // Create test config file
    let test_config = r#"
        debug = true
        log_level = "debug"
    "#;
    fs::write(&config_path, test_config).unwrap();
    
    env::set_var("NEURONEK_CONFIG_PATH", config_path.to_str().unwrap());
    
    let config = AppConfig::new().unwrap();
    assert_eq!(config.debug, true);
    assert_eq!(config.log_level, "debug");
}

#[test]
fn test_env_override() {
    let temp_dir = TempDir::new().unwrap();
    let config_path = temp_dir.path().join("config.toml");
    
    // Create base config
    let test_config = r#"
        debug = false
        log_level = "info"
    "#;
    fs::write(&config_path, test_config).unwrap();
    
    // Override with env vars
    env::set_var("NEURONEK_CONFIG_PATH", config_path.to_str().unwrap());
    env::set_var("NEURONEK_DEBUG", "true");
    env::set_var("NEURONEK_LOG_LEVEL", "debug");
    
    let config = AppConfig::new().unwrap();
    assert_eq!(config.debug, true);
    assert_eq!(config.log_level, "debug");
    
    // Clean up env vars
    env::remove_var("NEURONEK_DEBUG");
    env::remove_var("NEURONEK_LOG_LEVEL");
}
