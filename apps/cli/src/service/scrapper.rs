use rust_embed::{Embed, EmbeddedFile};
use sea_orm::ActiveValue::Set;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use serde::{Deserialize, Serialize};
use tabled::Table;
use crate::db::prelude::SubstanceEntity;
use crate::db::substance;
use crate::{db};
use crate::service::roa::{create_route_of_administration, CreateRouteOfAdministration, RouteOfAdministrationClassification};

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
pub async fn refresh_substances(db: &DatabaseConnection) {
    let json_data: EmbeddedFile = Asset::get("neuronek-2024-05-30.json").unwrap();
    let json_string = std::str::from_utf8(json_data.data.as_ref())
        .expect("Failed to read bundled information about substances");
    let substances: SubstanceInformation = serde_json::from_str(json_string).unwrap();

    // Update the database with the substance information
    // If one substance already exists by name, we should update it instead of inserting a new one
    // TODO: Make this parallel and wrap this into one transaction

    for substance_info in substances {

        let substance_name: String = substance_info.name.clone();

        let mut substance_active_model: substance::ActiveModel = substance::ActiveModel {
            id: Default::default(),
            name: Default::default(),
            common_names: Default::default(),
            brand_names: Set(String::new().to_string()),
            substitute_name: Set(String::new().to_string()),
            chemical_classes: Set(String::new().to_string()),
            description: Set(String::new().to_string()),
        };

        let mut existing_substance = substance::Entity::find()
            .filter(db::substance::Column::Name.eq(&substance_info.name))
            .one(db)
            .await
            .unwrap();

        println!("{:?}", existing_substance);

        if existing_substance.is_none() {
            substance_active_model.name = Set(substance_info.name);
            substance_active_model.common_names = Set(substance_info.common_names.join(","));
            println!("{:?}", substance_active_model);
            SubstanceEntity::insert(substance_active_model).exec(db).await.unwrap();
        } else {
            substance_active_model.id = Set(existing_substance.unwrap().id);
            substance_active_model.common_names = Set(substance_info.common_names.join(","));
            println!("{:?}", substance_active_model);
            SubstanceEntity::update(substance_active_model).filter(db::substance::Column::Id.eq(substance_name.clone())).exec(db).await.unwrap();
        }

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
                substance_name: substance_name.clone(),
            };

            create_route_of_administration(&db, create_roa_dto).await;
            // Map creation of dosages
            // Map creation of phases
        }
    }

    // Print all substances parsed from the JSON data
    // (single name for single line)
    let substances = SubstanceEntity::find().all(db).await.unwrap();

    let string_table = Table::new(substances);
    println!("{}", string_table);
}