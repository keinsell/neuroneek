use crate::lib::dosage::Dosage;
use crate::lib::formatter::Formatter;
use crate::lib::orm::ingestion;
use crate::lib::route_of_administration::RouteOfAdministrationClassification;
use chrono::{DateTime, Local, TimeZone};
use chrono_humanize::HumanTime;
use core::convert::From;
use serde::Deserialize;
use serde::Serialize;
use std::fmt::Debug;
use std::fmt::Display;
use tabled::Table;
use tabled::Tabled;
use typed_builder::TypedBuilder;

fn display_date(date: &DateTime<Local>) -> String {
    HumanTime::from(*date).to_string()
}

#[derive(Debug, Serialize, Deserialize, Tabled, TypedBuilder)]
pub struct IngestionViewModel
{
    #[tabled(rename = "ID")]
    pub id: i32,
    #[tabled(rename = "Substance")]
    pub substance_name: String,
    #[tabled(rename = "ROA")]
    pub route: String,
    #[tabled(rename = "Dosage")]
    pub dosage: String,
    #[tabled(rename = "Ingestion Date")]
    #[tabled(display_with = "display_date")]
    pub ingested_at: DateTime<Local>,
}

impl Formatter for IngestionViewModel {}

// TODO: Rethink need for view models
// Direct implementation of display functions
// can be added to domain model which would replace
// view model completly
impl From<ingestion::Model> for IngestionViewModel
{
    fn from(model: ingestion::Model) -> Self
    {
        let dosage = Dosage::from_base_units(model.dosage.into());
        let route_enum: RouteOfAdministrationClassification =
            model.route_of_administration.parse().unwrap_or_default();
        let local_ingestion_date =
            chrono::Local::from_utc_datetime(&chrono::Local, &model.ingested_at);

        Self::builder()
            .id(model.id)
            .substance_name(model.substance_name)
            .route(RouteOfAdministrationClassification::to_string(&route_enum))
            .dosage(dosage.to_string())
            .ingested_at(local_ingestion_date)
            .build()
    }
}

impl Display for IngestionViewModel
{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result
    {
        // TODO: Implement formatter for pretty and json
        let table = Table::new(vec![self]).to_string();
        f.write_str(table.as_ref())
    }
}
