use crate::ingestion::Ingestion;
use crate::substance::dosage::Dosage;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::utils::AppContext;
use crate::utils::CommandHandler;
use async_trait::async_trait;
use chrono::DateTime;
use chrono::Local;
use clap::Parser;
use miette::IntoDiagnostic;
use sea_orm::EntityTrait;
use std::str::FromStr;

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
            | Some(..) => crate::orm::ingestion::Entity::find_by_id(self.ingestion_id.unwrap())
                .one(ctx.database_connection)
                .await
                .into_diagnostic()?
                .unwrap_or_else(|| panic!("Ingestion not found"))
                .into(),
            | None => Ingestion {
                id: Default::default(),
                dosage: self.dosage.clone().expect("Dosage not provided"),
                route: self.roa.unwrap(),
                substance: self.substance.clone().expect("Substance not provided"),
                ingestion_date: self.date.unwrap_or_else(Local::now),
            },
        };

        let substance = crate::substance::repository::get_substance(
            self.substance.as_ref().unwrap(),
            ctx.database_connection,
        )
        .await?;

        if substance.is_some()
        {
            let substance = substance.unwrap();
            let analysis =
                crate::analyzer::IngestionAnalysis::analyze(ingestion, substance).await?;

            match ctx.stdout_format
            {
                | crate::cli::OutputFormat::Pretty => println!("{}", analysis),
                | crate::cli::OutputFormat::Json =>
                {
                    println!(
                        "{}",
                        serde_json::to_string_pretty(&analysis).into_diagnostic()?
                    );
                }
            }
        }

        Ok(())
    }
}
