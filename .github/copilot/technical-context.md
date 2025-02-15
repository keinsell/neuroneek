# Technical Context for Neuronek

## Project Overview
Neuronek is a Rust-based substance intake tracking application that provides:
- Command-line interface for logging and tracking substance intake
- Database management for substances and ingestion records
- Analysis of ingestion timing and dosage with phase tracking
- Terminal UI for visualization and monitoring
- Real-time substance interaction tracking and alerts

## Domain Concepts
- Ingestion: A record of substance intake including dosage, time, and route
- Substance: A tracked compound with defined properties and interactions
- Phase: Time-based stages of substance effects (onset, peak, comedown)
- Route of Administration: Method of substance intake (oral, nasal, etc.)
- Dosage: Quantity measurement with classification (light, common, strong)

## Key Components
- CLI module: Handles command-line interface and user input
  - Commands: view, add, update, analyze ingestions
  - Journal: Daily view of substance intake with phase tracking
  - Formatters: Pretty and JSON output support
- Database module (SQLite via Sea-ORM):
  - Entity models for substances, ingestions, and phases
  - Migration management for schema updates
  - Relationship handling between entities
- Ingestion module:
  - Real-time phase tracking
  - Duration and intensity calculations
  - Interaction analysis
- TUI module:
  - Real-time monitoring dashboard
  - Intensity visualization
  - Phase tracking display

## Code Patterns & Architecture
- Command Pattern: All CLI operations implement CommandHandler trait
- Builder Pattern: Complex object construction (AnalyzeIngestion, etc.)
- Repository Pattern: Database access abstraction
- Type-safe enums: Substance classifications, phases, routes
- Error Handling: Custom error types with miette
- Async/Await: Database and analysis operations
- Trait-based interfaces: Formatter, QueryHandler

## Important Types & Traits
- JournalViewModel: Daily substance intake visualization
- IngestionModel: Database entity for substance intake
- AnalyzeIngestion: Substance intake analysis logic
- Formatter: Output formatting trait
- CommandHandler: CLI command execution trait
- QueryHandler: Database query abstraction

## Dependencies
- sea-orm: Database ORM and migrations
- clap: Command line argument parsing
- miette: Error handling and reporting
- chrono: Date and time handling
- serde: Serialization framework
- tabled: Table formatting
- termimad: Terminal markdown rendering
- humantime: Human-readable duration formatting

## Testing Strategy
- Unit tests for business logic and analysis
- Integration tests for database operations
- CLI interface testing with fixtures
- Error handling verification
- Phase calculation validation