use std::fs::OpenOptions;
use tracing::{Level, Subscriber};
use tracing_subscriber::{prelude::*, Registry};
use tracing_subscriber::fmt::format::FmtSpan;
use anyhow::{Context, Result};
use directories::ProjectDirs;

pub fn setup_logging() -> Result<(), Box<dyn std::error::Error>> {
    let file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(ProjectDirs::from("com", "neuronek", "cli", ).expect("Failed to get project directories").cache_dir().join("neuronek.log"))
        .context("Failed to open log file")?;

    let file_writer = file.with_max_level(Level::ERROR);

    let file_layer = tracing_subscriber::fmt::layer()
        .with_writer(file_writer)
        .with_ansi(true)
        .with_file(true)
        .with_line_number(true)
        .with_span_events(FmtSpan::CLOSE)
        .with_target(false);

    let console_layer = tracing_subscriber::fmt::layer()
        .with_writer(std::io::stdout)
        .with_ansi(true)
        .with_file(false)
        .with_line_number(true)
        .with_span_events(FmtSpan::NONE)
        .with_level(false)
        .compact()
        .pretty();

    Registry::default()
        .with(file_layer)
        .with(console_layer)
        .init();

    Ok(())
}

#[cfg(test)]
mod tests {
    use tracing::{error, info, warn};
    use super::*;

    #[test]
    fn test_logging() {
        setup_logging().unwrap();
        info!("Test log message");
        warn!("Test warning message");
        error!("Test error message");
    }
}
