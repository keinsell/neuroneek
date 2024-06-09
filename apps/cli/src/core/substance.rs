use std::collections::HashMap;

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
