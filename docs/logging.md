# Logging Configuration

Neuronek implements a comprehensive logging system that provides both file-based and console-based logging capabilities. The logging system is designed to be XDG-compliant and supports multiple output layers with different configurations.

## Log File Location

Log files are stored following the XDG Base Directory Specification:

- **Development/Debug Mode**: Logs are stored in the system's temporary directory as `neuronek.sqlite`
- **Production Mode**: Logs are stored in the XDG cache directory: `~/.cache/neuronek/logs/debug.log` (Linux) or equivalent on other platforms

## Logging Layers

The logging system implements two main layers:

### 1. File Appender

The file appender writes detailed logs to a file with the following characteristics:

- Includes file names and line numbers for precise error tracking
- Records thread IDs for concurrent operation debugging
- Maintains detailed context for debugging purposes
- Stores logs in the XDG-compliant directory structure

### 2. Console Appender

The console appender provides a streamlined output to stderr:

- Simplified output without file names or line numbers
- No thread IDs to keep the output clean
- ANSI color support for better readability
- Focused on user-relevant information
- Writes to stderr for clean JSON output compatibility

## Log Levels

The logging system supports multiple log levels through the `tracing` crate:

- ERROR: For critical issues that prevent normal operation
- WARN: For important issues that don't stop execution
- INFO: For general information about program operation
- DEBUG: For detailed information useful during development
- TRACE: For very detailed debugging information

By default, the logging level is set to INFO, but this can be adjusted through environment variables.

## Configuration

The logging system integrates with Neuronek's configuration system and respects the following settings:

- Log file location is determined by the application mode (debug/release)
- Environment variables can control the logging level
- XDG base directories are used for log file storage

## Usage Example

```rust
// Log messages at different levels
error!("Critical error occurred");
warn!("Warning: operation may be slow");
info!("Operation completed successfully");
debug!("Detailed debug information");
trace!("Very detailed trace information");
```

## Implementation Details

The logging system is implemented using the following crates:

- `tracing`: Core logging functionality
- `tracing-subscriber`: Logging subscriber implementation
- `etcetera`: XDG base directory handling

The setup is handled in `src/core/logging.rs` and integrates with the application's configuration system in `src/core/config.rs`.