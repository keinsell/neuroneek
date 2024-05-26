use structopt::StructOpt;

#[derive(StructOpt, Debug)]
#[structopt(
    name = "neuronek",
    about = "Minimal visable product of neuronek which have pure local functionality without prettifiers."
)]
struct Entrypoint {
    #[structopt(subcommand)]
    ingestion: Ingestions,
}


#[derive(StructOpt, Debug)]
enum Ingestions {
    #[structopt(name = "create")]
    IngestionCreate {
        #[structopt(short, long)]
        substance_name: String,
    },
    #[structopt(name = "delete")]
    IngestionDelete {
        #[structopt(short, long)]
        ingestion_id: i32,
    },
}

fn main() {
    let cli = Entrypoint::from_args();

    match cli.ingestion {
        Ingestions::IngestionCreate { .. } => {
            println!("Create Ingestion!")
        }
        Ingestions::IngestionDelete { .. } => {
            println!("Delete Ingestion!")
        }
    }
}