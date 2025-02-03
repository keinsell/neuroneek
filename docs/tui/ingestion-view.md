# Ingestion View

Displays core ingestion data with optional phase information and substance reference data when available.

## Required Information

### Core Details
```
┌─ Required Data ──────────────────────────────────────┐
│ ID: ing_2023110114                                   │
│ Substance: Caffeine                                  │
│ Dosage: 200mg (or "~200mg" if estimated)            │
│ Route: Oral                                          │
│ Time: 2023-11-01 14:00 UTC                          │
└──────────────────────────────────────────────────────┘
```

### Basic Timeline
```
Ingested: 2h 15m ago
[14:00]─────────[Now]
```

## Optional Information

### Substance Reference (if available)
```
┌─ Reference Data ─────────────────────────────────────┐
│ Database ID: sub_caffeine_001                        │
│ Known Phases: Yes                                    │
│ Reference Ranges Available: Yes                      │
└──────────────────────────────────────────────────────┘
```

### Dosage Classification (if reference available)
```
┌─ Dosage Analysis ────────────────────────────────────┐
│ Classification: MODERATE                             │
│ Range: 200mg (within 150-300mg normal range)        │
└──────────────────────────────────────────────────────┘
```

### Phase Information (if analyzable)
```
Timeline:
O[==]C[===]P[========]F[====]
14:00 14:30  15:00    17:00  18:00
              ▲ Now

Details:
┌─Phase────┬─Start─┬─Duration─┬─Status─┐
│ Onset    │ 14:00 │ 30m     │ Done   │
│ Come-up  │ 14:30 │ 30m     │ Done   │
│ Peak     │ 15:00 │ 120m    │ Active │
│ Offset   │ 17:00 │ 60m     │ -      │
└──────────┴───────┴─────────┴────────┘
```

### Partial/Unknown Information Support
```
┌─ Partial Information ───────────────────────────────┐
│ Dosage: Range 150-200mg                            │
│ Time: Between 14:00-14:30 UTC                      │
│ Duration: Unknown                                  │
└─────────────────────────────────────────────────────┘
```

