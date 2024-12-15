# Psylog

🧬 Intelligent dosage tracker application for monitoring supplements, nootropics and psychoactive substances along with
their long-term influence on one's mind and body.

## About

Psylog is an intelligent dosage tracking application designed to monitor and log the use of supplements, nootropics, and
psychoactive substances. By recording and analyzing ingestions, it helps users better understand the long-term effects
of these compounds on their physical and mental health.

The project originated as a streamlined, minimal viable product (MVP), branching out from
the [Neuronek](https://github.com/keinsell/neuronek) project. While Neuronek focuses on broader neurological insights,
Psylog provides a laser-focused solution for personal consumption tracking and journaling, offering a simple yet robust
interface to build meaningful reports and integrations.

## Usage

### Installation

To install the application, please visit the [GitHub Releases Page](https://github.com/keinsell/psylog/releases) for
pre-built binaries and installation instructions for your platform.

#### Installation from source

Application can be installed with `cargo` and providing url to this repository,
this may be the most conformable way for users which are looking for the latest version of application.

```
cargo install --git https://github.com/keinsell/psylog
```

## Features

### Ingestions

Ingestions are "low-level" database of ingested compounds, it may seem raw for users however they will be abstracted to
different interfaces, for example user would be able to use command like `psylog a coffee` which will automatically add
necessary ingestions, there will be also human-friendly journal and information-oriented journal with JSON interface to
integrate it with other tools.

#### Log Ingestion

The `Log Ingestion` feature is the core functionality of Psylog,
enabling users to record information about any substances they consume.
This feature is designed for tracking supplements, medications, nootropics,
or any psychoactive substances in a structured and organized way.

By logging ingestion, users can provide details such as the substance name, dosage, and the time of ingestion.
This data is stored in a low-level database that serves as the foundation for further features,
such as journaling, analytics, or integrations with external tools.
While power users may prefer to work directly with this raw data,
many user-friendly abstractions are planned to make this process seamless,
such as simplified commands (e.g., `psylog a coffee`) for quicker entries.

Logging ingestions not only serves the purpose of record-keeping
but also helps users build a personalized database of their consumption habits.
This database can be used to analyze trends over time,
providing insights into the long-term effects of different substances on physical and mental well-being.

An example usage of the `log ingestion` feature is shown below:

```
❯ psylog ingestion log caffeine 80mg

+----+----------------+--------+----------------------+-------------------------------+
| id | substance_name | route  | dosage               | ingested_at                   |
+----+----------------+--------+----------------------+-------------------------------+
| 1  | caffeine       | "oral" | 79.99999797903001 mg | 2024-12-16 00:02:48.977457    |
+----+----------------+--------+----------------------+-------------------------------+
```

In this example:

- The user logs ingestion of 80 mg of caffeine.
- The system automatically calculates and records a precise dosage, time of ingestion, and assigns a unique entry ID.
- Data saved in this format can be easily retrieved, updated, or removed as needed.

Ultimately, the `Log Ingestion` feature provides a powerful way to centralize all ingestion data,
which can be accessed programmatically (e.g., via JSON) or through additional human-friendly journal views.
Psylog aims to make tracking consumption efficient,
ensuring that users stay informed about their habits and their long-term impact on health.

##### List Ingestions

```
❯ psylog ingestion list

+----+----------------+---------------+----------------------+----------------------------+
| id | substance_name | route         | dosage               | ingested_at                |
+----+----------------+---------------+----------------------+----------------------------+
| 36 | caffeine       | "oral"        | 80 mg               | 2024-12-18 08:14:37.211076 |
+----+----------------+---------------+----------------------+----------------------------+
```

##### Get Ingestion

##### Update ingestion

The `Update Ingestion` feature allows users to modify existing ingestion records after they've been created. All fields except `id` and `created_at` can be updated, providing flexibility in maintaining accurate records. This is particularly useful when correcting data entry errors or adding additional information to an existing record.

Users can update ingestions using the following command structure:
```psylog ingestion update <id> [options]```

Available update options:
- `-d, --dosage`: Modify the substance dosage
- `-r, --route`: Change the route of administration
- `-s, --substance`: Update the substance name
- `-t, --time`: Adjust the ingestion timestamp (can be represented in a relative format eg. "now" or "1 hour ago")

```
❯ psylog ingestion list

+----+----------------+---------------+----------------------+----------------------------+
| id | substance_name | route         | dosage               | ingested_at                |
+----+----------------+---------------+----------------------+----------------------------+
| 36 | caffeine       | "oral"        | 80 mg               | 2024-12-18 08:14:37.211076 |
+----+----------------+---------------+----------------------+----------------------------+

❯ psylog ingestion update 36 -d 200mg

+----+----------------+---------------+----------------------+----------------------------+
| id | substance_name | route         | dosage               | ingested_at                |
+----+----------------+---------------+----------------------+----------------------------+
| 36 | caffeine       | "oral"        | 200 mg               | 2024-12-18 08:14:37.211076 |
+----+----------------+---------------+----------------------+----------------------------+
```

##### Delete Ingestion

### Substances

Application comes with pre-bundled database of psychoactive substances built on top
of [PsychonautWiki](https://psychonautwiki.org), such information are easily queryable through CLI and are foundation
for further analysis of user's ingestions to provide insight on harm-reduction and predicting subjective effects.

#### Find Substance

TODO: Feature should use humanized search index which will allow for typos and words with same meaning (common names).

#### Get Substance

TODO: Show all information about substance in way ingest-able for end-user which should be able to learn dosages, routes
of administration and maybe overall description of substance.

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## Contributing

Project do not expect any external contribution. If you want to contribute, please take a look
at [keinsell/neuronek](https://github.com/keinsell/neuronek)
project or contact me directly via [keinsell@protonmail.com]() and we can discuss the project together and move code to
organization out of my profile.

## License

Read the [LICENSE](LICENSE) file for more information.
