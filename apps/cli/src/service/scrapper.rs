use crate::db;
use crate::db::prelude::Substance;
use crate::db::substance;
use crate::service::dosage::{create_dosage, CreateDosage};
use crate::service::roa::{
    create_route_of_administration, CreateRouteOfAdministration,
    RouteOfAdministrationClassification,
};
use rust_embed::{Embed, EmbeddedFile};
use sea_orm::ActiveValue::Set;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use serde::{Deserialize, Serialize};
use serde_json::to_string;
use tabled::Table;

#[derive(Embed)]
#[folder = "public/"]
struct Asset;

pub type SubstanceInformation = Vec<SubstanceInformationElement>;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SubstanceInformationElement {
    pub id: String,
    pub name: String,
    pub common_names: Vec<String>,
    pub psychoactive_classes: Vec<PsychoactiveClass>,
    pub chemical_classes: Vec<String>,
    pub routes_of_administration: Vec<RoutesOfAdministration>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum PsychoactiveClass {
    Antidepressants,
    Antipsychotic,
    #[serde(rename = "Atypical neuroleptic")]
    AtypicalNeuroleptic,
    Cannabinoid,
    Deliriant,
    Depressant,
    Dissociatives,
    #[serde(rename = "")]
    Empty,
    Entactogen,
    Eugeroics,
    Hallucinogens,
    Hypnotic,
    Nootropic,
    Oneirogen,
    Opioids,
    Psychedelic,
    Stimulants,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RoutesOfAdministration {
    pub id: String,
    pub substance_name: String,
    pub name: DumpRoa,
    pub bioavailability: i64,
    pub dosage: Vec<Dosage>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Dosage {
    pub id: String,
    pub intensivity: Intensivity,
    pub amount_min: f64,
    pub amount_max: f64,
    pub unit: Unit,
    #[serde(rename = "perKilogram")]
    pub per_kilogram: bool,
    #[serde(rename = "routeOfAdministrationId")]
    pub route_of_administration_id: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Intensivity {
    Common,
    Heavy,
    Light,
    Strong,
    Threshold,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum Unit {
    #[serde(rename = "µg")]
    G,
    #[serde(rename = "mL")]
    ML,
    #[serde(rename = "mg")]
    Mg,
    #[serde(rename = "mg/kg of body weight")]
    MgKgOfBodyWeight,
    #[serde(rename = "μg")]
    Migrograms,
    #[serde(rename = "seeds")]
    Seeds,
    #[serde(rename = "g")]
    Grams,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum DumpRoa {
    Buccal,
    Inhaled,
    Insufflated,
    Intramuscular,
    Intravenous,
    Oral,
    Rectal,
    Smoked,
    Sublingual,
    Transdermal,
}

/// Function will request all substances from the public Neuronek API
/// and will refresh the local database with the new information, this
/// is useful when public data is updated and clients can have access
/// to latest batch of information, in other cases there should be a fallback
/// mechanism to database file bundled with the application.
pub async fn scrape_local_database(db: &DatabaseConnection) {
    let json_data: EmbeddedFile = Asset::get("neuronek-2024-05-30.json").unwrap();
    let json_string = std::str::from_utf8(json_data.data.as_ref())
        .expect("Failed to read bundled information about substances");
    let substances: SubstanceInformation = serde_json::from_str(json_string).unwrap();

    // Update the database with the substance information
    // If one substance already exists by name, we should update it instead of inserting a new one
    // TODO: Make this parallel and wrap this into one transaction

    for substance_info in substances {
        let mut substance_active_model: substance::ActiveModel = substance::ActiveModel {
            id: Default::default(),
            name: Set(substance_info.name.clone()),
            common_names: Set(substance_info.common_names.join(",")),
            brand_names: Set(String::new().to_string()),
            substitute_name: Set(String::new().to_string()),
            chemical_classes: Set(String::new().to_string()),
            description: Set(String::new().to_string()),
        };

        let substance = match substance::Entity::find()
            .filter(db::substance::Column::Name.eq(&substance_info.name))
            .one(db)
            .await
            .unwrap()
        {
            Some(existing_substance) => existing_substance,
            None => {
                substance_active_model.name = Set(substance_info.name.clone());
                substance_active_model.common_names = Set(substance_info.common_names.join(","));
                Substance::insert(substance_active_model)
                    .exec_with_returning(db)
                    .await
                    .unwrap()
            }
        };

        for roa in substance_info.routes_of_administration {
            fn match_dump_route_of_administration_name_with_internal_route_of_administration_name(
                input: &DumpRoa,
            ) -> RouteOfAdministrationClassification {
                match input {
                    DumpRoa::Buccal => RouteOfAdministrationClassification::Buccal,
                    DumpRoa::Inhaled => RouteOfAdministrationClassification::Inhaled,
                    DumpRoa::Insufflated => RouteOfAdministrationClassification::Insufflated,
                    DumpRoa::Intramuscular => RouteOfAdministrationClassification::Intramuscular,
                    DumpRoa::Intravenous => RouteOfAdministrationClassification::Intravenous,
                    DumpRoa::Oral => RouteOfAdministrationClassification::Oral,
                    DumpRoa::Rectal => RouteOfAdministrationClassification::Rectal,
                    DumpRoa::Smoked => RouteOfAdministrationClassification::Smoked,
                    DumpRoa::Sublingual => RouteOfAdministrationClassification::Sublingual,
                    DumpRoa::Transdermal => RouteOfAdministrationClassification::Transdermal,
                }
            }

            let create_roa_dto: CreateRouteOfAdministration = CreateRouteOfAdministration {
                classification: match_dump_route_of_administration_name_with_internal_route_of_administration_name(&roa.name),
                substance_name: substance.name.clone(),
            };

            let created_roa = match create_route_of_administration(db, create_roa_dto).await {
                Ok(roa) => roa,
                Err(_) => continue,
            };

            for dosage in roa.dosage {
                fn map_dump_intensivity_to_dosage_intensivity_classification(
                    input: &Intensivity,
                ) -> crate::service::dosage::DosageClassification {
                    match input {
                        Intensivity::Common => crate::service::dosage::DosageClassification::Common,
                        Intensivity::Heavy => crate::service::dosage::DosageClassification::Heavy,
                        Intensivity::Light => crate::service::dosage::DosageClassification::Light,
                        Intensivity::Strong => crate::service::dosage::DosageClassification::Strong,
                        Intensivity::Threshold => {
                            crate::service::dosage::DosageClassification::Threshold
                        }
                    }
                }

                let create_dosage_input: CreateDosage = CreateDosage {
                    route_of_administration_id: created_roa.id,
                    intensity: map_dump_intensivity_to_dosage_intensivity_classification(
                        &dosage.intensivity,
                    ),
                    range_max: dosage.amount_max as i32,
                    range_min: dosage.amount_min as i32,
                    unit: to_string(&dosage.unit).unwrap(),
                };

                create_dosage(db, create_dosage_input).await;
            }
        }
    }

    // Print all substances parsed from the JSON data
    // (single name for single line)
    let substances = Substance::find().all(db).await.unwrap();

    let string_table = Table::new(substances);
    println!("{}", string_table);
}
