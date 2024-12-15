use assert_cmd::prelude::*;
use std::process::Command;

#[test]
fn test_update_ingestion() -> Result<(), Box<dyn std::error::Error>>
{
    let mut cmd = Command::cargo_bin("psylog")?;
    cmd.arg("ingestion").arg("log").arg("caffeine").arg("100mg");
    cmd.assert().success();

    let mut cmd2 = Command::cargo_bin("psylog")?;
    cmd2.arg("ingestion").arg("update").arg("1").arg("-d 200mg");
    cmd2.assert().success();

    Ok(())
}
