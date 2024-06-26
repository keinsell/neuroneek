use std::fmt::Display;
use std::str::FromStr;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Eq, Hash)]
#[serde(rename_all = "snake_case")]
pub enum RouteOfAdministrationClassification {
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
