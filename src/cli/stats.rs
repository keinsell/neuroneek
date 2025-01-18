use crate::cli::OutputFormat;
use crate::formatter::Formatter;
use crate::formatter::FormatterVector;
use crate::orm::ingestion;
use crate::prelude::*;
use crate::substance::dosage::Dosage;
use crate::utils::AppContext;
use crate::utils::CommandHandler;
use async_trait::async_trait;
use chrono::Days;
use chrono::NaiveDate;
use chrono::NaiveDateTime;
use chrono::Utc;
use clap::Parser;
use futures::TryFutureExt;
use itertools::Itertools;
use miette::IntoDiagnostic;
use miette::Result;
use owo_colors::OwoColorize;
use sea_orm::ColumnTrait;
use sea_orm::DatabaseConnection;
use sea_orm::EntityOrSelect;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QuerySelect;
use serde::Serialize;
use tabled::Table;
use tabled::Tabled;
use textplots::Chart;
use textplots::Plot;
use textplots::Shape;

/// Will query database for ingestions and will build up statistics grouped by
/// substance with average dosage that was administrated since date of first
/// ingestion or rolling window of 90 days.
async fn get_average_daily_dosage_for_rolling_window(
    connection: &DatabaseConnection,
) -> Result<Vec<AverageDailyDosage>>
{
    #[derive(Debug, sea_orm::FromQueryResult)]
    struct DailyDosage
    {
        substance_name: String,
        daily_dosage: f64,
        ingested_at: NaiveDate,
    }

    let rolling_window_start_date = chrono::Local::now().date_naive() - Days::new(90);

    let results = ingestion::Entity::find()
        .select()
        .column(ingestion::Column::SubstanceName)
        .column_as(
            sea_orm::prelude::Expr::col(ingestion::Column::Dosage).sum(),
            "daily_dosage",
        )
        .column_as(
            sea_orm::prelude::Expr::cust("DATE(ingested_at)"),
            "ingested_at",
        )
        .filter(
            ingestion::Column::IngestedAt
                .gte(rolling_window_start_date.and_hms_opt(0, 0, 0).unwrap()),
        )
        .group_by(ingestion::Column::SubstanceName)
        .group_by(sea_orm::prelude::Expr::cust("DATE(ingested_at)"))
        .into_model::<DailyDosage>()
        .all(connection)
        .await
        .into_diagnostic()?;

    let mut substance_map: std::collections::HashMap<
        String,
        std::collections::HashMap<NaiveDate, f64>,
    > = std::collections::HashMap::new();

    for entry in results
    {
        substance_map
            .entry(entry.substance_name)
            .or_insert_with(std::collections::HashMap::new)
            .insert(entry.ingested_at, entry.daily_dosage);
    }

    let rolling_window_dates: Vec<NaiveDate> =
        (0..=90) // Generate all days in the rolling window
            .map(|offset| rolling_window_start_date + Days::new(offset))
            .collect();

    let daily_dosage: Vec<_> = substance_map
        .into_iter()
        .map(|(substance_name, dosages_by_date)| {
            let filled_dosages_by_date: std::collections::HashMap<NaiveDate, f64> =
                rolling_window_dates
                    .iter()
                    .map(|&date| {
                        // Fill missing dates with 0 dosage
                        (date, *dosages_by_date.get(&date).unwrap_or(&0.0))
                    })
                    .collect();

            let total_days = rolling_window_dates.len() as f64;
            let total_dosage: f64 = filled_dosages_by_date.values().copied().sum();
            let avg_daily_dosage = total_dosage / total_days;

            AverageDailyDosage {
                substance_name,
                avg_daily_dosage: Dosage::from_base_units(avg_daily_dosage),
            }
        })
        .collect();

    Ok(daily_dosage)
}

async fn totals(connection: &DatabaseConnection) -> Result<Vec<TotalDosageOverPeriod>>
{
    #[derive(Debug, sea_orm::FromQueryResult)]
    struct IngestionsBySubstance
    {
        pub substance_name: String,
        pub total_dosage: f64,
    }

    let results = ingestion::Entity::find()
        .select_only()
        .column(ingestion::Column::SubstanceName)
        .column_as(
            sea_orm::prelude::Expr::col(ingestion::Column::Dosage).sum(),
            "total_dosage",
        )
        .group_by(ingestion::Column::SubstanceName)
        .into_model::<IngestionsBySubstance>()
        .all(connection)
        .await
        .into_diagnostic()?;

    let totals: Vec<_> = results
        .into_iter()
        .map(|entry| TotalDosageOverPeriod {
            substance_name: entry.substance_name,
            total_dosage: Dosage::from_base_units(entry.total_dosage),
        })
        .collect();

    Ok(totals)
}

#[derive(Parser, Debug)]
#[command(version, about = "View enhanced ingestion statistics")]
pub struct GetStatistics;

#[async_trait]
impl CommandHandler for GetStatistics
{
    async fn handle<'a>(&self, context: AppContext<'a>) -> Result<()>
    {
        let connection: &DatabaseConnection = context.database_connection;

        let totals_df = totals(&connection).await?;
        let avg_daily_df = get_average_daily_dosage_for_rolling_window(&connection).await?;

        println!("\n{}", "Statistics Overview".bold().underline().blue());

        println!(
            "{}: {}",
            "Total Unique Substances".green(),
            totals_df.len().to_string().yellow()
        );
        println!(
            "{}\n{}",
            "Substance Statistics Table".bold().underline().blue(),
            FormatterVector::new(totals_df).format(OutputFormat::Pretty)
        );
        println!(
            "{}\n{}",
            "Average Daily Dosage Table".bold().underline().blue(),
            FormatterVector::new(avg_daily_df).format(OutputFormat::Pretty)
        );
        println!("\n{}", "End of Statistics Report".dimmed());

        Ok(())
    }
}

#[derive(Debug, sea_orm::FromQueryResult)]
struct RawIngestion
{
    substance_name: String,
    dosage: Option<f64>,
    ingestion_date: chrono::DateTime<chrono::Utc>,
}

#[derive(Parser, Debug, Tabled, Serialize)]
struct TotalDosageOverPeriod
{
    #[tabled(rename = "Substance Name")]
    substance_name: String,
    #[tabled(display_with = "Dosage::to_string")]
    total_dosage: Dosage,
}

#[derive(Parser, Debug, Tabled, Serialize)]
struct AverageDailyDosage
{
    #[tabled(rename = "Substance Name")]
    substance_name: String,
    #[tabled(display_with = "Dosage::to_string")]
    avg_daily_dosage: Dosage,
}

impl Formatter for TotalDosageOverPeriod {}
impl Formatter for AverageDailyDosage {}
