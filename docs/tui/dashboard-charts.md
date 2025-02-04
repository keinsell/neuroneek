# Dashboard Charts Exploration

## Current State
- Intensity Timeline (shows active ingestions and their phases)
- Basic substance list
- Limited statistical visualization

## Proposed New Charts

### 1. Daily/Weekly Pattern View
```
Hour   Mo Tu We Th Fr Sa Su
00-04  ░░ ▓░ ░░ ░░ ▓▓ ▓░ ░░  
04-08  ░░ ░░ ░░ ░░ ░░ ░░ ░░  
08-12  ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ░░ ░░  
12-16  ▓░ ▓░ ▓░ ▓░ ▓░ ░░ ░░  
16-20  ░░ ░░ ░░ ░░ ░▓ ░░ ░░  
20-24  ░░ ░░ ░░ ░░ ▓▓ ▓░ ░░  
```
Value:
- Identify patterns in ingestion timing
- Help optimize scheduling
- Spot potential overlaps or conflicts
- Track routine adherence

### 2. Substance Interaction Timeline
```
Now
  │
  ├── Caffeine (↑)
  │   └── 2h remaining
  │
  ├── Vitamin D (→)
  │   └── 12h remaining
  │
  └── Melatonin (waiting)
      └── Recommended in 4h
```
Value:
- Show current active substances
- Indicate potential interactions
- Suggest optimal timing for next doses
- Visual warning for contraindications

### 3. Rolling Statistics View
```
Last 30 Days
     Caffeine   │▁▂▃▂▁▂▃▄▅▄▃▂│ Avg: 200mg
    Vitamin D   │▅▅▅▅▄▄▃▃▄▄▅▅│ Avg: 2000IU
   Melatonin   │░░▃▃▃▃▃░░░▃▃│ Avg: 0.3mg
```
Value:
- Track consumption patterns
- Identify trends
- Monitor adherence to recommended doses
- Visualize gaps in supplementation

### 4. Phase Distribution Chart
```
Substance: Caffeine
Phase      0   25   50   75  100%
Onset     ▓▓▓░░░░░░░░░░░░░░░░ 15%
Comeup    ░░▓▓▓▓░░░░░░░░░░░░░ 25%
Peak      ░░░░░▓▓▓▓▓░░░░░░░░░ 35%
Comedown  ░░░░░░░░▓▓▓░░░░░░░░ 15%
Afterglow ░░░░░░░░░░▓▓░░░░░░░ 10%
```
Value:
- Understand typical duration of each phase
- Plan activities around peak times
- Optimize timing of doses
- Track individual response patterns

### 5. Stacking Analysis View
```
Stack: Morning Energy
│  
├─ Caffeine (200mg)
│  └─ Synergy: B-Complex (+15% effect)
│
└─ B-Complex
   └─ Recommended: Take with food
```
Value:
- Visualize supplement stacks
- Show synergies and interactions
- Timing recommendations
- Optimization suggestions

### 6. Tolerance/Effectiveness Tracker
```
Caffeine Effectiveness
Past 3 months

Desired Effect  ▁▁▂▂▃▃▄▄▅▅▆▆
Actual Effect   ▁▂▂▃▃▃▂▂▁▁▁▂
Tolerance       ░░░▒▒▓▓▓▓▒▒░
```
Value:
- Track substance effectiveness over time
- Monitor tolerance development
- Suggest tolerance breaks
- Compare expected vs actual effects

## Implementation Priority

1. **Phase 1: Essential Information**
   - Substance Interaction Timeline
   - Rolling Statistics View
   
2. **Phase 2: Pattern Analysis**
   - Daily/Weekly Pattern View
   - Phase Distribution Chart
   
3. **Phase 3: Advanced Features**
   - Stacking Analysis View
   - Tolerance/Effectiveness Tracker

## Technical Considerations

### Data Requirements
- Historical ingestion data
- Substance interaction database
- User feedback on effectiveness
- Time-series analytics

### Performance
- Efficient data aggregation
- Smart caching for statistics
- Responsive updates
- Memory-efficient representations

### User Experience
- Clear visual hierarchy
- Intuitive navigation
- Consistent styling
- Keyboard shortcuts

## Next Steps

1. Validate chart concepts with users
2. Implement highest priority views
3. Gather feedback on usefulness
4. Iterate on designs based on usage
5. Add interactivity features
