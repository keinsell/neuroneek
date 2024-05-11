There is a lot to be contained in documentation but I think application should be developed from it's own core which is storing user's ingestion - so let's start from this purpose.

```
.
|-- README.md
|-- architecture
|   |-- containers
|   |   |-- API\ Gateway.md
|   |   |-- Database.md
|   |   `-- Web\ Application.md
|   |-- context-diagram.d2
|   |-- decisions
|   |   |-- 01-Technology-Stack.md
|   |   |-- 02-API-Framework.md
|   |   |-- 03-API-Deployment.md
|   |   `-- 04-Unit-Testing.md
|   |-- package-architecture.d2
|   `-- system-design.d2
|-- domain
|   |-- aggregates
|   |   |-- <aggregate_name>
|   |   |  |-- <entity_name>.md
|   |   |  |-- <aggregate_name>.md
|   |-- personas
|   |   |-- 10-john.md
|   |   |-- 20-sarah.md
|   |   |-- 30-lisa.md
|   |   |-- 40-mark.md
|   |   |-- 50-emily.md
|   |   `-- 60-max.md
|   `-- stories
|       |-- 1-dosage-tracking.md
|       |-- 2-dosage-reminders.md
|       |-- 3-stack-planning.md
|       |-- 4-possesion-tracking.md
|       |-- 5-mood-tracking.md
|       `-- 6-substance-information.md
`-- reference
```