use assert_cmd::prelude::*;
use predicates::prelude::*;
use std::process::Command;

#[test]
fn test_show_ingestion() -> Result<(), Box<dyn std::error::Error>>
{
    let mut cmd = Command::cargo_bin("neuronek")?;
    cmd.env("RUST_TEST", "1")
        .arg("ingestion")
        .arg("log")
        .arg("-s caffeine")
        .arg("-d 100mg");
    cmd.assert().success();

    let mut cmd = Command::cargo_bin("neuronek")?;
    cmd.env("RUST_TEST", "1")
        .arg("ingestion")
        .arg("view")
        .arg("1");
    cmd.assert()
        .success()
        .stdout(predicate::str::contains("caffeine"));

    Ok(())
}

#[test]
fn test_show_nonexistent_ingestion() -> Result<(), Box<dyn std::error::Error>>
{
    let mut cmd = Command::cargo_bin("neuronek")?;
    cmd.env("RUST_TEST", "1")
        .arg("ingestion")
        .arg("view")
        .arg("999999");
    cmd.assert()
        .failure()
        .stderr(predicate::str::contains("not found"));

    Ok(())
}
