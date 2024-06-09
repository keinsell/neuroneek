use std::collections::HashMap;

use crate::core::phase::Phase;
use crate::core::route_of_administration::{
    RouteOfAdministration, RouteOfAdministrationClassification,
};

pub type RoutesOfAdministration =
    HashMap<RouteOfAdministrationClassification, Option<RouteOfAdministration>>;

#[derive(Debug)]
pub struct Substance {
    pub id: String,
    pub name: String,
    pub common_names: Vec<String>,
    pub routes_of_administration: RoutesOfAdministration,
}

pub fn get_route_of_administration_by_classification_and_substance(
    classification: &RouteOfAdministrationClassification,
    substance: &Substance,
) -> Result<RouteOfAdministration, &'static str> {
    match substance.routes_of_administration.get(&classification) {
        Some(route) => match route {
            Some(route) => Ok(route.clone()),
            None => Err("Route of administration not found"),
        },
        None => Err("Route of administration classification not found"),
    }
}

pub fn get_phases_by_route_of_administration(
    route_of_administration: &RouteOfAdministration,
) -> Vec<Phase> {
    route_of_administration
        .phases
        .clone()
        .into_iter()
        .map(|phase| phase.1)
        .collect()
}
