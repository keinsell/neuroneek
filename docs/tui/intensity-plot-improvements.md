# Intensity Plot Improvements

## Current Implementation Analysis

### Strengths
- Real-time updates of ingestion phases
- Multiple substance visualization
- Clear phase transitions
- Time-based x-axis with "now" marker

### Limitations
1. Limited context about phase meanings
2. No visual distinction between phase intensities
3. Basic line representation might not convey the full experience
4. Missing substance-specific characteristics
5. No visual indicators for dosage classification

## Proposed Improvements

### 1. Enhanced Phase Visualization
- Use different line styles for different phases
  - Onset: Dotted line (gradual beginning)
  - Come-up: Dashed line (transitional)
  - Peak: Solid line (stable phase)
  - Comedown: Dashed line (transitional)
  - Afterglow: Dotted line (gradual end)

### 2. Intensity Levels
- Add horizontal grid lines at key intensity levels (0%, 25%, 50%, 75%, 100%)
- Color-code intensity ranges:
  - Peak zone (80-100%): Red
  - High intensity (60-80%): Orange
  - Medium intensity (40-60%): Yellow
  - Low intensity (20-40%): Green
  - Minimal (0-20%): Blue

### 3. Phase Information
- Add small markers at phase transition points
- Show phase names on hover/select
- Include expected duration for each phase
- Add small icons representing phase characteristics

### 4. Time Context
- Add relative time markers ("now", "+1h", "+2h", etc.)
- Show expected end time
- Mark significant time points (e.g., peak start/end)

### 5. Substance Context
- Include substance-specific expected duration ranges
- Show typical intensity patterns
- Indicate unusual patterns or variations
- Display dosage classification influence

### 6. Interactive Elements
- Highlight current phase
- Show detailed phase information on hover
- Allow zooming into specific time ranges
- Enable toggling between substances

## Implementation Priority

1. **Phase 1: Basic Improvements**
   - Add intensity level grid lines
   - Implement phase-specific line styles
   - Add phase transition markers
   - Improve time axis labels

2. **Phase 2: Enhanced Information**
   - Add substance-specific context
   - Implement phase information display
   - Add color-coding for intensity ranges

3. **Phase 3: Interaction**
   - Add hover/select functionality
   - Implement zoom capabilities
   - Add detailed information display

## Technical Considerations

### Performance
- Optimize rendering for multiple substances
- Efficient update mechanism for real-time changes
- Smart data point interpolation

### Accessibility
- Ensure color schemes are colorblind-friendly
- Provide alternative text representations
- Make interactive elements keyboard-accessible

### Maintainability
- Modular component structure
- Clear separation of rendering and data logic
- Reusable styling and animation components

## Next Steps

1. Implement basic grid lines and phase-specific line styles
2. Add phase transition markers
3. Improve time axis with relative labels
4. Test with various substance combinations
5. Gather user feedback on initial improvements
