use crate::database::prelude::Ingestion;
use crate::lib::CommandHandler;
use crate::route_of_administration::RouteOfAdministrationClassification;
use chrono::DateTime;
use chrono::Local;
use clap::Parser;
use sea_orm::DatabaseConnection;
use sea_orm::EntityTrait;
use sea_orm::IntoActiveModel;
use smol::block_on;

#[derive(Parser, Debug)]
#[command(version, about = "Update ingestion", long_about)]
pub struct UpdateIngestion
{
    /// Identifier of the ingestion to update
    #[clap(short, long = "id")]
    pub ingestion_id: i32,
    /// Name of the substance ingested.
    #[arg(short = 's', long)]
    pub substance_name: Option<String>,
    /// Unit in which the substance is ingested (default is "mg").
    #[arg(short = 'u', long)]
    pub dosage_unit: Option<String>,
    /// Volume of substance ingested.
    #[arg(short = 'v', long)]
    pub dosage_amount: Option<u64>,
    /// Date of ingestion, by default current date is used if not provided.
    ///
    /// Date can be provided as timestamp and in human-readable format such as
    /// "today 10:00", "yesterday 13:00", "monday 15:34" which will be later
    /// parsed into proper timestamp.
    #[arg(short = 't', long)]
    pub ingestion_date: Option<DateTime<Local>>,
    #[arg(short = 'r', long = "roa")]
    pub route_of_administration: Option<RouteOfAdministrationClassification>,
}

#[async_trait::async_trait]
impl CommandHandler for UpdateIngestion
{
    async fn handle(&self, database_connection: &DatabaseConnection) -> Result<(), String>
    {
        let mut ingestion = block_on(async {
            Ingestion::find_by_id(self.ingestion_id)
                .one(database_connection)
                .await
                .expect("Ingestion not found")
        })
        .expect("Ingestion not found")
        .into_active_model();

        if let Some(name) = self.substance_name.as_ref()
        {
            ingestion.substance_name.set_if_not_equals(name.to_owned())
        }
        if let Some(amount) = self.dosage_amount.as_ref()
        {
            ingestion.dosage.set_if_not_equals(*amount as f32)
        }
        if let Some(unit) = self.dosage_unit.as_ref()
        {
            ingestion.dosage_unit.set_if_not_equals(unit.to_owned())
        }
        if let Some(date) = self.ingestion_date.as_ref()
        {
            ingestion.ingested_at.set_if_not_equals(date.to_utc())
        }
        if let Some(roa) = self.route_of_administration
        {
            ingestion
                .route_of_administration
                .set_if_not_equals(roa.serialize())
        }

        block_on(async {
            Ingestion::update(ingestion)
                .exec(database_connection)
                .await
                .expect("Failed to update ingestion")
        });

        Ok(())
    }
}
