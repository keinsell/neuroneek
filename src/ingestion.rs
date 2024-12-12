use crate::db;
use crate::db::ingestion;
use crate::db::prelude::Ingestion;
use crate::lib::dosage::parse_dosage;
use crate::lib::dosage::Dosage;
use crate::lib::route_of_administration::RouteOfAdministrationClassification;
use crate::lib::{CommandHandler, Context};
use async_std::task::block_on;
use chrono::{DateTime, Local, Utc};
use clap::{Parser, Subcommand};
use measurements::Measurement;
use miette::IntoDiagnostic;
use sea_orm::{ActiveValue, EntityTrait, QueryOrder, QuerySelect};
use sea_orm_migration::async_trait::async_trait;
use serde::{Deserialize, Serialize};
use std::str::FromStr;
use tabled::{Table, Tabled};

#[derive(Debug, Serialize, Deserialize, Tabled)]
pub struct ViewModel
{
    pub id: i32,
    pub substance_name: String,
    pub route: String,
    pub dosage: String,
    pub taken_at: DateTime<Local>,
}

impl From<ingestion::Model> for ViewModel
{
    fn from(model: ingestion::Model) -> Self
    {
        Self {
            id: model.id,
            substance_name: model.substance_name,
            route: model.route_of_administration,
            dosage: Dosage::from_base_units(model.dosage).to_string(),
            taken_at: DateTime::<Utc>::from(model.ingested_at).with_timezone(&Local),
        }
    }
}


#[derive(Parser, Debug)]
#[command(version, about = "Store information about new ingestion", long_about)]
pub struct LogIngestion {
    /// Name of the substance ingested.
    #[arg(short = 's', long)]
    pub substance_name: String,
    /// Dosage in general
    #[arg(short = 'd', long, value_parser=parse_dosage)]
    pub dosage: Dosage,
    /// Date of ingestion, by default current date is used if not provided.
    ///
    /// Date can be provided as timestamp and in human-readable format such as
    /// "today 10:00", "yesterday 13:00", "monday 15:34" which will be later
    /// parsed into proper timestamp.
    #[arg(
        short='t',
        long,
        default_value_t=Local::now(),
    )]
    pub ingestion_date: DateTime<Local>,
    #[arg(short = 'r', long, default_value = "oral", value_enum)]
    pub route_of_administration: RouteOfAdministrationClassification,
}

#[async_trait]
impl CommandHandler for LogIngestion {
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()> {
        let pubchem_substance_name = pubchem::Compound::with_name(&self.substance_name).title().into_diagnostic()?;
        let created_ingestion = Ingestion::insert(db::ingestion::ActiveModel {
            id: ActiveValue::default(),
            substance_name: ActiveValue::Set(pubchem_substance_name.to_lowercase()),
            route_of_administration: ActiveValue::Set(
                serde_json::to_string(&self.route_of_administration).unwrap(),
            ),
            dosage: ActiveValue::Set(self.dosage.as_base_units()),
            ingested_at: ActiveValue::Set(self.ingestion_date.to_utc()),
            updated_at: ActiveValue::Set(Local::now().to_utc()),
            created_at: ActiveValue::Set(Local::now().to_utc()),
        })
            .exec_with_returning(context.database_connection)
            .await
            .into_diagnostic();

        Ok(created_ingestion.map(|ingestion| {
            println!("{:#?}", ingestion);
            ()
        })?)
    }
}

#[derive(Parser, Debug)]
#[command(version, about = "List all ingestions", long_about)]
pub struct ListIngestions
{
    /// Defines the amount of ingestion to display
    #[arg(short = 'l', long, default_value_t = 10)]
    pub limit: u64,
    // TODO: Query order by field
    // TODO: Return format (JSON/Pretty)
}


#[async_trait]
impl CommandHandler for ListIngestions
{
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        let ingestions = block_on(async {
            Ingestion::find()
                .order_by_desc(db::ingestion::Column::IngestedAt)
                .limit(Some(self.limit))
                .all(context.database_connection)
                .await
                .map_err(|e| e.to_string())
        }).unwrap();

        if ingestions.is_empty()
        {
            println!("No ingestions found.");
            return Ok(());
        }

        let table = Table::new(ingestions.iter().map(|i| ViewModel::from(i.clone())))
            .with(tabled::settings::Style::modern())
            .to_string();

        println!("{}", table);

        Ok(())
    }
}


#[derive(Debug, Subcommand)]
pub(super) enum IngestionCommands {
    Log(LogIngestion),
    List(ListIngestions),
}

#[derive(Debug, Parser)]
pub(super) struct IngestionCommand {
    #[command(subcommand)]
    commands: IngestionCommands,
}

#[async_trait]
impl CommandHandler for IngestionCommand {
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()> {
        match &self.commands {
            IngestionCommands::Log(log_ingestion) => log_ingestion.handle(context).await,
            IngestionCommands::List(list_ingestions) => list_ingestions.handle(context).await,
        }
    }
}
