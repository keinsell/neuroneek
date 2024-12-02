# Persistence Mechanisms

## Purpose of Persistence

Persistence in the application is essential for storing dosage data and configuration settings. This ensures that the data is retained between application restarts and can be accessed and modified as needed.

## Use of SQLite

The application uses SQLite as the database engine. The database path is specified in the `Config` struct in `src/config.rs`. The database connection is established in `src/state.rs` using the `DATABASE_CONNECTION` static variable.

## Use of `sea-orm` Library

The `sea-orm` library is used for ORM (Object-Relational Mapping) and managing database interactions. Migrations are handled using `sea-orm-migration` and are defined in `src/database/migrations`. The `Migrator` struct in `src/database/mod.rs` manages the migrations. The `ingestion` table schema is defined in `src/database/ingestion.rs`. The main function in `src/main.rs` applies pending migrations on startup. Configuration is loaded from a JSON file, with a default configuration created if none exists, as seen in `src/config.rs`.
