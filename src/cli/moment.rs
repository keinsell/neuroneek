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

fn calculate_phase_coefficient(phase: &PhaseClassification, progress_percent: f64) -> f64 {
	match phase {
		PhaseClassification::Onset => progress_percent * 0.2,
		PhaseClassification::Comeup => 0.2 + (progress_percent * 0.8),
		PhaseClassification::Peak => 1.0 - (progress_percent * 0.1),
		PhaseClassification::Comedown => 0.4 * (1.0 - progress_percent),
		PhaseClassification::Afterglow => 0.1 * (1.0 - progress_percent),
		PhaseClassification::Unknown => 0.0,
	}
}

fn calculate_phase_progress(current_time: DateTime<Local>, phase_start: DateTime<Local>, phase_end: DateTime<Local>) -> f64 {
	let total_duration = phase_end.signed_duration_since(phase_start);
	let elapsed = current_time.signed_duration_since(phase_start);
	
	if total_duration.num_seconds() <= 0 {
		return 0.0;
	}
	
	(elapsed.num_seconds() as f64 / total_duration.num_seconds() as f64).clamp(0.0, 1.0)
}

fn calculate_subjective_dosage(dosage: &Dosage, phase: &PhaseClassification, progress: f64) -> Dosage {
	let factor = calculate_phase_coefficient(phase, progress);
	Dosage::from_base_units(dosage.as_base_units() * factor)
}

fn format_duration(duration: Duration) -> String {
	if duration.num_hours() > 0 {
		format!("{}h {}m", duration.num_hours(), duration.num_minutes() % 60)
	} else {
		format!("{}m", duration.num_minutes())
	}
}

fn get_phase_indicator(phase: &PhaseClassification, progress: f64) -> String {
	let base_indicator = match phase {
		PhaseClassification::Onset => "⟳",
		PhaseClassification::Comeup => "↑",
		PhaseClassification::Peak => "→",
		PhaseClassification::Comedown => "↓",
		PhaseClassification::Afterglow => "∿",
		PhaseClassification::Unknown => "?",
	};
	
	let progress_length = 10;
	let filled = (progress * progress_length as f64).round() as usize;
	let progress_bar = format!(
		"[{}{}]",
		"=".repeat(filled),
		"-".repeat(progress_length - filled)
	);
	
	format!("{} {}", base_indicator, progress_bar)
}

#[async_trait::async_trait]
impl CommandHandler for MomentCommand {
	async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()> {
		let now = Local::now();
		let active_ingestions = ingestion::Entity::find()
			.filter(ingestion::Column::IngestedAt.gt(now.naive_utc() - chrono::Duration::hours(24)))
			.order_by_desc(ingestion::Column::IngestedAt)
			.all(ctx.database_connection)
			.await
			.into_diagnostic()?;

		let mut substance_groups: HashMap<String, Vec<Ingestion>> = HashMap::new();
		
		for ing in active_ingestions {
			let analysis_query = AnalyzeIngestion::builder()
				.substance(ing.substance_name.clone())
				.date(Local.from_utc_datetime(&ing.ingested_at))
				.dosage(Dosage::from_base_units(ing.dosage as f64))
				.roa(ing.route_of_administration.parse().unwrap_or_default())
				.ingestion_id(Some(ing.id))
				.build();

			if let Ok(analyzed_ingestion) = analysis_query.query().await {
				substance_groups
					.entry(analyzed_ingestion.substance_name.clone())
					.or_default()
					.push(analyzed_ingestion);
			}
		}

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
				md.push_str("# Active Substances\n\n");
				
				for (substance, ingestions) in substance_groups {
					let mut total_subjective = Dosage::from_base_units(0.0);
					let total_actual = ingestions.iter()
						.fold(Dosage::from_base_units(0.0), |acc, i| {
							Dosage::from_base_units(acc.as_base_units() + i.dosage.as_base_units())
						});
					
					md.push_str(&format!("## {}\n\n", substance));
					
					// Track active phases and their effects
					let mut active_phases = Vec::new();
					let mut max_remaining = Duration::zero();
					
					for ingestion in &ingestions {
						if let Some(current_phase) = ingestion.phases.iter()
							.find(|p| p.start_time.start <= now && p.end_time.end >= now) {
							
							let progress = calculate_phase_progress(
								now,
								current_phase.start_time.start,
								current_phase.end_time.end
							);
							
							let subjective_dosage = calculate_subjective_dosage(
								&ingestion.dosage,
								&current_phase.class,
								progress
							);
							
							total_subjective = Dosage::from_base_units(
								total_subjective.as_base_units() + subjective_dosage.as_base_units()
							);
							
							let time_remaining = current_phase.end_time.end - now;
							if time_remaining > max_remaining {
								max_remaining = time_remaining;
							}
							
							active_phases.push((current_phase.class.clone(), progress, ingestion.dosage));
						}
					}
					
					// Show combined phase information
					if !active_phases.is_empty() {
						// Sort phases by their effect strength
						active_phases.sort_by(|a, b| {
							let effect_a = calculate_phase_coefficient(&a.0, a.1);
							let effect_b = calculate_phase_coefficient(&b.0, b.1);
							effect_b.partial_cmp(&effect_a).unwrap()
						});
						
						// Show the dominant phase
						let (phase, progress, _) = &active_phases[0];
						md.push_str(&format!("{} {} _{} ({} remaining)_\n",
							get_phase_indicator(phase, *progress),
							total_actual,
							phase,
							format_duration(max_remaining)));
					}
					
					if total_actual.as_base_units() > 0.0 {
						let effect_percentage = (total_subjective.as_base_units() / total_actual.as_base_units() * 100.0).round();
						md.push_str(&format!("**Current Effect**: {} ({:.0}%)\n\n",
							total_subjective, effect_percentage));
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