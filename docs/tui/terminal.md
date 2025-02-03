# Terminal User Interface (TUI)

## Overview

The terminal user interface (TUI) provides an efficient, keyboard-driven interface for monitoring and managing substance ingestions. It emphasizes clarity, real-time feedback, and intuitive navigation while maintaining high information density appropriate for terminal environments.([1](https://ratatui.rs/tutorials/hello-world/))

## Interface Layout

The interface follows a classic terminal application structure with four main regions:([2](https://ratatui.rs/concepts/backends/))

```ascii
+-------------------- Header --------------------+
|  Title                              Status Bar |
+----------+-------------------------------------|
|          |                                     |
|          |                                     |
|Navigation|           Main Content              |
|  Sidebar |                                     |
|          |                                     |
|          |                                     |
+----------+-------------------------------------+
|                    Footer                      |
+------------------------------------------------+
```

### Regions

1. **Header Bar**
   - Application title and version
   - System status (time, connectivity)
   - Global navigation tabs
   - Color-coded status indicators

2. **Navigation Sidebar**
   - Primary navigation menu
   - Quick access to key views
   - Visual indicators for active section
   - Collapsible for maximum content space

3. **Main Content Area**
   - Primary information display
   - Context-specific controls
   - Dynamic data visualization
   - Scrollable content regions

4. **Footer**
   - Context-sensitive help
   - Available keyboard shortcuts
   - System messages and alerts
   - Operation status


## Screens

- Splash Screen
- Dashboard Screen
- Ingestion List
    - Ingestion View
    - IngestionCreate
    - Ingestion Update
    - Ingestion Delete
- Settings

## Core Components

### Ingestion List
The primary interface for monitoring active and historical ingestions([3](https://ratatui.rs/tutorials/counter-app/single-function/)):

- Tabular layout with sortable columns
- Real-time status updates
- Visual progress indicators
- Color-coded phase indicators
- Keyboard-driven row selection

### Phase Timeline
Visualizes the progression of substance effects:

```ascii
[Onset]-->[Come-up]-->[Peak]-->[Comedown]-->[Afterglow]
  ▰▰▱▱▱     ▰▰▰▱▱      ▰▰▰▰▱     ▰▰▰▰▰        ▰▰▰▰▰
  20%        40%        60%        80%          100%
```

### Status Indicators

- Dosage Level: `●●●○○` (3/5 intensity)
- Phase Progress: `▰▰▰▱▱` (60% complete)
- Time Remaining: `2h 15m remaining`

## Interaction Model

### Keyboard Navigation

The interface prioritizes keyboard interaction for efficiency([4](https://ratatui.rs/faq/)):

- Vim-style navigation (h/j/k/l)
- Tab-based view switching
- Context-sensitive shortcuts
- Consistent escape patterns

### Focus Management

- Single active element at a time
- Clear visual focus indicators
- Logical tab ordering
- Preserved focus state across updates

## Visual Language

### Color System

- **Phase Colors**
  - Onset: Blue (#0366d6)
  - Come-up: Green (#28a745)
  - Peak: Red (#d73a49)
  - Comedown: Yellow (#ffd33d)
  - Afterglow: Gray (#6a737d)

### Typography

- Use ASCII characters for maximum compatibility
- Consistent spacing for readability
- Clear hierarchy through indentation
- Bold for emphasis and headers

### Progress Indicators

- Block elements for phase progress: `▰▰▰▱▱`
- Circles for intensity levels: `●●●○○`
- Brackets for grouping: `[Phase]`
- Arrows for flow: `-->`

## Implementation Guidelines

### Component Architecture

Components should follow these principles([5](https://ratatui.rs/concepts/application-patterns/the-elm-architecture/)):

1. Single Responsibility
2. Self-Contained State
3. Clear Update Pattern
4. Consistent Event Handling

### Performance Considerations

- Efficient rendering cycles
- Throttled updates (250ms minimum)
- Lazy loading for large datasets
- Smart refresh strategies

### Error Handling

- Clear error messages in footer
- Non-blocking notifications
- Graceful degradation
- Recovery options

### Accessibility

- High contrast color combinations
- Screen reader compatible layouts
- Keyboard-only operation
- Clear state indicators

This documentation provides a foundation for implementing a consistent and user-friendly terminal interface that aligns with the project's goals of efficient substance ingestion monitoring and management.
