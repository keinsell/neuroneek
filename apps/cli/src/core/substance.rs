use std::collections::HashMap;

use crate::core::phase::Phase;
use crate::core::route_of_administration::{
    RouteOfAdministration, RouteOfAdministrationClassification,
};

pub type RoutesOfAdministration =
    HashMap<RouteOfAdministrationClassification, Option<RouteOfAdministration>>;

#[derive(Debug)]
pub struct Substance {
    // pub id: String,
    pub name: String,
    pub routes_of_administration: RoutesOfAdministration,
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
