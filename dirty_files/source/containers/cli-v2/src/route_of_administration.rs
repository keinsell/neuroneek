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
    /// Oral administration is the most common route of administration for most substance classes. This route allows a substance to be absorbed through blood vessels lining the stomach and intestines. The onset is generally slower than other methods of ingestion as it must undergo first-pass metabolism through the liver (may vary greatly between individual substances).
    #[default]
    Oral,
    Rectal,
    Smoked,
    Sublingual,
    Transdermal,
}

impl RouteOfAdministrationClassification
{
    pub fn deserialize(s: &str) -> Self { serde_json::from_str(s).expect("Deserialization failed") }

    pub fn serialize(&self) -> String { serde_json::to_string(self).expect("Serialization failed") }
}

#[cfg(test)]
mod tests
{
    use super::RouteOfAdministrationClassification;

    #[test]
    fn should_deserialize_route_of_administration_classification()
    {
        let route = RouteOfAdministrationClassification::Oral;
        let serialized = route.serialize();
        assert_eq!(serialized, "\"oral\"");

        let deserialized: RouteOfAdministrationClassification =
            RouteOfAdministrationClassification::deserialize(&serialized);
        assert_eq!(deserialized, RouteOfAdministrationClassification::Oral);
    }
}
