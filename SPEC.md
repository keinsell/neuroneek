# Technical Specification

## System Overview
Neuronek is an intelligent dosage tracking application designed to monitor and log the use of supplements, nootropics, and psychoactive substances. The system aims to help users understand the long-term effects of these compounds on their physical and mental health. The application consists of a command-line interface (CLI) for data entry and management, a SQLite database for storage, and a terminal user interface (TUI) for data visualization.

### Main Components
- **CLI**: Handles user interactions for logging, updating, listing, and retrieving ingestion records.
- **Database**: Stores ingestion and substance data using SQLite.
- **TUI**: Provides a visual representation of ingestion data, including intensity plots.

## Core Functionality

### Primary Exported Functions and Core Behavior

#### `src/main.rs`
- **Importance Score: 90**
- **Core Behavior**: 
  - `main` function initializes the application, sets up diagnostics, and handles CLI commands.
  - `setup_diagnostics` initializes error handling.
  - `setup_logger` sets up logging.
  - `migrate_database` ensures the database is up-to-date.

#### `src/cli/ingestion.rs`
- **Importance Score: 85**
- **Core Behavior**:
  - `LogIngestion` struct and its `handle` method log new ingestions.
  - `UpdateIngestion` struct and its `handle` method update existing ingestions.
  - `ListIngestion` struct and its `handle` method list ingestions.
  - `GetIngestion` struct and its `handle` method retrieve a specific ingestion.

#### `src/cli/journal.rs`
- **Importance Score: 80**
- **Core Behavior**:
  - `ViewJournal` struct and its `handle` method display the ingestion journal.

### Core Data Models and Interfaces

#### `src/database/entities/ingestion.rs`
- **Importance Score: 95**
- **Core Data Model**:
  - `Ingestion` struct represents an ingestion record.
  - `IngestionPhase` struct represents phases of an ingestion.

#### `src/database/entities/substance.rs`
- **Importance Score: 90**
- **Core Data Model**:
  - `Substance` struct represents a substance with its routes of administration.
  - `RouteOfAdministration` struct represents different routes of administration.
  - `Dosage` and `DosageClassification` structs handle dosage-related data.

### Main Connection Points with Other System Parts

#### `src/utils.rs`
- **Importance Score: 85**
- **Core Behavior**:
  - `AppContext` struct provides context for database operations and output formatting.
  - `DATABASE_CONNECTION` is a lazy-static reference to the database connection.

#### `src/core/config.rs`
- **Importance Score: 80**
- **Core Behavior**:
  - `Config` struct defines configuration settings, including the SQLite database path.

### Complex Business Logic or Algorithms

#### `src/ingestion/query.rs`
- **Importance Score: 85**
- **Core Behavior**:
  - `AnalyzeIngestion` struct and its `query` method analyze ingestion data, determining phases and dosage classifications.

#### `src/substance/repository.rs`
- **Importance Score: 85**
- **Core Behavior**:
  - `get_substance` function retrieves substance data from the database, including routes of administration and dosages.

### Critical Logic or Data Flow

#### `src/cli/mod.rs`
- **Importance Score: 80**
- **Core Behavior**:
  - Defines the `ApplicationCommands` enum which routes CLI commands to their respective handlers.

#### `src/core/mod.rs`
- **Importance Score: 80**
- **Core Behavior**:
  - Defines the `CommandHandler` and `QueryHandler` traits, which are implemented by various command and query structs to handle application logic.

### Important Configuration and Build Files

#### `Cargo.toml`
- **Importance Score: 90**
- **Core Behavior**:
  - Defines dependencies and build configurations for the project.
  - Specifies the nightly Rust toolchain and various dependencies for database operations, CLI parsing, and more.

#### `.github/workflows/main.yaml`
- **Importance Score: 70**
- **Core Behavior**:
  - Defines CI/CD workflows for linting, building, and testing the application.

## Architecture

### Data Flow
1. **User Input**: Users interact with the CLI to log, update, list, or retrieve ingestion records.
2. **CLI Handling**: Commands are routed through `src/cli/mod.rs` to their respective handlers (`LogIngestion`, `UpdateIngestion`, `ListIngestion`, `GetIngestion`).
3. **Database Operations**: Handlers use `AppContext` from `src/utils.rs` to interact with the SQLite database via `DATABASE_CONNECTION`.
4. **Data Storage**: Ingestion and substance data are stored in the SQLite database, managed by entities defined in `src/database/entities/`.
5. **Data Retrieval and Analysis**: Queries are handled by `AnalyzeIngestion` in `src/ingestion/query.rs` to analyze ingestion data.
6. **Output**: Results are formatted and displayed to the user via the CLI or visualized in the TUI.