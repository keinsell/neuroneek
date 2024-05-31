use chrono::{DateTime, Utc};
use sea_orm::{ActiveValue};
use uom::si::f32::Mass;
use crate::core::mass_range::serialize_mass_to_string;
use crate::db::ingestion::{ActiveModel};
use crate::db::prelude::{ Substance};
use crate::service::roa::RouteOfAdministrationClassification;

pub struct MagicIngestion {
    id: i32,
    substance_name: String,
    substance: Substance,
    ingested_at: DateTime<Utc>,
    dosage: Mass,
    route_of_administration: RouteOfAdministrationClassification,
}

impl MagicIngestion {
    pub fn new(
        id: i32,
        substance_name: String,
        substance: Substance,
        ingested_at: DateTime<Utc>,
        dosage: Mass,
        route_of_administration: RouteOfAdministrationClassification,
    ) -> Self {
        Self {
            id,
            substance_name,
            substance,
            ingested_at,
            dosage,
            route_of_administration,
        }
    }

    pub fn to_model(&self) -> ActiveModel {
        ActiveModel {
            id: ActiveValue::Set(self.id),
            ingested_at: ActiveValue::Set(self.ingested_at.to_rfc3339()),
            dosage: ActiveValue::Set(serialize_mass_to_string(self.dosage)),
            substance_name: ActiveValue::Set(self.substance_name.clone()),
            route_of_administration: ActiveValue::Set(
                serde_json::to_string(&self.route_of_administration).unwrap(),
            ),
        }
    }
}
