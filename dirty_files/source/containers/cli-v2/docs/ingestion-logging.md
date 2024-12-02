---
id: "IJ-1"
title: "Ingestion Logging"
document_type: "story"
author: @keinsell
---

# Ingestion Logging

Application introduces concept of "Ingestion Journal" which holds information about ingestions made by user (also known as "Subject") of application. Ingestion logging is important practice used in psychonautics, neurohacking and or even taking daily supplements to just remember what was ingested to avoid duplicate ingestions or do not skip daily ingestions. Ingestions are stored locally and eventually will be synchronized with external server (as encrypted information) however that's optional feature.

```
> neuronek ingestion create -s "Caffeine" -d "100mg" -r "oral"

// Ingestion "happy-pikachu" was created successfully.
```

Logging of ingestions should be plain and simple, allowing users to quickly log their ingestions and do not "feel effort" to do such, even for command-line application there should be "humanized" interface applied where users are able to use relative date or skip information when they do not know everything.

```
> neuronek ingestion create -s "Caffeine" -d "100mg" -at "30m ago" -r "oral"

// Ingestion "angry-charizzard" was created successfully.
// -----------------------------------------------------
// id: 13
// date: 30m ago (10 October 2013 12:30)
// substance: Caffeine
// administrated_by: Oral
// dosage: 100mg
// -----------------------------------------------------
```

Future iterations over this feature may include integration with analysis services which will utilize available amount of information to present analysis of ingestion to user just after one have inputed data into application.

  
```
> neuronek ingestion create -s "Caffeine" -d "100mg" -r "oral"

🧪 Caffeine
-------------------
Method: 🥤 Oral
Date: 📅 Now
Dosage: [###--] Common (100mg)
Duration: [#-----] 4 hours left (Onset for 30m) 
------------------
```

## Specification

- `log_ingestion` require information about `substance`, `dosage`, `administration_date` (defaults to `now`) and `route_of_administration` (defaults to `oral`)
- `log_ingestion` may contain `notes` which allow user to describe ingestion.

## Detailed Logging

The `log_ingestion` function captures detailed information about the ingestion process. This includes the substance name, dosage, route of administration, and ingestion date. The function uses the `tracing` crate to log this information at different log levels, such as `info` and `error`.

## Error Handling

The `log_ingestion` function uses the `anyhow` crate to add context to errors, providing more detailed information about the source of the error. It also uses the `thiserror` crate to define custom error types, making it easier to identify and handle different types of errors.

## Usage

To log an ingestion, use the following command:

```
neuronek ingestion create -s "SubstanceName" -d "Dosage" -r "RouteOfAdministration" -t "IngestionDate"
```

### Parameters

- `substance_name`: The name of the substance being ingested.
- `dosage_unit`: The unit of measurement for the dosage (e.g., mg, g, ml).
- `dosage_amount`: The amount of the substance being ingested.
- `ingestion_date`: The date and time of ingestion. This can be provided as a timestamp or in a human-readable format such as "today 10:00", "yesterday 13:00", "monday 15:34".
- `route_of_administration`: The route of administration for the substance (e.g., oral, inhaled, sublingual).

### Example

```
neuronek ingestion create -s "Caffeine" -d "100mg" -r "oral" -t "today 10:00"
```

This command logs an ingestion of 100mg of Caffeine taken orally at 10:00 AM today.
