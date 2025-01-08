use crate::lib::dosage::Dosage;
use crate::lib::formatter::Formatter;
use crate::lib::orm::ingestion;
use crate::lib::orm::prelude::Ingestion;
use crate::lib::parse_date_string;
use crate::lib::route_of_administration::RouteOfAdministrationClassification;
use crate::lib::CommandHandler;
use crate::lib::Context;
use crate::view_model::ingestion::IngestionViewModel;
use crate::OutputFormat;
use chrono::DateTime;
use chrono::Local;
use clap::Parser;
use log::error;
use measurements::Measurement;
use miette::IntoDiagnostic;
use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
use sea_orm::EntityTrait;
use sea_orm_migration::async_trait::async_trait;
use std::fmt::Debug;
use std::str::FromStr;

/**
# Log Ingestion

The `Log Ingestion` feature is the core functionality of Psylog, enabling users to record information about any substances they consume.
This feature is designed for tracking supplements, medications, nootropics,
or any psychoactive substances in a structured and organized way.

By logging ingestion, users can provide details such as the substance name, dosage, and the time of ingestion.
This data is stored in a low-level database that serves as the foundation for further features,
such as journaling, analytics, or integrations with external tools.
While power users may prefer to work directly with this raw data,
many user-friendly abstractions are planned to make this process seamless,
such as simplified commands (e.g., `psylog a coffee`) for quicker entries.

Logging ingestions not only serves the purpose of record-keeping
but also helps users build a personalized database of their consumption habits.
This database can be used to analyze trends over time,
providing insights into the long-term effects of different substances on physical and mental well-being.
*/
#[derive(Parser, Debug)]
#[command(
    version,
    about = "Store information about new ingestion",
    long_about,
    aliases = vec!["create", "add"]
)]
pub struct LogIngestion
{
    /// Name of substance that is being ingested, e.g. "Paracetamol"
    #[arg(index = 1, value_name = "SUBSTANCE", required = true)]
    pub substance_name: String,
    /// Dosage of given substance provided as string with unit (e.g., 10 mg)
    #[arg(
        index = 2,
        value_name = "DOSAGE",
        required = true,
        value_parser = Dosage::from_str
    )]
    pub dosage: Dosage,
    /// Date of ingestion, by default current date is used if not provided.
    ///
    /// Date can be provided as timestamp and in human-readable format such as
    /// "today 10:00", "yesterday 13:00", "monday 15:34" which will be later
    /// parsed into proper timestamp.
    #[arg(
        short='t',
        long="date",
        default_value = "now",
        default_value_t=Local::now(),
        value_parser=parse_date_string
    )]
    pub ingestion_date: DateTime<Local>,
    /// Route of administration related to given ingestion (defaults to "oral")
    #[arg(short = 'r', long = "roa", default_value = "oral", value_enum)]
    pub route_of_administration: RouteOfAdministrationClassification,
}

#[async_trait]
impl CommandHandler for LogIngestion
{
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        let pubchem = pubchem::Compound::with_name(&self.substance_name)
            .title()
            .into_diagnostic()?;
        let created_ingestion = Ingestion::insert(ingestion::ActiveModel {
            id: ActiveValue::default(),
            substance_name: ActiveValue::Set(pubchem.to_lowercase()),
            route_of_administration: ActiveValue::Set(
                serde_json::to_string(&self.route_of_administration).unwrap(),
            ),
            dosage: ActiveValue::Set(self.dosage.as_base_units() as f32),
            ingested_at: ActiveValue::Set(self.ingestion_date.to_utc().naive_local()),
            updated_at: ActiveValue::Set(Local::now().to_utc().naive_local()),
            created_at: ActiveValue::Set(Local::now().to_utc().naive_local()),
        })
        .exec_with_returning(context.database_connection)
        .await
        .into_diagnostic();

        if let Err(e) = created_ingestion
        {
            error!("Failed to create ingestion: {}", e);
            return Err(e);
        }

        println!("{}", IngestionViewModel::from(created_ingestion?).format(context.stdout_format));

        Ok(())
    }
}
