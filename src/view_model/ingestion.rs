use crate::lib::dosage::Dosage;
use crate::lib::formatter::Formatter;
use crate::lib::orm::ingestion;
use crate::lib::route_of_administration::RouteOfAdministrationClassification;
use chrono::TimeZone;
use chrono_humanize::HumanTime;
use core::convert::From;
use serde::Deserialize;
use serde::Serialize;
use std::fmt::Debug;
use std::fmt::Display;
use tabled::Table;
use tabled::Tabled;
use typed_builder::TypedBuilder;

#[derive(Debug, Serialize, Deserialize, Tabled, TypedBuilder)]
pub struct ViewModel
{
    pub id: i32,
    pub substance_name: String,
    pub route: String,
    pub dosage: String,
    pub ingested_at: String,
}

impl Formatter for ViewModel {}

// TODO: Rethink need for view models
// Direct implementation of display functions
// can be added to domain model which would replace
// view model completly
impl From<ingestion::Model> for ViewModel
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
            .route(route_enum.to_string())
            .dosage(dosage.to_string())
            .ingested_at(HumanTime::from(local_ingestion_date).to_string())
            .build()
    }
}

impl Display for ViewModel
{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result
    {
        // TODO: Implement formatter for pretty and json
        let table = Table::new(vec![self]).to_string();
        f.write_str(table.as_ref())
    }
}
