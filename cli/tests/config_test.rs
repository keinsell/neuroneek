use neuronek_cli::config::AppConfig;
use std::fs;
use tempfile::TempDir;

#[test]
fn test_default_config()
{
    let config = AppConfig::new().unwrap();
    assert_eq!(config.debug, false);
}

#[test]
fn test_load_config()
{
    let config = AppConfig::new().unwrap();
    assert_eq!(config.debug, false);
}
