// TODO: Search substance (with typo-tolerance and alternative names)
// TODO: Extractor: Get Dosage Classification by Dosage Amount

use fuzzy_matcher::FuzzyMatcher;
use fuzzy_matcher::skim::SkimMatcherV2;
use sea_orm::*;

use crate::core::substance::Substance;

/// This function will query database for a given substance name and will rebuild
/// substance structure from database, such structure is well more adjusted to
/// data analytics than serialized information from database.
pub async fn get_substance_by_name(name: &str) -> Option<Substance> {
    todo!()
}

pub async fn search_substance(
    db: &DatabaseConnection,
    query: &str,
) -> Option<db::substance::Model> {
    let substances = db::substance::Entity::find().all(db).await.unwrap();
    let matcher = SkimMatcherV2::default();
    let mut results = Vec::new();

    for substance in substances {
        let score = matcher.fuzzy_match(&substance.name, query);
        if let Some(score) = score {
            if score > 75 {
                results.push(substance);
            }
        }
    }

    if results.is_empty() {
        None
    } else {
        Some(results[0].clone())
    }
}
