// TODO: Search substance (with typo-tolerance and alternative names)
// TODO: Extractor: Get Dosage Classification by Dosage Amount

use crate::db::substance;
use fuzzy_matcher::skim::SkimMatcherV2;
use fuzzy_matcher::FuzzyMatcher;
use sea_orm::*;

pub async fn search_substance(db: &DatabaseConnection, query: &str) -> Option<substance::Model> {
    let substances = substance::Entity::find().all(db).await.unwrap();
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
