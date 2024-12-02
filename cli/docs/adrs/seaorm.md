# DRAFT: Why SeaORM?

## Status

Accepted

## Context

The application needs a reliable persistence mechanism to store dosage data and configuration settings. Key requirements include:

- Local storage without need for external server
- Support for structured data with relationships
- Ability to handle concurrent access
- Simple deployment and maintenance
- Support for migrations and schema evolution

## Decision

We chose SQLite as the database engine with Sea-ORM as the ORM layer. Specifically:

- SQLite for data storage
- Sea-ORM for database interactions and ORM
- sea-orm-migration for schema migrations

## Rationale

### SQLite
- Self-contained, serverless database that requires zero configuration
- Single file storage ideal for desktop applications
- ACID compliant with excellent reliability
- Wide community support and proven stability
- No separate database server process needed

### Sea-ORM
- Type-safe database interactions
- Async support out of the box
- Strong migration support
- Active maintenance and good documentation
- Good integration with SQLite
- Supports both sync and async operations

## Consequences

### Positive
- Simple deployment - database is just a file
- Zero configuration needed for end users
- Type-safe database operations
- Built-in migration support
- Good developer experience with ORM

### Negative
- Limited concurrent write performance (SQLite limitation)
- No built-in network access (by design)
- Learning curve for Sea-ORM concepts

## References
- [Sea-ORM Documentation](https://www.sea-ql.org/SeaORM/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
