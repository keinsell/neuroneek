# Home Dashboard Implementation Task

## Overview
Create a focused terminal-based dashboard that displays active substance ingestions and their analysis data. The dashboard will use existing components to show current state and near-future projections of substance effects.

## Core Components

### 1. Active Substances Panel (`render_active_stacks`)
- Display list of current active ingestions:
    - Substance name
    - Dosage amount and unit
    - Time since ingestion (calculated from ingested_at)
    - Status indicators based on IngestionAnalysis data
    - Warning highlight for substances nearing effect end
- Sort by ingestion time
- Auto-refresh when data changes

### 2. Effect Timeline (`render_timeline`)
- Implementation using DashboardCharts:
    - X-axis: Current time to +12h window
    - Y-axis: Effect intensity
    - Plot points from IngestionAnalysis data
    - Current time marker
    - Individual substance effect curves
    - Combined effect visualization
- Update frequency: Real-time with data changes

### 3. Performance Metrics (`render_performance_metrics`)
- Real-time gauges showing:
    - Focus Level (derived from IngestionAnalysis cognitive metrics)
    - Energy Level (calculated from active stimulant effects)
    - Cognitive Load (aggregate from active substances)
- Values derived from IngestionAnalysis data
- Update when underlying data changes
- Warning indicators for high threshold values

### 4. Statistics Bar (`render_stats_bar`)
- Key metrics:
    - Active substances count
    - Unique substances count
    - Total active dosages
    - Next effect phase change prediction
    - Substances in decline phase count

## Technical Requirements

### Data Integration
- Primary data source: IngestionAnalysis model
- Real-time updates when ingestion data changes
- Efficient data processing for display
- Proper handling of missing or incomplete analysis data


### UI Implementation
- Utilize existing render functions:
    - render_stats_bar
    - render_active_stacks
    - render_performance_metrics
    - render_timeline
- Ensure proper error handling for missing data
- Maintain responsive UI updates
- Consistent color scheme for status indicators

### Performance Goals
- Update latency under 100ms
- Efficient memory usage
- Smooth UI transitions
- Optimized refresh cycles

## Success Criteria
1. Data Accuracy
    - All components correctly reflect IngestionAnalysis data
    - Proper calculation of derived metrics
    - Accurate time-based calculations

2. User Interface
    - Clear information hierarchy
    - Readable data presentation
    - Responsive layout
    - Effective warning indicators

3. Technical Performance
    - Real-time updates working correctly
    - Smooth UI transitions
    - Proper error handling for edge cases
    - Efficient resource utilization
