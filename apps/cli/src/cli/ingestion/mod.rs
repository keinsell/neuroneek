use structopt::StructOpt;
use crate::cli::ingestion::create_ingestion::CreateIngestionFeature;
use crate::cli::ingestion::delete_ingestion::DeleteIngestion;

pub(crate) mod create_ingestion;
pub(crate) mod delete_ingestion;


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
}
