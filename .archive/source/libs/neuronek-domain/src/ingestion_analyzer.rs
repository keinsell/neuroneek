pub struct IngestionAnalysis {
    pub ingestion: String,
}

pub trait IngestionAnalyzer {
    fn analyze(&self, ingestion: IngestionAnalysis) -> Result<IngestionAnalysis, String>;
}
