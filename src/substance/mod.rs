pub mod route_of_administration;

use crate::core::CommandHandler;
use clap::Parser;
use clap::Subcommand;
pub mod error;
pub mod repository;

use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use hashbrown::HashMap;
use serde::Deserialize;
use serde::Serialize;
use std::str::FromStr;


pub type RoutesOfAdministration =
    HashMap<RouteOfAdministrationClassification, RouteOfAdministration>;

#[derive(Debug, Clone)]
pub struct Substance
{
    pub name: String,
    pub routes_of_administration: RoutesOfAdministration,
}

use crate::cli::formatter::Formatter;
use route_of_administration::RouteOfAdministration;
use tabled::Tabled;

pub(crate) type SubstanceTable = crate::database::entities::substance::Model;
