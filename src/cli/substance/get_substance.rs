use crate::lib::CommandHandler;
use crate::lib::Context;
use crate::lib::dosage::Dosage;
use crate::lib::orm;
use crate::lib::orm::substance;
use crate::lib::route_of_administration::RouteOfAdministrationClassification;
use crate::lib::substance::DosageClassification;
use crate::lib::substance::PhaseClassification;
use clap::Parser;
use iso8601_duration::Duration;
use miette::IntoDiagnostic;
use miette::miette;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::ModelTrait;
use sea_orm::QueryFilter;
use sea_orm::prelude::async_trait::async_trait;
use std::str::FromStr;

#[derive(Parser, Debug)]
#[command(
    version,
    about = "Name of substance to query",
    long_about,
    aliases = vec!["create", "add"]
)]
pub struct GetSubstance
{
    #[arg(index = 1, value_name = "SUBSTANCE", required = true)]
    pub substance_name: String,
}

use futures::stream::FuturesUnordered;
use futures::stream::StreamExt;
use miette::Result;

#[async_trait]
impl CommandHandler<crate::lib::substance::Substance> for GetSubstance
{
    async fn handle<'a>(&self, context: Context<'a>) -> Result<crate::lib::substance::Substance>
    {
        let db_substance = substance::Entity::find()
            .filter(substance::Column::Name.contains(self.substance_name.to_lowercase()))
            .one(context.database_connection)
            .await
            .into_diagnostic()?;

        let db_substance = match db_substance
        {
            | Some(substance) => substance,
            | None => return Err(miette!("Error: Substance not found.")),
        };

        let routes_of_administration = db_substance
            .find_related(orm::substance_route_of_administration::Entity)
            .all(context.database_connection)
            .await
            .into_diagnostic()?;

        let mut substance = crate::lib::substance::Substance {
            name: db_substance.name,
            routes_of_administration: crate::lib::substance::RoutesOfAdministration::new(),
        };

        let db_connection = context.database_connection.clone();
        let route_futures = routes_of_administration.into_iter().map(|route| {
            let db = db_connection.clone();
            async move {
                // Resolve classifications
                let classification = RouteOfAdministrationClassification::from_str(&route.name)
                    .map_err(|e| miette!(format!("{:?}", e)))?;
                let mut roa = crate::lib::substance::RouteOfAdministration {
                    classification: classification.clone(),
                    dosages: Default::default(),
                    phases: Default::default(),
                };

                let dosages = route
                    .find_related(orm::substance_route_of_administration_dosage::Entity)
                    .all(&db)
                    .await
                    .into_diagnostic()?;

                for dosage in dosages
                {
                    let dosage_classification = DosageClassification::from_str(&*dosage.intensity)
                        .map_err(|_| miette!("Failed to parse dosage classification"))?;

                    let lower_bound = dosage.lower_bound_amount.map_or(0.0, |amount| {
                        Dosage::from_str(&format!("{:?} {}", amount, dosage.unit))
                            .unwrap()
                            .as_base_units()
                    });
                    let upper_bound = dosage.upper_bound_amount.map_or(f64::INFINITY, |amount| {
                        Dosage::from_str(&format!("{:?} {}", amount, dosage.unit))
                            .unwrap()
                            .as_base_units()
                    });

                    roa.dosages.insert(
                        dosage_classification,
                        crate::lib::substance::DosageRange::from(lower_bound..upper_bound),
                    );
                }

                let phases = route
                    .find_related(orm::substance_route_of_administration_phase::Entity)
                    .all(&db)
                    .await
                    .into_diagnostic()?;

                for phase in phases
                {
                    let classification = PhaseClassification::from_str(&*phase.classification)
                        .map_err(|_| miette!("Failed to parse phase classification"))?;

                    let lower_duration =
                        Duration::from_str(&phase.lower_duration.unwrap_or_default())
                            .map_err(|_| miette!("Failed to parse duration"))?;
                    let upper_duration =
                        Duration::from_str(&phase.upper_duration.unwrap_or_default())
                            .map_err(|_| miette!("Failed to parse duration"))?;

                    roa.phases.insert(
                        classification,
                        crate::lib::substance::DurationRange::from(lower_duration..upper_duration),
                    );
                }

                Ok::<_, miette::Report>((classification, roa))
            }
        });

        let mut route_stream = FuturesUnordered::from_iter(route_futures);

        while let Some(result) = route_stream.next().await
        {
            match result
            {
                | Ok((classification, roa)) =>
                {
                    substance
                        .routes_of_administration
                        .insert(classification, roa);
                }
                | Err(e) => return Err(e),
            }
        }

        print!("{}", &substance.to_string());
        Ok(substance)
    }
}

#[cfg(test)]
mod tests
{
    use super::*;
    use crate::cli::GetSubstance;
    use crate::cli::OutputFormat;
    use crate::lib::Context;
    use crate::lib::DATABASE_CONNECTION;
    use crate::lib::migrate_database;

    #[async_std::test]
    async fn should_return_caffeine()
    {
        migrate_database(&DATABASE_CONNECTION).await.unwrap();

        let context = Context {
            database_connection: &DATABASE_CONNECTION,
            stdout_format: OutputFormat::Pretty,
        };


        let command = GetSubstance {
            substance_name: "caffeine".to_string(),
        };

        let result = command.handle(context.clone()).await;
        assert!(result.is_ok(), "Query failed: {:?}", result);

        let matched_substances = substance::Entity::find()
            .filter(substance::Column::CommonNames.contains("caffeine"))
            .all(context.database_connection)
            .await
            .unwrap();

        assert!(
            matched_substances
                .iter()
                .any(|s| s.id.starts_with("e30c6c")),
            "No substance with ID starting with 'e30c6c' found"
        );
    }
}
