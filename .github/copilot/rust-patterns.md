# Rust-Specific Prompts

## Error Handling Patterns
```
Implement error handling for [component] using:
- miette::Result for rich error context
- Custom error types with diagnostic information
- Proper error propagation with '?'
- Clear error messages for CLI output
Consider:
- Error categorization (user, system, network)
- Recovery strategies
- Error logging implications
```

## Async Implementation
```
Implement async functionality for [feature] with:
- async-trait for trait implementations
- Proper cancellation handling
- Resource cleanup in drop implementations
- Error propagation in async contexts
Consider:
- Performance implications
- Memory usage
- Backpressure handling
```

## Database Operations
```
Implement sea-orm operations for [entity]:
- Define entity relationships
- Create migration scripts
- Implement efficient queries
- Handle transaction boundaries
Consider:
- Index optimization
- Query performance
- Concurrency patterns
```

## CLI Command Implementation
```
Implement CLI command for [feature]:
- Use CommandHandler trait
- Implement proper argument parsing
- Handle all error cases
- Provide both pretty and JSON output
Consider:
- User experience
- Error messages
- Performance impact
```

## Type Safety Patterns
```
Design type-safe interfaces for [component]:
- Use strong typing for domain concepts
- Implement proper trait bounds
- Use type state for valid states
- Handle conversion cases
Consider:
- Compile-time guarantees
- Performance implications
- API usability
```

## Testing Patterns
```
Implement tests for [component] using:
- Unit tests for core logic
- Integration tests for database ops
- Proper test fixtures
- Performance benchmarks
Consider:
- Edge cases
- Error conditions
- Resource cleanup
```

## Documentation Patterns
```
Document [component] following:
- Rust doc conventions
- Example-driven documentation
- Clear error documentation
- Implementation notes
Consider:
- Public API documentation
- Internal documentation
- Performance notes
```