use structopt::StructOpt;

use crate::cli::ingestion::create_ingestion::handle_create_ingestion;
use crate::cli::ingestion::delete_ingestion::delete_ingestion;
use crate::cli::ingestion::IngestionCommand;
use crate::cli::ingestion::plan_ingestion::handle_plan_ingestion;
use crate::cli::substance::list_substances::list_substances;
use crate::ingestion::list_ingestion;
use crate::orm;

#[derive(StructOpt, Debug)]
#[structopt(
    name = "neuronek",
    about = "Minimal visible product of neuronek which have pure local functionality without prettifiers."
)]
struct CommandLineInterface {
    #[structopt(subcommand)]
    command: Commands,
}

#[derive(StructOpt, Debug)]
enum Commands {
    #[structopt(
        name = "substance",
        about = "Get information about substances.",
        alias = "s"
    )]
    Substance(SubstanceCommand),
    #[structopt(
        name = "ingestion",
        about = "Manipulate, view and delete ingestions.",
        alias = "i"
    )]
    Ingestion(IngestionCommand),
}

#[derive(StructOpt, Debug)]
enum SubstanceCommand {
    #[structopt(name = "list")]
    ListSubstances {},
}

#[derive(StructOpt, Debug)]
enum DataManagementCommand {
    #[structopt(name = "path", about = "Returns the path to the data file")]
    Path {},
    #[structopt(
        name = "refresh-substances",
        about = "Refreshes local database with cloud datasource"
    )]
    RefreshDatasource {},
}

pub async fn cli() {
    let cli = CommandLineInterface::from_args();

    // #[cfg(feature = "dev")]
    // {
    //     let db = match orm::setup_database().await {
    //         Ok(db) => db,
    //         Err(error) => panic!("Could not connect to database: {}", error),
    //     };

    //     match Migrator::reset(db.into_schema_manager_connection()).await {
    //         Ok(_) => println!("Development database reset!"),
    //         Err(error) => panic!("Error applying migrations: {}", error),
    //     };
    // }

    let db = match orm::setup_database().await {
        Ok(db) => db,
        Err(error) => panic!("Could not connect to database: {}", error),
    };

    // let pending_migrations =
    //     match Migrator::get_pending_migrations(&db.into_schema_manager_connection()).await {
    //         Ok(pending_migrations) => pending_migrations,
    //         Err(error) => panic!("Could not get pending migrations: {}", error),
    //     };
    //
    // // Check if the specific migration is in the list of pending migrations
    // let specific_migration_exists = pending_migrations.iter().any(|migration| {
    //     migration.name() == "m20240530_215436_add_ingestion_route_of_administration"
    // });
    //
    // // Before applying migration perform snapshot of the database
    // // This is done to prevent data loss in case of migration failure
    //
    // if !pending_migrations.is_empty() {
    //     orm::snapshot_database().await;
    // }
    //
    // match Migrator::up(db.into_schema_manager_connection(), None).await {
    //     Ok(_) => debug!("Migrations applied"),
    //     Err(error) => panic!("Could not migrate database schema: {}", error),
    // };
    //
    // // If the specific migration was applied, scrape the bundled JSON file
    // if specific_migration_exists {
    //     scrape_local_database(&db).await;
    // }

    match cli.command {
        Commands::Ingestion(ingestion) => match ingestion {
            IngestionCommand::Create(create_ingestion_command) => {
                handle_create_ingestion(create_ingestion_command, &db).await
            }
            IngestionCommand::IngestionDelete(delete_ingestion_command) => {
                delete_ingestion(&db, delete_ingestion_command.ingestion_id).await
            }
            IngestionCommand::IngestionList { .. } => list_ingestion(&db).await,
            IngestionCommand::Plan(command) => handle_plan_ingestion(command).await,
        },
        Commands::Substance(substance) => match substance {
            SubstanceCommand::ListSubstances {} => list_substances(&db).await,
        },
    }
}
