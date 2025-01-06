use crate::lib::dosage::Dosage;
use crate::lib::route_of_administration::RouteOfAdministrationClassification;
use crate::lib::substance::DosageClassification;
use crate::lib::substance::DosageRange;
use crate::lib::substance::PhaseClassification;
use crate::lib::substance::Substance;
use crate::orm;
use crate::orm::substance;
use futures::StreamExt;
use futures::stream::FuturesUnordered;
use iso8601_duration::Duration;
use miette::IntoDiagnostic;
use miette::miette;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::ModelTrait;
use sea_orm::QueryFilter;
use std::str::FromStr;

pub async fn get_substance_by_name(
    name: &str,
    db: &sea_orm::DatabaseConnection,
) -> miette::Result<Substance>
{
    let db_substance = substance::Entity::find()
        .filter(substance::Column::Name.contains(name.to_lowercase()))
        .one(db)
        .await
        .into_diagnostic()?;

    let db_substance = match db_substance
    {
        | Some(substance) => substance,
        | None => return Err(miette!("Error: Substance not found.")),
    };

    let routes_of_administration = db_substance
        .find_related(orm::substance_route_of_administration::Entity)
        .all(db)
        .await
        .into_diagnostic()?;

    let mut substance = crate::lib::substance::Substance {
        name: db_substance.name,
        routes_of_administration: crate::lib::substance::RoutesOfAdministration::new(),
    };

    let db_connection = db.clone();
    let route_futures = routes_of_administration.into_iter().map(|route| {
        let db = db_connection.clone();
        async move {
            let classification = RouteOfAdministrationClassification::from_str(&route.name)
                .map_err(|e| miette!(format!("{:?}", e)))?;
            let mut roa = crate::lib::substance::RouteOfAdministration {
                classification,
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
                let dosage_classification = DosageClassification::from_str(&dosage.intensity)
                    .map_err(|_| miette!("Failed to parse dosage classification"))?;

                let lower_bound = dosage
                    .lower_bound_amount
                    .map(|amount| Dosage::from_str(&format!("{} {}", amount, dosage.unit)))
                    .transpose()
                    .map_err(|e| {
                        miette!("Failed to parse lower_bound_amount into Dosage: {}", e)
                    })?;

                let upper_bound = dosage
                    .upper_bound_amount
                    .map(|amount| Dosage::from_str(&format!("{} {}", amount, dosage.unit)))
                    .transpose()
                    .map_err(|e| {
                        miette!("Failed to parse upper_bound_amount into Dosage: {}", e)
                    })?;

                roa.dosages.insert(
                    dosage_classification,
                    DosageRange::from_bounds(lower_bound, upper_bound),
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

                let lower_duration = Duration::from_str(&phase.lower_duration.unwrap_or_default())
                    .map_err(|_| miette!("Failed to parse duration"))?;
                let upper_duration = Duration::from_str(&phase.upper_duration.unwrap_or_default())
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

    Ok(substance)
}
