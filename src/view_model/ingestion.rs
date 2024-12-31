use crate::lib::dosage::Dosage;
use crate::lib::orm::ingestion;
use crate::lib::output::Formatter;
use measurements::Measurement;
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

impl From<ingestion::Model> for ViewModel
{
    fn from(model: ingestion::Model) -> Self
    {
        Self::builder()
            .id(model.id)
            .substance_name(model.substance_name)
            .route(model.route_of_administration)
            .dosage(Dosage::from_base_units(model.dosage as f64).to_string())
            .ingested_at(model.ingested_at.to_string())
            .build()
    }
}

impl Display for ViewModel
{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result
    {
        let table = Table::new(vec![self]).to_string();
        f.write_str(table.as_ref())
    }
}
