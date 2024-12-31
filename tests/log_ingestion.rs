use assert_cmd::prelude::*;
use std::process::Command;

#[test]
fn test_log_ingestion() -> Result<(), Box<dyn std::error::Error>>
{
    let mut cmd = Command::cargo_bin("neuronek")?;
    cmd.arg("ingestion").arg("log").arg("caffeine").arg("100mg");
    cmd.assert().success();

    Ok(())
}
