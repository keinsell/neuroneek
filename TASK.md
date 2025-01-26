# Journal Implementation Plan

## Overview
The journal functionality will serve as a calendar-like system that tracks and displays phases from user ingestions. Unlike traditional calendars, this system needs to handle events (phases) with uncertain start and end times, making it more complex than standard calendar implementations.

## Core Components

### 1. Journal Entity
```rust
struct JournalEntry {
    id: i32,
    ingestion_id: i32,
    phase_id: String,
    expected_start_time: DateTime<Utc>,
    expected_end_time: Option<DateTime<Utc>>,
    confidence_start: f32, // 0.0-1.0 representing certainty of start time
    confidence_end: f32,   // 0.0-1.0 representing certainty of end time
    actual_start_time: Option<DateTime<Utc>>,
    actual_end_time: Option<DateTime<Utc>>,
    status: PhaseStatus,
    metadata: Json, // Additional phase-specific data
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}
```

### 2. Event Handling System
- Create event handlers for `IngestionCreated`
- Automatically generate phase entries when new ingestions are created
- Update journal entries as phases progress
- Handle phase transitions and completion states

### 3. Time Uncertainty Management
- Implement confidence scoring system for start/end times
- Use substance-specific metabolism data to estimate phase durations
- Account for individual user variations and conditions
- Provide visual indicators for time uncertainty in UI

## Implementation Steps

1. Database Schema
   - Create journal entries table
   - Add foreign key relationships to ingestions
   - Add indices for efficient time-based queries

2. Core Logic
   - Implement phase calculation system
   - Create event handlers for ingestion creation
   - Develop time uncertainty algorithms
   - Build phase transition logic

3. Query System
   - Create efficient queries for time ranges
   - Implement filtering by confidence levels
   - Add support for phase-specific queries
   - Build aggregation queries for analysis

4. API/CLI Interface
   - Add journal-specific commands
   - Implement time range queries
   - Create phase filtering options
   - Add export capabilities

5. UI Components
   - Design calendar view with uncertainty visualization
   - Implement phase timeline display
   - Add filtering and search interface
   - Create detailed phase view

## Technical Considerations

### Database Migrations
```sql
CREATE TABLE journal_entry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ingestion_id INTEGER NOT NULL,
    phase_id TEXT NOT NULL,
    expected_start_time TIMESTAMP NOT NULL,
    expected_end_time TIMESTAMP,
    confidence_start REAL NOT NULL,
    confidence_end REAL NOT NULL,
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    status TEXT NOT NULL,
    metadata JSON NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (ingestion_id) REFERENCES ingestion(id)
);

CREATE INDEX idx_journal_entry_times ON journal_entry(expected_start_time, expected_end_time);
CREATE INDEX idx_journal_entry_ingestion ON journal_entry(ingestion_id);
```

### Event System Integration
```rust
// Event handler for new ingestions
async fn handle_ingestion_created(event: IngestionCreated) -> Result<()> {
    let phases = calculate_phases_for_ingestion(event.ingestion_id).await?;
    
    for phase in phases {
        create_journal_entry(JournalEntry {
            ingestion_id: event.ingestion_id,
            phase_id: phase.id,
            expected_start_time: phase.estimated_start,
            expected_end_time: phase.estimated_end,
            confidence_start: calculate_start_confidence(&phase),
            confidence_end: calculate_end_confidence(&phase),
            status: PhaseStatus::Pending,
            // ... other fields
        }).await?;
    }
    Ok(())
}
```

## Future Enhancements

1. Machine Learning Integration
   - Train models on user data to improve time predictions
   - Develop personalized confidence scoring
   - Implement pattern recognition for phase transitions

2. Advanced Visualization
   - Heat maps for time uncertainty
   - Phase overlap visualization
   - Interactive timeline adjustments

3. Integration Features
   - Calendar export (iCal format)
   - Mobile app synchronization
   - External API access

4. Analysis Tools
   - Phase pattern analysis
   - Substance interaction tracking
   - Long-term trend visualization

## Success Criteria

1. Accurate Phase Tracking
   - Correctly generate phases for new ingestions
   - Accurate time predictions within confidence bounds
   - Proper handling of phase transitions

2. Performance
   - Fast query response times (< 100ms)
   - Efficient handling of large datasets
   - Minimal impact on ingestion creation

3. Usability
   - Intuitive calendar interface
   - Clear visualization of uncertainty
   - Easy filtering and search capabilities

4. Reliability
   - Consistent phase calculations
   - Proper error handling
   - Data integrity maintenance 