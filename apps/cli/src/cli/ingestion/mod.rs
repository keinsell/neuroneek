use crate::cli::ingestion::create_ingestion::CreateIngestionFeature;
use crate::cli::ingestion::delete_ingestion::DeleteIngestion;
use structopt::StructOpt;

pub(crate) mod create_ingestion;
pub(crate) mod delete_ingestion;
pub(crate) mod plan_ingestion;

#[derive(StructOpt, Debug)]
pub enum IngestionCommand {
    #[structopt(
        name = "create",
        about = "Create new ingestion by providing substance name and dosage in string."
    )]
    Create(CreateIngestionFeature),
    #[structopt(name = "delete")]
    IngestionDelete(DeleteIngestion),
    #[structopt(name = "list", about = "List all ingestion's in table")]
    IngestionList {},
    #[structopt(name = "plan", about = "Plan ingestion without saving it to database.")]
    Plan(plan_ingestion::PlanIngestionCommand),
}
