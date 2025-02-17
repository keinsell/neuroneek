use assert_cmd::prelude::*;
use std::process::Command;

#[test]
fn test_update_ingestion() -> Result<(), Box<dyn std::error::Error>>
{
    let mut cmd = Command::cargo_bin("neuronek")?;
    cmd.arg("ingestion")
        .arg("log")
        .arg("-s caffeine")
        .arg("-d 100mg");
    cmd.assert().success();

    let mut cmd2 = Command::cargo_bin("neuronek")?;
    cmd2.arg("ingestion").arg("update").arg("1").arg("-d 200mg");
    cmd2.assert().success();

    Ok(())
}
