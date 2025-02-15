use crate::core::CommandHandler;
use crate::core::foundation::QueryHandler;
use crate::database::entities::ingestion;
use crate::database::entities::ingestion_phase;
use crate::ingestion::model::Ingestion;
use crate::ingestion::query::AnalyzeIngestion;
use crate::substance::route_of_administration::phase::PhaseClassification;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::utils::AppContext;
use chrono::{DateTime, Duration, Local, TimeZone};
use clap::Parser;
use miette::IntoDiagnostic;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter, QueryOrder};
use std::collections::HashMap;
use termimad::{rgb, MadSkin};


#[derive(Parser, Debug)]
#[command(about = "Show currently active substances and their phases")]
pub struct MomentCommand {}

fn get_phase_indicator(phase: &PhaseClassification) -> &'static str {
	match phase {
		PhaseClassification::Onset => "⟳",    // circling arrow for onset
		PhaseClassification::Comeup => "↑",    // up arrow for comeup
		PhaseClassification::Peak => "→",      // right arrow for peak
		PhaseClassification::Comedown => "↓",  // down arrow for comedown
		PhaseClassification::Afterglow => "∿", // wave for afterglow
		PhaseClassification::Unknown => "?",   // question mark for unknown
	}
}

fn calculate_subjective_dosage(dosage: &Dosage, phase: &PhaseClassification) -> Dosage {
	let factor = match phase {
		PhaseClassification::Onset => 0.2,
		PhaseClassification::Comeup => 0.6,
		PhaseClassification::Peak => 1.0,
		PhaseClassification::Comedown => 0.4,
		PhaseClassification::Afterglow => 0.1,
		PhaseClassification::Unknown => 0.0,
	};
	
	Dosage::from_base_units(dosage.as_base_units() * factor)
}

fn format_duration(duration: Duration) -> String {
	if duration.num_hours() > 0 {
		format!("{}h {}m", duration.num_hours(), duration.num_minutes() % 60)
	} else {
		format!("{}m", duration.num_minutes())
	}
}

#[async_trait::async_trait]
impl CommandHandler for MomentCommand {
	async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()> {
		let now = Local::now();
		// Get all ingestions that might still be active (within last 24 hours for now)
		let active_ingestions = ingestion::Entity::find()
			.filter(ingestion::Column::IngestedAt.gt(now.naive_utc() - chrono::Duration::hours(24)))
			.order_by_desc(ingestion::Column::IngestedAt)
			.all(ctx.database_connection)
			.await
			.into_diagnostic()?;

		println!("Found {} active ingestions", active_ingestions.len());

		// Group by substance
		let mut substance_groups: HashMap<String, Vec<Ingestion>> = HashMap::new();
		
		for ing in active_ingestions {
println!("Processing ingestion: {} {} at {}", 
	ing.substance_name, 
	Dosage::from_base_units(ing.dosage as f64),
	ing.ingested_at
);

let analysis_query = AnalyzeIngestion::builder()
	.substance(ing.substance_name.clone())
	.date(Local.from_utc_datetime(&ing.ingested_at))
	.dosage(Dosage::from_base_units(ing.dosage as f64))
                .roa(ing.route_of_administration.parse().unwrap_or_default())
                .ingestion_id(Some(ing.id))
                .build();

            match analysis_query.query().await {
                Ok(analyzed_ingestion) => {
println!("Analysis successful: {} phases, dosage: {}", 
	analyzed_ingestion.phases.len(),
	analyzed_ingestion.dosage
                    );
                    substance_groups
                        .entry(analyzed_ingestion.substance_name.clone())
                        .or_default()
                        .push(analyzed_ingestion);
                }
                Err(e) => {
                    println!("Analysis failed: {}", e);
                }
            }
        }

		// Format output based on the OutputFormat
		match ctx.stdout_format {
			crate::cli::OutputFormat::Pretty => {
				let mut skin = MadSkin::default();
				skin.set_fg(rgb(205, 214, 244));
				skin.bold.set_fg(rgb(166, 227, 161));
				skin.italic.set_fg(rgb(250, 179, 135));
				skin.headers[0].set_fg(rgb(198, 160, 246));
				skin.headers[1].set_fg(rgb(245, 224, 220));
				skin.paragraph.set_fg(rgb(198, 208, 245));

				let mut md = String::new();
				md.push_str("# Current Active Substances\n\n");
				
				for (substance, ingestions) in substance_groups {
					let mut total_subjective = Dosage::from_base_units(0.0);
					let total_actual = ingestions.iter()
						.fold(Dosage::from_base_units(0.0), |acc, i| {
							Dosage::from_base_units(acc.as_base_units() + i.dosage.as_base_units())
						});
					
					md.push_str(&format!("## {}\n\n", substance));
					
					for ingestion in &ingestions {
						if let Some(current_phase) = ingestion.phases.iter()
							.find(|p| p.start_time.start <= now && p.end_time.end >= now) {
							
							let time_remaining = current_phase.end_time.end - now;
							let subjective_dosage = calculate_subjective_dosage(
								&ingestion.dosage,
								&current_phase.class
							);
							total_subjective = Dosage::from_base_units(
								total_subjective.as_base_units() + subjective_dosage.as_base_units()
							);
							
							md.push_str(&format!("- {} {} _{} ({} remaining)_\n", 
								get_phase_indicator(&current_phase.class),
								ingestion.dosage,
								current_phase.class,
								format_duration(time_remaining)));
						}
					}
					
					if total_actual.as_base_units() > 0.0 {
						md.push_str(&format!("\n**Total**: {} _(Subjective: {})_\n\n", 
							total_actual, total_subjective));
					}
				}

				println!("{}", skin.text(&md, None));
			}
			crate::cli::OutputFormat::Json => {
				println!("{}", serde_json::to_string_pretty(&substance_groups).into_diagnostic()?);
			}
		}

		Ok(())
	}
}