use serde::Deserialize;
use serde::Serialize;

#[derive(
    clap::ValueEnum, Debug, Clone, Copy, Default, PartialEq, Serialize, Deserialize, Eq, Hash,
)]
#[serde(rename_all = "snake_case")]
pub enum RouteOfAdministrationClassification
{
    Buccal,
    Inhaled,
    Insufflated,
    Intramuscular,
    Intravenous,
    /// Oral administration is the most common route of administration for most
    /// substance classes. This route allows a substance to be absorbed through
    /// blood vessels lining the stomach and intestines. The onset is generally
    /// slower than other methods of ingestion as it must undergo first-pass
    /// metabolism through the liver (may vary greatly between individual
    /// substances).
    #[default]
    Oral,
    Rectal,
    Smoked,
    Sublingual,
    Transdermal,
}
