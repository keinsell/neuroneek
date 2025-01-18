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
use hashbrown::HashMap;
use itertools::Itertools;
use miette::IntoDiagnostic;
use miette::Result;
use owo_colors::OwoColorize;
use sea_orm::ColumnTrait;
use sea_orm::DatabaseConnection;
use sea_orm::EntityOrSelect;
use sea_orm::EntityTrait;
use sea_orm::PaginatorTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use sea_orm::QuerySelect;
use serde::Serialize;
use tabled::Table;
use tabled::Tabled;
use textplots::Chart;
use textplots::LabelBuilder;
use textplots::Plot;
use textplots::Shape;


async fn days_since_first_ingestion(connection: &DatabaseConnection) -> Result<Option<i32>>
{
    let query = ingestion::Entity::find()
        .order_by_asc(ingestion::Column::CreatedAt)
        .one(connection)
        .await
        .into_diagnostic()?;

    Ok(query
        .map(|ingestion| ingestion.created_at)
        .map(|created_at| {
            let now = Utc::now();
            let days_since_first_ingestion = (now.date_naive() - created_at.date()).num_days();
            days_since_first_ingestion as i32
        }))
}

async fn ingestion_count(connection: &DatabaseConnection) -> Result<i32>
{
    let query = ingestion::Entity::find()
        .count(connection)
        .await
        .into_diagnostic()?;

    Ok(query as i32)
}

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

    let days_since_first_ingestion = days_since_first_ingestion(connection).await?;

    let rolling_window_start_date = match days_since_first_ingestion
    {
        | Some(days) =>
        {
            if days > 90
            {
                chrono::Local::now().date_naive() - Days::new(90)
            }
            else
            {
                chrono::Local::now().date_naive() - Days::new(days as u64)
            }
        }
        | None => return Ok(Vec::new()),
    };

    let rolling_days = (chrono::Local::now().date_naive() - rolling_window_start_date).num_days();

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

    let mut substance_map: HashMap<String, HashMap<NaiveDate, f64>> = HashMap::new();
    for entry in results
    {
        substance_map
            .entry(entry.substance_name)
            .or_default()
            .insert(entry.ingested_at, entry.daily_dosage);
    }

    let rolling_window_dates: Vec<NaiveDate> = (0..=rolling_days)
        .map(|offset| rolling_window_start_date + Days::new(offset as u64))
        .collect();

    let daily_dosage: Vec<_> = substance_map
        .into_iter()
        .map(|(substance_name, dosages_by_date)| {
            let total_days = rolling_window_dates.len() as f64;

            let total_dosage: f64 = rolling_window_dates
                .iter()
                .map(|&date| dosages_by_date.get(&date).cloned().unwrap_or(0.0))
                .sum();

            AverageDailyDosage {
                substance_name,
                avg_daily_dosage: Dosage::from_base_units(total_dosage / total_days),
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

/// Fetch ingestion counts for the last 30 days and render a histogram
async fn ingestion_histogram(connection: &DatabaseConnection) -> Result<()>
{
    #[derive(Debug, sea_orm::FromQueryResult)]
    struct DailyIngestion
    {
        ingestion_date: NaiveDate,
        ingestion_count: i64,
    }

    let today = Utc::now().date_naive();
    let thirty_days_ago = today - chrono::Duration::days(30);

    // Fetch ingestion counts grouped by day
    let results = ingestion::Entity::find()
        .select_only()
        .column_as(
            sea_orm::prelude::Expr::cust("DATE(ingested_at)"),
            "ingestion_date",
        )
        .column_as(
            sea_orm::prelude::Expr::col(ingestion::Column::Id).count(),
            "ingestion_count",
        )
        .filter(ingestion::Column::IngestedAt.gte(thirty_days_ago.and_hms_opt(0, 0, 0).unwrap()))
        .group_by(sea_orm::prelude::Expr::cust("DATE(ingested_at)"))
        .into_model::<DailyIngestion>()
        .all(connection)
        .await
        .into_diagnostic()?;

    // Map ingestion data by date for the last 30 days
    let mut ingestion_data: HashMap<NaiveDate, i64> = HashMap::new();
    for entry in results
    {
        ingestion_data.insert(entry.ingestion_date, entry.ingestion_count);
    }

    let histogram_data: Vec<(f32, f32)> = (0..=30)
        .map(|offset| {
            let date = thirty_days_ago + chrono::Duration::days(offset);
            let count = ingestion_data.get(&date).cloned().unwrap_or(0) as f32;
            (offset as f32, count)
        })
        .collect();

    Chart::new(80, 20, 0.0, 30.0)
        .lineplot(&Shape::Bars(&histogram_data))
        .display();

    Ok(())
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
            "{}: {}",
            "Ingestions".green(),
            ingestion_count(&connection).await?.to_string().yellow()
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

        println!("\n{}", "Ingestion Histogram".bold().underline().blue());
        ingestion_histogram(connection).await?;

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
