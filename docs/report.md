# Report


````
┌────────────────────────────────────────────┐
│ Ingestion Details: Caffeine (200 mg oral)   │
├────────────────────────────────────────────┤
│ Started: 17:21 UTC                         │
│ Estimated End: 20:21 UTC                   │
│ Current Phase: Afterglow (Low Intensity)   │
├────────────────────────────────────────────┤
│ Progress: ██████████████░░░░░░░░░ (60%)   │
└────────────────────────────────────────────┘
````

```
┌──────────────────────────────────────────┐
│ Caffeine (200 mg oral)                     │
│ Started: 17:21 UTC,  End: ~20:21 UTC      │
│ Phase: Afterglow (Low Intensity)         │
├──────────────────────────────────────────┤
│ Progress: ██████████░░░░░░░░ (60%)        │
└──────────────────────────────────────────┘
```


```
// ... existing code ...
│ ─────── Phase Timeline ───────                                                                │
│                                                                                               │
│  Onset     Come-up      Peak       Comedown     Afterglow                                        │
│  [========>--] [========>--] [========] [========] [========]                                     │
│   ████████████████████████████████████│
│   14:30     15:00      16:30      19:30      21:00      22:00      
```


```
(.)--O-->(.)--C--> (*)--P--> (.)--CD--> (.)--A--> O
  Now           Expected Peak
```

```
|----+----+----+----+----+----+----+----+----+----|  Timeline
O    C         P              CD         A         E  (Phase Initials)
^ Current Position
```

```
┌─[Timeline]──────────────────────────────────────────────────────────────────┐
│ [Onset]----[Comeup]----[Peak]==========|--------[Afterglow]                 │
│ 17:21     17:26     17:36         18:21          19:21                      │
│                                 ▲                                           │
│                                 │ Now: 18:36                                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

```
┌─[Ingestion Progress]──────────────────────────┐ ┌─[Phase Details]───────────┐
│ Overall: [========================-----] 75%   │ │ Current: Peak             │
│ ├─> Up Effects: [===================▨----] 83%  │ │ Intensity: █████░░░░░    │
│ └─> Afterglow:  [▨------------------------] 0% │ │ Duration: 45m (15m left) │
└───────────────────────────────────────────────┘ └───────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Ingestion: Caffeine (10mg, oral)  ● Active            2023-10-27 17:21 UTC   │
└──────────────────────────────────────────────────────────────────────────────┘
```

```
┌───────────────┬───────┬─────────┬────────┐
│ Phase         │ Prog │ Dur     │ Int    │
├───────────────┼───────┼─────────┼────────┤
│ Onset         │██████ │ 5min    │(Green) │
│ Come-up       │██████████████████│10min   │(Yellow)│
│ Peak          │████████████████████████████████████████████████│45min   │(Red)   │
│ Comedown      │██████████████████░░░░░░░░░░░░░░░░░░░░░░│39min   │(Orange)│
│ Afterglow     │████████████████████████████░░░░░░░░░░░░░░│81min   │(Blue)  │
└───────────────┴───────┴─────────┴────────┘
Total Progress: 60%
```

