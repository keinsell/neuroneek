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
use clap::Parser;
use futures::TryFutureExt;
use miette::IntoDiagnostic;
use miette::Result;
use owo_colors::OwoColorize;
use polars::lazy::dsl::*;
use polars::prelude::*;
use sea_orm::DatabaseConnection;
use sea_orm::EntityTrait;
use sea_orm::QuerySelect;
use serde::Serialize;
use tabled::Table;
use tabled::Tabled;
use textplots::Chart;
use textplots::Plot;
use textplots::Shape;

async fn dataframe(connection: &DatabaseConnection) -> Result<DataFrame>
{
    let ingestions = ingestion::Entity::find()
        .select_only()
        .column(ingestion::Column::SubstanceName)
        .column(ingestion::Column::Dosage)
        .column(ingestion::Column::IngestedAt)
        .column_as(ingestion::Column::IngestedAt, "ingestion_date")
        .into_model::<RawIngestion>()
        .all(connection)
        .await
        .into_diagnostic()?;


    let substance_names: Vec<_> = ingestions
        .iter()
        .map(|entry| entry.substance_name.clone())
        .collect();
    let dosages: Vec<f64> = ingestions
        .iter()
        .map(|entry| entry.dosage.unwrap_or(0.0))
        .collect();
    let ingestion_dates: Vec<_> = ingestions
        .iter()
        .map(|entry| entry.ingestion_date.naive_local().date())
        .collect(); // Extract only the date part

    let df = DataFrame::new(vec![
        Series::new("Substance Name".into(), substance_names).into(),
        Series::new("Dosage".into(), dosages).into(),
        Series::new("Ingestion Date".into(), ingestion_dates).into(),
    ])
    .into_diagnostic()?;

    Ok(df)
}

async fn daily_dosage(data_frame: &DataFrame) -> Result<Vec<AverageDailyDosage>>
{
    let rolling_window_start_date = chrono::Local::now().date_naive() - Days::new(90);

    let filtered_df = data_frame
        .clone()
        .lazy()
        .filter(col("Ingestion Date").gt(lit(rolling_window_start_date)))
        .group_by([col("Substance Name"), col("Ingestion Date")])
        .agg([col("Dosage").sum().alias("Daily Dosage")])
        .group_by([col("Substance Name")])
        .agg([col("Daily Dosage").mean().alias("Avg Daily Dosage")])
        .collect()
        .into_diagnostic()?;

    let substance_names = filtered_df
        .column("Substance Name")
        .into_diagnostic()?
        .str()
        .into_diagnostic()?;

    let avg_dosages = filtered_df
        .column("Avg Daily Dosage")
        .into_diagnostic()?
        .f64()
        .into_diagnostic()?;

    let daily_dosage: Vec<_> = substance_names
        .into_iter()
        .zip(avg_dosages)
        .filter_map(|(name, dosage)| {
            Some(AverageDailyDosage {
                substance_name: name?.to_string(),
                avg_daily_dosage: Dosage::from_base_units(dosage.unwrap_or(0.0)),
            })
        })
        .collect();

    Ok(daily_dosage)
}

async fn totals(data_frame: &DataFrame) -> Result<Vec<TotalDosageOverPeriod>>
{
    let total_df = data_frame
        .clone()
        .lazy()
        .group_by([col("Substance Name")])
        .agg([col("Dosage").sum().alias("Total Dosage")])
        .collect()
        .into_diagnostic()?;

    let substance_names = total_df
        .column("Substance Name")
        .into_diagnostic()?
        .str()
        .into_diagnostic()?;
    let dosages = total_df
        .column("Total Dosage")
        .into_diagnostic()?
        .f64()
        .into_diagnostic()?;

    let totals: Vec<_> = substance_names
        .into_iter()
        .zip(dosages)
        .filter_map(|(name, dosage)| {
            Some(TotalDosageOverPeriod {
                substance_name: name?.to_string(),
                total_dosage: Dosage::from_base_units(dosage.unwrap_or(0.0)),
            })
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
        let df = dataframe(connection).await?;

        let totals_df = totals(&df).await?;
        let avg_daily_df = daily_dosage(&df).await?;

        println!("\n{}", "Statistics Overview".bold().underline().blue());
        println!(
            "{}: {}",
            "Total Ingestions".green(),
            df.height().to_string().yellow()
        );
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
