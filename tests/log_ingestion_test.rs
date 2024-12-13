use assert_cmd::prelude::*;
use predicates::prelude::*;
use std::process::Command;

#[test]
fn test_log_ingestion() -> Result<(), Box<dyn std::error::Error>> {
    let mut cmd = Command::cargo_bin("psylog")?;

    cmd.arg("ingestion").arg("log").arg("-s caffeine").arg("-d 100mg");
    cmd.assert().success();

    Ok(())
}