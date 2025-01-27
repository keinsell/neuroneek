# Home Dashboard

The Home Dashboard provides a comprehensive overview of active substance ingestions and their current states. The interface consists of three core sections:

## Layout Structure

### 1. Statistics Bar
A horizontal bar at the top showing key metrics:
- Active ingestions count
- Number of unique substances
- Total combined dosage in mg
- Time until next phase change
- Number of substances in comedown phase

### 2. Main Content Area (70%)
Contains the dashboard charts that visualize:
- Intensity patterns
- Phase distributions
- Timeline correlations
- Key event markers

### 3. Timeline Sidebar (30%)
A chronological display of ingestions that shows:
- Substance names and dosages
- Current phases and timestamps
- Progress indicators
- Status markers

## Implementation Details

### Data Flow
The view receives:
- Active ingestion records
- Associated analysis data for each ingestion
- Phase classification data

### Rendering Pipeline
1. Layouts are computed using ratatui constraints
2. Statistics are calculated from active ingestions
3. Dashboard charts are rendered via DashboardCharts
4. Timeline is rendered via TimelineSidebar

### Key Features
- Real-time updates of phase changes
- Automatic unit conversion for dosages
- Phase-aware status tracking
- Integrated error handling

## Technical Architecture

### Component Hierarchy
```
Home
├─ Statistics Bar
├─ Dashboard Charts
│  ├─ Intensity Graph
│  └─ Status Panels
└─ Timeline Sidebar
```

### Data Dependencies
- `Ingestion` records
- `IngestionAnalysis` data
- Phase classification
- Theme configuration

### Error Handling
All rendering operations return `miette::Result` to ensure proper error propagation and handling.
