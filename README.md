# Neuronek

🧬 Intelligent dosage tracker application for monitoring supplements, nootropics and psychoactive substances along with
their long-term influence on one's mind and body.

![preview](docs/assets/log_ingestion_preview.png)

## About

Neuronek is an intelligent dosage tracking application designed to monitor and log the use of supplements, nootropics,
and
psychoactive substances. By recording and analyzing ingestion, it helps users better understand the long-term effects
of these compounds on their physical and mental health.

Features offered by application include:

- **Ingestion journaling** with set of commands which allows for inserting, updating, retrieving and deleting all the
  data stored as `Ingestion` model.

## Installation

To install the application, please visit the [GitHub Releases Page](https://github.com/keinsell/neuronek/releases) for
pre-built binaries and installation instructions for your platform. Alternatively, you can install the application from
supported package managers or build it from source.

#### Using a package manager (recommended)

> [!WARNING]
> Application is in early stage of development and to avoid polluting package managers with application that can be
> potentially dead in few months I do recommend installing from source or using available pre-build binaries.
> Application will be available for `homebrew`, `pacman`, `nix`, `scoop`, `dnf` and `apt` when it would be considered
> production-ready.

#### Installation from source (Advanced)

Application can be installed with `cargo` and providing url to this repository,
this may be the most conformable way for users which are looking for the latest version of application.

```
cargo install --git https://github.com/keinsell/neuronek
```

**Note:** This method might be best for users who always want the absolute newest version of the application. However,
it may be less stable than the pre-built binaries.

```bash
❯ neuronek --help
```

## Usage

### Ingestion Journaling

Ingestions are fundamental area of application, they represent human interaction with chemical compound of choice.
Ingestion explains what compound was ingested, how it was ingested and when it was ingested. Application expose simple,
scriptable interface which allows for storage and retrieval of structured data.

#### [🗎 Log Ingestion](https://keinsell.youtrack.cloud/articles/NEU-A-3)

```bash
❯ neuronek ingestion log caffeine 80mg
╭────┬───────────┬──────┬─────────┬────────────────╮
│ ID │ Substance │ ROA  │ Dosage  │ Ingestion Date │
├────┼───────────┼──────┼─────────┼────────────────┤
│ 14 │ caffeine  │ Oral │ 80.0 mg │      now       │
╰────┴───────────┴──────┴─────────┴────────────────╯
```

#### [🗎 List Ingestions](https://keinsell.youtrack.cloud/articles/NEU-A-7)

```bash
❯ neuronek ingestion list
┌────┬─────────────────────┬──────┬─────────┬────────────────┐
│ ID │ Substance           │ ROA  │ Dosage  │ Ingestion Date │
├────┼─────────────────────┼──────┼─────────┼────────────────┤
│ 14 │ caffeine            │ Oral │ 80.0 mg │ 20 seconds ago │
├────┼─────────────────────┼──────┼─────────┼────────────────┤
│ 13 │ caffeine            │ Oral │ 10.0 mg │ 2 hours ago    │
├────┼─────────────────────┼──────┼─────────┼────────────────┤
│ 12 │ caffeine            │ Oral │ 10.0 mg │ 2 hours ago    │
├────┼─────────────────────┼──────┼─────────┼────────────────┤
│ 11 │ caffeine            │ Oral │ 10.0 mg │ 2 hours ago    │
├────┼─────────────────────┼──────┼─────────┼────────────────┤
│ 10 │ caffeine            │ Oral │ 10.0 mg │ 2 hours ago    │
├────┼─────────────────────┼──────┼─────────┼────────────────┤
│ 9  │ caffeine            │ Oral │ 10.0 mg │ 2 hours ago    │
├────┼─────────────────────┼──────┼─────────┼────────────────┤
│ 8  │ caffeine            │ Oral │ 10.0 mg │ 2 hours ago    │
├────┼─────────────────────┼──────┼─────────┼────────────────┤
│ 7  │ caffeine            │ Oral │ 10.0 mg │ 2 hours ago    │
├────┼─────────────────────┼──────┼─────────┼────────────────┤
│ 6  │ caffeine            │ Oral │ 100 mg  │ 6 hours ago    │
├────┼─────────────────────┼──────┼─────────┼────────────────┤
│ 5  │ caffeine            │ Oral │ 100 mg  │ 6 hours ago    │
└────┴─────────────────────┴──────┴─────────┴────────────────┘
```

#### [🗎 Update ingestion](https://keinsell.youtrack.cloud/articles/NEU-A-6)

```bash
❯ neuronek ingestion list -l 1
┌────┬───────────┬──────┬─────────┬────────────────┐
│ ID │ Substance │ ROA  │ Dosage  │ Ingestion Date │
├────┼───────────┼──────┼─────────┼────────────────┤
│ 14 │ caffeine  │ Oral │ 80.0 mg │ a minute ago   │
└────┴───────────┴──────┴─────────┴────────────────┘
❯ neuronek ingestion update 14 -d 200mg
╭────┬───────────┬──────┬────────┬────────────────╮
│ ID │ Substance │ ROA  │ Dosage │ Ingestion Date │
├────┼───────────┼──────┼────────┼────────────────┤
│ 14 │ caffeine  │ Oral │ 200 mg │  a minute ago  │
╰────┴───────────┴──────┴────────┴────────────────╯
```

#### [🗎 Delete Ingestion](https://keinsell.youtrack.cloud/articles/NEU-A-4)

> [!CAUTION]
> Deletion cannot be undone, so verify the correct ID before deleting.

```bash
❯ neuronek ingestion list -l 1
┌────┬───────────┬──────┬────────┬────────────────┐
│ ID │ Substance │ ROA  │ Dosage │ Ingestion Date │
├────┼───────────┼──────┼────────┼────────────────┤
│ 14 │ caffeine  │ Oral │ 200 mg │ 2 minutes ago  │
└────┴───────────┴──────┴────────┴────────────────┘
❯ neuronek ingestion delete 14
❯ neuronek ingestion list -l 1
┌────┬─────────────────────┬──────┬─────────┬────────────────┐
│ ID │ Substance           │ ROA  │ Dosage  │ Ingestion Date │
├────┼─────────────────────┼──────┼─────────┼────────────────┤
│ 13 │ caffeine            │ Oral │ 10.0 mg │ 2 hours ago    │
└────┴─────────────────────┴──────┴─────────┴────────────────┘
```

### Substances

Application comes with pre-bundled database of psychoactive substances built on top
of [PsychonautWiki](https://psychonautwiki.org), such information are easily queryable through CLI and are foundation
for further analysis of user's ingestions to provide insight on harm-reduction and predicting subjective effects.

#### Get Substance [Under Development]

Application can preview information about compounds from initially provided dataset, however due to highly nested nature
of information the clean and human-friendly interface is needed to be designed and developed and implementation of such
to this application by its nature is questionable.

```bash
neuronek substance get caffeine
```

```json
{
  "name": "Caffeine",
  "common_names": "",
  "routes_of_administration": [
    {
      "name": "Insufflated",
      "dosages": [
        {
          "classification": "Heavy",
          "dosage_min": "80.0 mg",
          "dosage_max": "N/A"
        },
        {
          "classification": "Strong",
          "dosage_min": "40.0 mg",
          "dosage_max": "80.0 mg"
        },
        {
          "classification": "Light",
          "dosage_min": "10.0 mg",
          "dosage_max": "25.0 mg"
        },
        {
          "classification": "Threshold",
          "dosage_min": "N/A",
          "dosage_max": "2.50 mg"
        },
        {
          "classification": "Medium",
          "dosage_min": "25.0 mg",
          "dosage_max": "40.0 mg"
        }
      ],
      "phases": [
        {
          "name": "Onset",
          "duration_min": "PT30S",
          "duration_max": "PT2M"
        },
        {
          "name": "Afterglow",
          "duration_min": "PT6H",
          "duration_max": "P1D"
        },
        {
          "name": "Comeup",
          "duration_min": "PT30S",
          "duration_max": "PT2M"
        },
        {
          "name": "Comedown",
          "duration_min": "PT6H",
          "duration_max": "PT10H"
        },
        {
          "name": "Peak",
          "duration_min": "PT30M",
          "duration_max": "PT1H"
        }
      ]
    },
    {
      "name": "Oral",
      "dosages": [
        {
          "classification": "Medium",
          "dosage_min": "50.0 mg",
          "dosage_max": "150 mg"
        },
        {
          "classification": "Heavy",
          "dosage_min": "500 mg",
          "dosage_max": "N/A"
        },
        {
          "classification": "Threshold",
          "dosage_min": "N/A",
          "dosage_max": "10.0 mg"
        },
        {
          "classification": "Strong",
          "dosage_min": "150 mg",
          "dosage_max": "500 mg"
        },
        {
          "classification": "Light",
          "dosage_min": "20.0 mg",
          "dosage_max": "50.0 mg"
        }
      ],
      "phases": [
        {
          "name": "Comeup",
          "duration_min": "PT10M",
          "duration_max": "PT30M"
        },
        {
          "name": "Comedown",
          "duration_min": "PT1H",
          "duration_max": "PT2H"
        },
        {
          "name": "Afterglow",
          "duration_min": "PT4H",
          "duration_max": "PT12H"
        },
        {
          "name": "Peak",
          "duration_min": "PT45M",
          "duration_max": "PT1H30M"
        },
        {
          "name": "Onset",
          "duration_min": "PT5M",
          "duration_max": "PT10M"
        }
      ]
    }
  ]
}

```

## Contributing

Project do not expect any external contribution. If you want to contribute, please contact me directly
via [keinsell@protonmail.com]() and we can discuss the project together and move code to
organization out of my profile.

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## License

Read the [LICENSE](LICENSE) file for more information.
