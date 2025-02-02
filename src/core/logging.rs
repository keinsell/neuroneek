use etcetera::base_strategy::{BaseStrategy, Xdg};
use std::fs::create_dir_all;
use tracing_subscriber::{fmt, prelude::*, EnvFilter};
use tracing_appender::rolling::{RollingFileAppender, Rotation};
use tracing_appender::non_blocking::WorkerGuard;

pub fn setup_logger() -> Result<WorkerGuard, Box<dyn std::error::Error>> {
    let xdg = Xdg::new()?.cache_dir().join("neuronek").join("logs");
    create_dir_all(&xdg)?;

    let file_appender = RollingFileAppender::new(
        Rotation::DAILY,
        &xdg,
        "neuronek"
    );
    
    let (non_blocking_appender, guard) = tracing_appender::non_blocking(file_appender);

    let file_layer = fmt::layer()
        .with_file(true)
        .with_line_number(true)
        .with_thread_ids(true)
        .with_target(false)
        .with_writer(non_blocking_appender);


   #[cfg(debug_assertions)]
    let console_layer = {
        fmt::layer()
            .with_target(false)
            .with_thread_ids(false)
            .with_file(false)
            .with_line_number(false)
            .with_ansi(true)
            .compact()
            .pretty()
            .with_writer(std::io::stderr)
    };

    let registry = tracing_subscriber::registry()
        .with(
            EnvFilter::from_default_env()
                .add_directive(tracing::Level::INFO.into())
        )
        .with(file_layer);

    #[cfg(debug_assertions)]
    let registry = registry.with(console_layer);

    registry.init();

    
    Ok(guard)
}
