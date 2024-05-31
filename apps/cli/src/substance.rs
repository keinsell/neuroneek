use rust_embed::{Embed, EmbeddedFile};
use sea_orm::*;
use sea_orm::ActiveValue::Set;
use serde::{Deserialize, Serialize};
use tabled::Table;

use crate::entities::{self, prelude::Substance, substance::ActiveModel};

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
    pub name: Name,
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
    Mg,
    #[serde(rename = "mg/kg of body weight")]
    MgKgOfBodyWeight,
    #[serde(rename = "μg")]
    PurpleG,
    Seeds,
    #[serde(rename = "g")]
    UnitG,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Name {
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
pub async fn refresh_substances(db: &DatabaseConnection) {
    let json_data: EmbeddedFile = Asset::get("neuronek-2024-05-30.json").unwrap();
    let json_string = std::str::from_utf8(json_data.data.as_ref())
        .expect("Failed to read bundled information about substances");
    let substances: SubstanceInformation = serde_json::from_str(json_string).unwrap();

    // Update the database with the substance information
    // If one substance already exists by name, we should update it instead of inserting a new one
    // TODO: Make this parallel and wrap this into one transaction

    for substance_info in substances {
        let mut substance: ActiveModel = ActiveModel {
            id: Default::default(),
            name: Default::default(),
            common_names: Default::default(),
            brand_names: Set(String::new().to_string()),
            substitute_name: Set(String::new().to_string()),
            chemical_classes: Set(String::new().to_string()),
            description: Set(String::new().to_string()),
        };

        let existing_substance = Substance::find()
            .filter(entities::substance::Column::Name.eq(&substance_info.name))
            .one(db)
            .await
            .unwrap();

        println!("{:?}", existing_substance);

        if existing_substance.is_none() {
            substance.name = Set(substance_info.name);
            substance.common_names = Set(substance_info.common_names.join(","));

            println!("{:?}", substance);
            Substance::insert(substance).exec(db).await.unwrap();
        } else {
            substance.id = Set(existing_substance.unwrap().id);
            substance.common_names = Set(substance_info.common_names.join(","));

            println!("{:?}", substance);
            Substance::update(substance).exec(db).await.unwrap();
        }
    }

    // Print all substances parsed from the JSON data
    // (single name for single line)
    let substances = Substance::find().all(db).await.unwrap();

    let string_table = Table::new(substances);
    println!("{}", string_table);
}

pub async fn list_substances(db: &DatabaseConnection) {
    let substances = Substance::find().all(db).await.unwrap();
    
    let table = Table::new(substances);

    println!("{}", table);
}
