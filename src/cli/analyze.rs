use crate::analyzer::model::IngestionAnalysis;
use crate::analyzer::model::IngestionPhase;
use crate::core::CommandHandler;
use crate::cli::formatter::Formatter;
use crate::ingestion::model::Ingestion;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::phase::PhaseClassification;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::substance::DosageClassification;
use crate::utils::AppContext;
use async_trait::async_trait;
use chrono::DateTime;
use chrono::Local;
use chrono_humanize::HumanTime;
use clap::Parser;
use miette::IntoDiagnostic;
use owo_colors::OwoColorize;
use sea_orm::EntityTrait;
use std::borrow::Cow;
use std::str::FromStr;
use tabled::settings::Style;
use tabled::Table;
use tabled::Tabled;

fn display_date(date: &DateTime<Local>) -> String { HumanTime::from(*date).to_string() }

#[derive(Debug, serde::Serialize, Tabled)]
struct AnalyzerReportPhaseViewModel
{
    #[tabled(rename = "Phase")]
    phase: PhaseClassification,

    #[tabled(rename = "Start Time")]
    #[tabled(display_with = "display_date")]
    from: DateTime<Local>,

    #[tabled(rename = "End Time")]
    #[tabled(display_with = "display_date")]
    to: DateTime<Local>,
}

#[derive(Debug, serde::Serialize)]
struct AnalyzerReportViewModel
{
    ingestion_id: Option<i32>,
    substance_name: String,
    dosage: String,
    #[serde(rename = "dosage_classification")]
    classification: Option<DosageClassification>,
    phases: Vec<AnalyzerReportPhaseViewModel>,
}

impl Tabled for AnalyzerReportViewModel
{
    const LENGTH: usize = 5;

    fn fields(&self) -> Vec<Cow<'_, str>>
    {
        let nested_phases_table = Table::new(&self.phases)
            .with(Style::modern_rounded())
            .to_string();
        vec![
            Cow::Owned(
                self.ingestion_id
                    .map_or("N/A".to_string(), |id| id.to_string()),
            ),
            Cow::Borrowed(self.substance_name.as_str()),
            Cow::Borrowed(self.dosage.as_str()),
            Cow::Owned(
                self.classification
                    .as_ref()
                    .map_or("N/A".to_string(), |c| c.to_string()),
            ),
            Cow::Owned(nested_phases_table.to_string()),
        ]
    }

    fn headers() -> Vec<Cow<'static, str>>
    {
        vec![
            Cow::Borrowed("Ingestion ID"),
            Cow::Borrowed("Substance"),
            Cow::Borrowed("Dosage"),
            Cow::Borrowed("Dosage Classification"),
            Cow::Borrowed("Phase Details"),
        ]
    }
}

impl Formatter for AnalyzerReportViewModel {}

impl From<&IngestionPhase> for AnalyzerReportPhaseViewModel
{
    fn from(value: &IngestionPhase) -> Self
    {
        AnalyzerReportPhaseViewModel {
            phase: value.class.clone(),
            from: value.duration_range.start,
            to: value.duration_range.end,
        }
    }
}

impl From<IngestionAnalysis> for AnalyzerReportViewModel
{
    fn from(value: IngestionAnalysis) -> Self
    {
        AnalyzerReportViewModel {
            ingestion_id: None,
            substance_name: value.ingestion.as_ref().unwrap().substance.clone(),
            dosage: value.ingestion.as_ref().unwrap().dosage.to_string(),
            classification: value.dosage_classification,
            phases: value
                .phases
                .iter()
                .map(AnalyzerReportPhaseViewModel::from)
                .collect(),
        }
    }
}


