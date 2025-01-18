use crate::orm::ingestion;
use crate::substance::dosage::Dosage;
use crate::utils::AppContext;
use crate::utils::CommandHandler;
use async_trait::async_trait;
use clap::Parser;
use itertools::Itertools;
use miette::IntoDiagnostic;
use miette::Result;
use owo_colors::OwoColorize;
use sea_orm::ColumnTrait;
use sea_orm::DatabaseConnection;
use sea_orm::EntityTrait;
use sea_orm::PaginatorTrait;
use sea_orm::QuerySelect;
use sea_orm::prelude::Expr;
use tabled::Table;
use tabled::Tabled;

/// CLI command to view enhanced ingestion statistics
#[derive(Parser, Debug)]
#[command(version, about = "View enhanced ingestion statistics")]
pub struct GetStatistics {}

#[async_trait]
impl CommandHandler for GetStatistics
{
    async fn handle<'a>(&self, context: AppContext<'a>) -> Result<()>
    {
        // Query ingestion data
        let connection: &DatabaseConnection = context.database_connection;

        // Total ingestions
        let total_ingestions = ingestion::Entity::find()
            .count(connection)
            .await
            .into_diagnostic()?;
        println!("\n{}", "Statistics Overview".bold().underline().blue());
        println!(
            "{}: {}",
            "Total Ingestions".green(),
            total_ingestions.yellow()
        );

        // Total substance data
        let stats = ingestion::Entity::find()
            .select_only()
            .column(ingestion::Column::SubstanceName)
            .column_as(Expr::col(ingestion::Column::Dosage).sum(), "total_amount")
            .group_by(ingestion::Column::SubstanceName)
            .into_model::<SubstanceStatistics>()
            .all(connection)
            .await
            .into_diagnostic()?;

        // Transform data
        let formatted_stats: Vec<_> = stats
            .into_iter()
            .map(|s| {
                let total_dosage = s.total_amount.unwrap_or(0.0);
                FormattedStatistics {
                    substance_name: s.substance_name,
                    formatted_dosage: Dosage::from_base_units(total_dosage).to_string(),
                    raw_dosage: total_dosage,
                }
            })
            .sorted_by(|a, b| b.raw_dosage.partial_cmp(&a.raw_dosage).unwrap())
            .collect();

        // Calculate additional statistics
        let total_substances = formatted_stats.len();
        let top_substance = formatted_stats
            .first()
            .map(|s| s.substance_name.clone())
            .unwrap_or("None".to_string());
        let avg_dosage = formatted_stats.iter().map(|s| s.raw_dosage).sum::<f64>()
            / total_substances.max(1) as f64;

        // Print summary statistics
        println!(
            "{}: {}",
            "Total Unique Substances".green(),
            total_substances.yellow()
        );
        println!(
            "{}: {}",
            "Most Ingested Substance".green(),
            top_substance.cyan()
        );
        println!(
            "{}: {:.2}",
            "Average Dosage per Substance".green(),
            avg_dosage.magenta()
        );

        // Print substance table
        let table = Table::new(&formatted_stats).to_string();
        println!("\nSubstance Statistics Table:\n{}", table);

        println!("\n{}", "End of Statistics Report".dimmed());
        Ok(())
    }
}

/// Struct for database result mapping
#[derive(sea_orm::FromQueryResult)]
struct SubstanceStatistics
{
    substance_name: String,
    total_amount: Option<f64>,
}

/// Struct for formatted display
#[derive(Tabled)]
struct FormattedStatistics
{
    #[tabled(rename = "Substance Name")]
    substance_name: String,
    #[tabled(rename = "Formatted Dosage")]
    formatted_dosage: String,
    #[tabled(skip)]
    raw_dosage: f64, // Used for internal calculations
}
