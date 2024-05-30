use structopt::StructOpt;

#[derive(StructOpt, Debug)]
pub struct CreateIngestion {
    #[structopt(short, long)]
    pub substance_name: String,
    #[structopt(short, long)]
    pub dosage: String,
    #[structopt(short = "t", long = "time", default_value = "now")]
    pub ingested_at: String,
}
