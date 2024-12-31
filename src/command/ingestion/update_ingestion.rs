use crate::lib::CommandHandler;
use crate::lib::Context;
use crate::lib::dosage::Dosage;
use crate::lib::dosage::parse_dosage;
use crate::lib::orm::ingestion;
use crate::lib::orm::prelude::Ingestion;
use crate::lib::parse_date_string;
use crate::lib::route_of_administration::RouteOfAdministrationClassification;
use crate::view_model::ingestion::ViewModel;
use chrono::DateTime;
use chrono::Local;
use clap::Parser;
use log::info;
use measurements::Measurement;
use miette::IntoDiagnostic;
use miette::miette;
use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
use sea_orm::EntityTrait;
use sea_orm::prelude::async_trait::async_trait;


#[derive(Parser, Debug)]
#[command(version, about = "Update an existing ingestion")]
pub struct UpdateIngestion
{
    /// ID of the ingestion to update
    #[arg(index = 1, value_name = "INGESTION_ID")]
    pub ingestion_identifier: i32,

    /// New name of the substance (optional)
    #[arg(short = 'n', long = "name", value_name = "SUBSTANCE_NAME")]
    pub substance_name: Option<String>,

    /// New dosage (optional, e.g., 20 mg)
    #[arg(short = 'd', long = "dosage", value_name = "DOSAGE", value_parser=parse_dosage)]
    pub dosage: Option<Dosage>,

    /// New ingestion date (optional, e.g., "today 10:00")
    #[arg(short = 't', long = "date", value_name = "INGESTION_DATE", value_parser=parse_date_string
    )]
    pub ingestion_date: Option<DateTime<Local>>,

    /// New route of administration (optional, defaults to "oral")
    #[arg(short = 'r', long = "roa", value_enum)]
    pub route_of_administration: Option<RouteOfAdministrationClassification>,
}


#[async_trait]
impl CommandHandler for UpdateIngestion
{
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        // Attempt to fetch the record by ID
        if Ingestion::find_by_id(self.ingestion_identifier)
            .one(context.database_connection)
            .await
            .into_diagnostic()?
            .is_none()
        {
            return Err(miette!(
                "Ingestion with ID {} not found",
                self.ingestion_identifier
            ));
        }

        // Create an ActiveModel with only the fields to be updated
        let updated_model = ingestion::ActiveModel {
            id: ActiveValue::Set(self.ingestion_identifier), // ID must always be set for updates
            substance_name: self
                .substance_name
                .as_ref()
                .map(|name| ActiveValue::Set(name.clone()))
                .unwrap_or(ActiveValue::NotSet),
            dosage: self
                .dosage
                .as_ref()
                .map(|dosage| ActiveValue::Set(dosage.as_base_units() as f32))
                .unwrap_or(ActiveValue::NotSet),
            route_of_administration: self
                .route_of_administration
                .as_ref()
                .map(|roa| ActiveValue::Set(serde_json::to_string(roa).unwrap()))
                .unwrap_or(ActiveValue::NotSet),
            ingested_at: self
                .ingestion_date
                .as_ref()
                .map(|date| ActiveValue::Set(date.to_utc().naive_local()))
                .unwrap_or(ActiveValue::NotSet),
            updated_at: ActiveValue::Set(Local::now().to_utc().naive_local()),
            ..Default::default()
        };

        let updated_record = updated_model
            .update(context.database_connection)
            .await
            .into_diagnostic()?;

        info!(
            "Successfully updated ingestion with ID {}.",
            self.ingestion_identifier
        );

        println!("{}", ViewModel::from(updated_record));

        Ok(())
    }
}
