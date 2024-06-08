use std::collections::HashMap;

use crate::core::route_of_administration::{
    RouteOfAdministration, RouteOfAdministrationClassification,
};

pub type RoutesOfAdministration =
    HashMap<RouteOfAdministrationClassification, Option<RouteOfAdministration>>;

#[derive()]
pub struct Substance {
    id: String,
    name: String,
    common_names: Vec<String>,
    routes_of_administration: RoutesOfAdministration,
}
