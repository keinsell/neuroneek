# Code Style Preferences

## Rust Conventions

### Formatting
- Use 4 spaces for indentation
- Newline before opening brace for blocks
- Keep struct/enum fields aligned
- Separate modules with double newlines

### Error Handling
- Use miette::Result for error handling
- Implement custom error types for domain-specific errors
- Use IntoDiagnostic for converting external errors
- Prefer ? operator over match for error propagation

### Naming
- Use snake_case for functions and variables
- Use PascalCase for types and traits
- Use SCREAMING_SNAKE_CASE for constants
- Prefix boolean variables with `is_`, `has_`, etc.

### Documentation
- Document all public items
- Include examples in doc comments for complex functionality
- Use /// for doc comments, // for implementation notes
- Reference related types and modules in docs

### Architecture
- Implement CommandHandler for CLI commands
- Use Builder pattern for complex object construction
- Implement Formatter trait for output formatting
- Follow Repository pattern for database access

### Async Code
- Use async/await for database operations
- Implement async_trait for async trait methods
- Handle cancellation appropriately
- Use proper error propagation in async contexts

### Testing
- Write unit tests for business logic
- Use integration tests for database operations
- Follow Given/When/Then pattern in test organization
- Test error cases explicitly

## Domain-Specific Patterns

### Ingestion Handling
- Track all measurements in base units (mg)
- Use strong typing for classifications
- Implement proper phase calculations
- Handle timezone conversions explicitly

### Data Display
- Use termimad for formatted output
- Follow consistent color scheme
- Provide both pretty and JSON output
- Use clear status indicators

### Database Operations
- Use migrations for schema changes
- Implement proper relationship handling
- Follow sea-orm patterns
- Handle transactions appropriately