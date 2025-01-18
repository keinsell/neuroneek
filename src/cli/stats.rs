use crate::orm::ingestion;
use crate::utils::AppContext;
use crate::utils::CommandHandler;
use async_trait::async_trait;
use chrono::NaiveDate;
use clap::Parser;
use miette::IntoDiagnostic;
use miette::Result;
use owo_colors::OwoColorize;
use polars::lazy::dsl::*;
use polars::prelude::*;
use sea_orm::DatabaseConnection;
use sea_orm::EntityTrait;
use sea_orm::QuerySelect;
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

async fn daily_dosage(data_frame: &DataFrame) -> Result<DataFrame>
{
    let daily_df = data_frame.clone()
        .lazy()
        .group_by([col("Substance Name"), col("Ingestion Date")]) // Group by substance and date
        .agg([
            col("Dosage").sum().alias("Daily Dosage"), // Total for each day
        ])
        .group_by([col("Substance Name")]) // Regroup by substance
        .agg([
            col("Daily Dosage").mean().alias("Avg Daily Dosage"), // Average of daily totals
        ])
        .collect()
        .into_diagnostic()?;

    Ok(daily_df)
}

async fn totals(data_frame: &DataFrame) -> Result<DataFrame>
{
    let total_df = data_frame
        .clone()
        .lazy()
        .group_by([col("Substance Name")])
        .agg([col("Dosage").sum().alias("Total Dosage")])
        .collect()
        .into_diagnostic()?;

    Ok(total_df)
}

#[derive(Parser, Debug)]
#[command(version, about = "View enhanced ingestion statistics")]
pub struct GetStatistics {}

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
        let total_ingestions_count = df.height();
        println!(
            "{}: {}",
            "Total Ingestions".green(),
            total_ingestions_count.to_string().yellow()
        );

        let total_unique_substances = totals_df.height();
        println!(
            "{}: {}",
            "Total Unique Substances".green(),
            total_unique_substances.to_string().yellow()
        );

        // Most ingested substance
        let top_substance = totals_df
            .column("Substance Name")
            .into_diagnostic()?
            .get(0)
            .into_diagnostic()?;

        println!(
            "{}: {}",
            "Most Ingested Substance".green(),
            top_substance.cyan()
        );

        // Print the analytics DataFrame
        println!(
            "\n{}",
            "Substance Statistics Table:".bold().underline().blue()
        );
        println!("{}", totals_df);

        // Print the average daily dosage statistics
        println!(
            "\n{}",
            "Average Daily Dosage Table:".bold().underline().blue()
        );
        println!("{}", avg_daily_df);

        println!("\n{}", "End of Statistics Report".dimmed());

        Ok(())
    }
}

/// Struct to map raw ingestion data from the database using SeaORM
#[derive(Debug, sea_orm::FromQueryResult)]
struct RawIngestion
{
    substance_name: String,
    dosage: Option<f64>,
    ingestion_date: chrono::DateTime<chrono::Utc>,
}
