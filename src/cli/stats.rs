use crate::cli::OutputFormat;
use crate::core::CommandHandler;
use crate::database::entities::ingestion;
use crate::cli::formatter::Formatter;
use crate::cli::formatter::FormatterVector;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::utils::AppContext;
use async_trait::async_trait;
use chrono::Days;
use chrono::NaiveDate;
use chrono::Utc;
use clap::Parser;
use hashbrown::HashMap;
use miette::IntoDiagnostic;
use miette::Result;
use owo_colors::OwoColorize;
use ratatui::widgets::Chart;
use sea_orm::ColumnTrait;
use sea_orm::DatabaseConnection;
use sea_orm::EntityTrait;
use sea_orm::PaginatorTrait;
use sea_orm::QueryFilter;
use sea_orm::QuerySelect;
use serde::Serialize;
use tabled::Tabled;

async fn get_period_statistics(
    connection: &DatabaseConnection,
    rolling_window: i32,
) -> Result<Vec<PeriodStatistics>>
{
    #[derive(Debug, sea_orm::FromQueryResult)]
    struct RawStats
    {
        substance_name: String,
        total_dosage: f64,
        min_dosage: f64,
        max_dosage: f64,
        count: i64,
    }

    let rolling_window_start_date =
        chrono::Local::now().date_naive() - Days::new(rolling_window as u64);

    let results = ingestion::Entity::find()
        .select_only()
        .column(ingestion::Column::SubstanceName)
        .column_as(
            sea_orm::prelude::Expr::col(ingestion::Column::Dosage).sum(),
            "total_dosage",
        )
        .column_as(
            sea_orm::prelude::Expr::col(ingestion::Column::Dosage).min(),
            "min_dosage",
        )
        .column_as(
            sea_orm::prelude::Expr::col(ingestion::Column::Dosage).max(),
            "max_dosage",
        )
        .column_as(
            sea_orm::prelude::Expr::col(ingestion::Column::Id).count(),
            "count",
        )
        .filter(
            ingestion::Column::IngestedAt
                .gte(rolling_window_start_date.and_hms_opt(0, 0, 0).unwrap()),
        )
        .group_by(ingestion::Column::SubstanceName)
        .into_model::<RawStats>()
        .all(connection)
        .await
        .into_diagnostic()?;

    let period_stats: Vec<_> = results
        .into_iter()
        .map(|stats| {
            let days = rolling_window as f64;
            PeriodStatistics {
                substance_name: stats.substance_name,
                daily_dosage: Dosage::from_base_units(stats.total_dosage / days),
                sum_dosage: Dosage::from_base_units(stats.total_dosage),
                min_dosage: Dosage::from_base_units(stats.min_dosage),
                max_dosage: Dosage::from_base_units(stats.max_dosage),
                count: stats.count as i32,
            }
        })
        .collect();

    Ok(period_stats)
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

    let mut ingestion_data: HashMap<NaiveDate, i64> = HashMap::new();
    for entry in results
    {
        ingestion_data.insert(entry.ingestion_date, entry.ingestion_count);
    }

    // let histogram_data: Vec<(f32, f32)> = (0..=30)
    //     .map(|offset| {
    //         let date = thirty_days_ago + chrono::Duration::days(offset);
    //         let count = ingestion_data.get(&date).cloned().unwrap_or(0) as f32;
    //         (offset as f32, count)
    //     })
    //     .collect();
    //
    // Chart::new(80, 20, 0.0, 30.0)
    //     .lineplot(&Shape::Bars(&histogram_data))
    //     .display();

    Ok(())
}

/// Get statistics of logged ingestions
#[derive(Parser, Debug)]
#[command(version, about = "Get statistics of logged ingestions", long_about)]
pub struct GetStatistics
{
    /// Size of the rolling window in days
    #[arg(short, long, default_value = "30")]
    pub rolling_window: i32,
}

#[derive(Parser, Debug, Tabled, Serialize)]
pub struct PeriodStatistics
{
    #[tabled(rename = "Substance Name")]
    pub substance_name: String,
    #[tabled(rename = "AVG (per day)")]
    #[tabled(display_with = "Dosage::to_string")]
    pub daily_dosage: Dosage,
    #[tabled(rename = "SUM")]
    #[tabled(display_with = "Dosage::to_string")]
    pub sum_dosage: Dosage,
    #[tabled(rename = "MIN")]
    #[tabled(display_with = "Dosage::to_string")]
    pub min_dosage: Dosage,
    #[tabled(rename = "MAX")]
    #[tabled(display_with = "Dosage::to_string")]
    pub max_dosage: Dosage,
    #[tabled(rename = "COUNT")]
    pub count: i32,
}

#[async_trait]
impl CommandHandler for GetStatistics
{
    async fn handle<'a>(&self, context: AppContext<'a>) -> Result<()>
    {
        let connection: &DatabaseConnection = context.database_connection;

        println!("\n{}", "Statistics Overview".bold().underline().blue());

        // println!(
        //     "{}: {}",
        //     "Total Ingestions".green(),
        //     ingestion_count(&connection)?.to_string().yellow()
        // );

        let period_stats = get_period_statistics(&connection, self.rolling_window).await?;

        println!(
            "{}: {}",
            "Total Unique Substances".green(),
            period_stats.len().to_string().yellow()
        );

        println!(
            "\n{}\n{}",
            format!("Substance Statistics (Last {} Days)", self.rolling_window)
                .bold()
                .underline()
                .blue(),
            FormatterVector::new(period_stats).format(OutputFormat::Pretty)
        );

        println!("\n{}", "Ingestion Histogram".bold().underline().blue());
        ingestion_histogram(connection).await?;

        println!("\n{}", "End of Statistics Report".dimmed());

        Ok(())
    }
}

impl Formatter for PeriodStatistics {}
