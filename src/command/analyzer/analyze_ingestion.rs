use crate::lib;
use crate::lib::dosage::Dosage;
use crate::lib::route_of_administration::RouteOfAdministrationClassification;
use crate::lib::CommandHandler;
use chrono::DateTime;
use chrono::Local;
use clap::Parser;
use miette::IntoDiagnostic;
use sea_orm::prelude::async_trait::async_trait;
use sea_orm::EntityTrait;
use std::str::FromStr;

/// Analyze a previously logged ingestion activity.
///
/// Either the `ingestion_id` **or** the combination of `substance` and
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
        value_parser = crate::lib::parse_date_string,
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
    async fn handle<'a>(&self, context: lib::Context<'a>) -> miette::Result<()>
    {
        let ingestion: lib::orm::ingestion::Model = match self.ingestion_id
        {
            | Some(..) => lib::orm::ingestion::Entity::find_by_id(self.ingestion_id.unwrap())
                .one(context.database_connection)
                .await
                .into_diagnostic()?
                .unwrap_or_else(|| panic!("Ingestion not found")),
            | None => lib::orm::ingestion::Model {
                id: 0,
                substance_name: self.substance.clone().unwrap(),
                dosage: self.dosage.clone().unwrap().as_base_units() as f32,
                ingested_at: self.date.unwrap().naive_local(),
                updated_at: Default::default(),
                route_of_administration: self.roa.unwrap().to_string(),
                created_at: Default::default(),
            },
        };
        
        let substance = crate::substance::repository::get_substance_by_name(
            &ingestion.substance_name,
            context.database_connection,
        )
        .await?;

        let analysis = crate::analyzer::IngestionAnalysis::analyze(
            crate::ingestion::Ingestion::from(ingestion),
            substance,
        )
        .await?;

        println!("{}", analysis.to_string());

        Ok(())
    }
}
