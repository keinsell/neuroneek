use std::fs::OpenOptions;
use tracing::Level;
use tracing_subscriber::{prelude::*, Registry};
use tracing_subscriber::fmt::format::FmtSpan;
use anyhow::{Context, Result};

pub fn setup_logging() -> Result<(), Box<dyn std::error::Error>> {
    let file = OpenOptions::new()
        .create(true)
        .append(true)
        .open("neuronek_logs.log")
        .context("Failed to open log file")?;

    let file_writer = file.with_max_level(Level::INFO);

    let file_layer = tracing_subscriber::fmt::layer()
        .with_writer(file_writer)
        .with_ansi(false)
        .with_thread_ids(true)
        .with_thread_names(true)
        .with_file(true)
        .with_line_number(true)
        .with_span_events(FmtSpan::CLOSE)
        .with_target(false);

    let console_layer = tracing_subscriber::fmt::layer()
        .with_span_events(FmtSpan::CLOSE)
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
