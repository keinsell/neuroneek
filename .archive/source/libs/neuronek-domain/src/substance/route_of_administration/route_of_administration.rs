use std::collections::HashMap;

use crate::substance::route_of_administration::dosages::DosageClassification;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;

#[derive(Debug, Clone)]
pub struct RouteOfAdministrationPhases(HashMap<String, String>);

#[derive(Debug, Clone)]
pub struct RouteOfAdministrationDosages(HashMap<DosageClassification, String>);

#[derive(Debug, Clone)]
pub struct RouteOfAdministration {
    pub classification: RouteOfAdministrationClassification,
    pub dosages: RouteOfAdministrationDosages,
    pub phases: RouteOfAdministrationPhases,
}
