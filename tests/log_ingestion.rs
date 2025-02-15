use assert_cmd::prelude::*;
use std::process::Command;

#[test]
fn test_log_ingestion() -> Result<(), Box<dyn std::error::Error>>
{
    let mut cmd = Command::cargo_bin("neuronek")?;
    cmd.env("RUST_TEST", "1")  // Set test environment variable
        .arg("ingestion")
        .arg("log")
        .arg("-s caffeine")
        .arg("-d 100mg");
    cmd.assert().success();
    Ok(())
}
