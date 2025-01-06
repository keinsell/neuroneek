# Substance

```
Substance
├── id
├── name
└── routes_of_administration
    └── [for of RouteOfAdministrationClassification]: SubstanceAdministrationRoute
        ├── oral
        │   ├── dosages 
        │   │   └── [for of DosageClassification]
        │   │       ├── theresold: DosageRange
        │   │       ├── light: DosageRange
        │   │       ├── common: DosageRange
        │   │       ├── strong: DosageRange
        │   │       └── heavy: DosageRange
        │   └── phases
        │       └── [for of PhaseClassification]
        │           ├── onset: DurationRange
        │           ├── comeup: DurationRange
        │           ├── peak: DurationRange
        │           ├── offset: DurationRange
        │           └── afterglow: DurationRange
        ├── insufflated
        ├── buccal
        ├── inhaled
        ├── intramuscular
        ├── intravenous
        ├── rectal
        ├── smoked
        ├── sublingual
        └── transdermal
```