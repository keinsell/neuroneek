use std::collections::HashMap;

use crate::substance::route_of_administration::route_of_administration::RouteOfAdministration;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;

pub type RoutesOfAdministration =
    HashMap<RouteOfAdministrationClassification, Option<RouteOfAdministration>>;

#[derive(Debug)]
pub struct Substance {
    // pub id: String,
    pub name: String,
    pub routes_of_administration: RoutesOfAdministration,
}