/// Analyze a previously logged ingestion activity.
///
/// Either the `ingestion_id` **or** the combination of `substance.rs` and
/// `dosage` must be provided, but not both at the same time. If
/// `ingestion_id` is provided, all other arguments are ignored.
#[derive(Parser, Debug)]
#[command(
    version,
    about = "Generate insights about a given ingestion",
    long_about = "Analyze ingestion entries based on their unique identifier or specific \
                  substance and dosage details."
)]
pub struct AnalyzeIngestion
{
    /// Identifier of the ingestion to analyze.
    #[arg(
        short,
        long,
        help = "The identifier of the ingestion entry to analyze",
        aliases = vec!["id"],
        conflicts_with_all = &["substance", "dosage", "date", "roa"]
    )]
    pub ingestion_id: Option<i32>,

    /// Name of the substance involved in the ingestion (if not using
    /// `ingestion_id`).
    #[arg(
        short,
        long,
        value_name = "SUBSTANCE",
        help = "Name of the substance",
        requires = "dosage",
        conflicts_with = "ingestion_id"
    )]
    pub substance: Option<String>,

    /// Dosage of the substance ingested (if not using `ingestion_id`).
    #[arg(
        short,
        long,
        value_name = "DOSAGE",
        help = "Dosage of the substance",
        requires = "substance",
        conflicts_with = "ingestion_id",
        value_parser = Dosage::from_str,
    )]
    pub dosage: Option<Dosage>,

    /// Date of ingestion (defaults to the current date if not provided).
    #[arg(
        short = 't',
        long = "date",
        default_value = "now",
        value_parser = crate::utils::parse_date_string,
        conflicts_with = "ingestion_id"
    )]
    pub date: Option<DateTime<Local>>,

    /// Route of administration of the substance (defaults to "oral").
    #[arg(
        short = 'r',
        long = "roa",
        default_value = "oral",
        value_enum,
        conflicts_with = "ingestion_id"
    )]
    pub roa: Option<RouteOfAdministrationClassification>,
}

#[async_trait]
impl CommandHandler for AnalyzeIngestion
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()>
    {
        let ingestion: Ingestion = match self.ingestion_id
        {
            | Some(id) =>
                {
                    crate::database::entities::ingestion::Entity::find_by_id(id)
                        .one(ctx.database_connection)
                        .await
                        .into_diagnostic()?
                        .ok_or_else(|| miette::miette!("Ingestion not found"))?
                        .into()
                }
            | None => Ingestion {
                id: Default::default(),
                dosage: self.dosage.clone().ok_or_else(|| miette::miette!("Dosage not provided"))?,
                route: self.roa.ok_or_else(|| miette::miette!("Route of administration not provided"))?,
                substance: self.substance.clone().ok_or_else(|| miette::miette!("Substance not provided"))?,
                ingestion_date: self.date.unwrap_or_else(Local::now),
            },
        };

        let substance = crate::substance::repository::get_substance(
            &ingestion.substance,
            ctx.database_connection,
        )
            .await?;

        let substance = substance.ok_or_else(|| miette::miette!("Substance not found"))?;

        let analysis = IngestionAnalysis::analyze(ingestion, &substance)
            .await?;
        let view_model: AnalyzerReportViewModel = analysis.into();
        println!("{}", view_model.format(ctx.stdout_format));

        Ok(())
    }
}
#[cfg(test)]
mod tests {
    use super::*;
    use crate::substance::route_of_administration::RouteOfAdministrationClassification;
    use crate::substance::route_of_administration::dosage::Dosage;
    use crate::utils::{migrate_database, AppContext, DATABASE_CONNECTION};
    use chrono::Local;
    use std::str::FromStr;

    #[async_std::test]
    async fn test_analyze_ingestion_basic_flow() {
        let db_conn = &DATABASE_CONNECTION;
        migrate_database(db_conn).await.unwrap();

        // Prepare test data
        let analyze_command = AnalyzeIngestion {
            ingestion_id: None,
            substance: Some("Caffeine".to_string()),
            dosage: Some(Dosage::from_str("80 mg").unwrap()),
            date: Some(Local::now()),
            roa: Some(RouteOfAdministrationClassification::Oral),
        };

        // Create a mock app concleartext
        let ctx = AppContext {
            database_connection: &db_conn,
            stdout_format: crate::cli::OutputFormat::default(),
        };

        // Execute the analyze command
        let result = analyze_command.handle(ctx).await.unwrap();
    }

    #[async_std::test]
    async fn test_analyze_ingestion_handles_missing_substance() {
        // Prepare test data with a substance that might not exist
        let analyze_command = AnalyzeIngestion {
            ingestion_id: None,
            substance: Some("NonExistentSubstance".to_string()),
            dosage: Some(Dosage::from_str("100 mg").unwrap()),
            date: Some(Local::now()),
            roa: Some(RouteOfAdministrationClassification::Oral),
        };

        // Create a mock database connection
        let database_connection = sea_orm::Database::connect("sqlite::memory:")
            .await
            .expect("Failed to create in-memory database");

        // Create a mock app context
        let ctx = AppContext {
            database_connection: &database_connection,
            stdout_format: crate::cli::OutputFormat::default(),
        };

        // Execute the analyze command
        let result = analyze_command.handle(ctx).await;

        // Assert that the command handles missing substance gracefully
        assert!(result.is_err(), "AnalyzeIngestion should return an error for non-existent substance");
    }
}
