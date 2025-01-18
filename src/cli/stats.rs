use crate::orm::ingestion;
use crate::utils::AppContext;
use crate::utils::CommandHandler;
use async_trait::async_trait;
use clap::Parser;
use miette::IntoDiagnostic;
use miette::Report;
use miette::Result;
use owo_colors::OwoColorize;
use polars::lazy::dsl::*;
use polars::prelude::*;
use sea_orm::DatabaseConnection;
use sea_orm::EntityTrait;
use sea_orm::QuerySelect;

#[derive(Parser, Debug)]
#[command(version, about = "View enhanced ingestion statistics")]
pub struct GetStatistics {}

#[async_trait]
impl CommandHandler for GetStatistics
{
    async fn handle<'a>(&self, context: AppContext<'a>) -> Result<()>
    {
        let connection: &DatabaseConnection = context.database_connection;

        // Step 1: Fetch ingestion data using SeaORM
        let ingestions = ingestion::Entity::find()
            .select_only()
            .column(ingestion::Column::SubstanceName)
            .column(ingestion::Column::Dosage)
            .into_model::<RawIngestion>()
            .all(connection)
            .await
            .into_diagnostic()?;

        // Ensure there is data to process
        if ingestions.is_empty()
        {
            println!("{}", "No ingestion data found.".red());
            return Ok(());
        }

        // Step 2: Load the data into Polars DataFrame
        let substance_names: Vec<_> = ingestions
            .iter()
            .map(|entry| entry.substance_name.clone())
            .collect();
        let dosages: Vec<f64> = ingestions
            .iter()
            .map(|entry| entry.dosage.unwrap_or(0.0))
            .collect();

        let df = DataFrame::new(vec![
            Series::new("Substance Name".into(), substance_names).into(),
            Series::new("Dosage".into(), dosages).into(),
        ])
        .into_diagnostic()?;

        // Step 3: Analytics using Polars
        let summary_df = df.clone().lazy()
            .group_by([col("Substance Name")]) // Corrected groupby usage
            .agg([
                col("Dosage").sum().alias("Total Dosage"),
                col("Dosage").mean().alias("Avg Dosage"),
            ])
            .sort(["Total Dosage"], SortMultipleOptions { // Adjusted sort behavior
                descending: vec![true],
                nulls_last: vec![true],
                multithreaded: false,
                maintain_order: false,
                limit: None,
            })
            .collect().into_diagnostic()?;

        // Step 4: Derive statistics
        println!("\n{}", "Statistics Overview".bold().underline().blue());

        // Total number of ingestions
        let total_ingestions_count = df.clone().height();
        println!(
            "{}: {}",
            "Total Ingestions".green(),
            total_ingestions_count.to_string().yellow()
        );

        // Total unique substances
        let total_unique_substances = summary_df.height();
        println!(
            "{}: {}",
            "Total Unique Substances".green(),
            total_unique_substances.to_string().yellow()
        );

        // Most ingested substance
        let top_substance = summary_df
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
        println!("{}", summary_df);

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
}
