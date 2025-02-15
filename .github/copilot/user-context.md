# Personal Context and Preferences

## About Me
- I am an experienced Rust developer working on a substance intake tracking application
- I prefer clean, modular code with clear separation of concerns
- I value type safety and proper error handling
- I enjoy using Rust's strong type system and pattern matching

## Code Style Preferences
- Use Rust 2021 edition features and idioms
- Prefer `Result` types for error handling over panics
- Follow Rust naming conventions (snake_case for functions, CamelCase for types)
- Use descriptive variable names that clearly indicate their purpose
- Document public APIs with thorough comments
- Implement appropriate traits (Debug, Clone, etc.) when needed
- Use proper error propagation with the `?` operator

## Architecture Preferences
- Follow domain-driven design principles
- Use the repository pattern for data access
- Separate business logic from infrastructure concerns
- Implement proper error handling with custom error types
- Use async/await for asynchronous operations
- Prefer immutable data structures when possible
- Use builder pattern for complex object construction

## Testing Preferences
- Write unit tests for business logic
- Use descriptive test names that explain the test scenario
- Follow the Arrange-Act-Assert pattern in tests
- Mock external dependencies when appropriate
- Test error cases as well as happy paths