use crate::cli::formatter::Formatter;
use crate::cli::OutputFormat;
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
use serde::Serialize;
use std::collections::HashMap;
use std::borrow::Cow;
use tabled::Tabled;
use termimad::{rgb, MadSkin};
use typed_builder::TypedBuilder;

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

#[derive(Debug, Serialize, TypedBuilder)]
pub struct MomentViewModel {
	pub substances: Vec<ActiveSubstanceViewModel>,
	pub timestamp: DateTime<Local>,
}

#[derive(Debug, Serialize, TypedBuilder)]
pub struct ActiveSubstanceViewModel {
	pub name: String,
	pub total_actual: Dosage,
	pub total_subjective: Dosage,
	pub effect_percentage: f64,
	pub trend_indicator: String,
	pub dominant_phase: Option<ActivePhaseViewModel>,
}

#[derive(Debug, Serialize, TypedBuilder)]

pub struct ActivePhaseViewModel {
	pub classification: PhaseClassification,
	pub progress: f64,
	pub time_remaining: Duration,
}

impl Formatter for MomentViewModel {
	fn pretty(&self) -> String {
		let mut skin = MadSkin::default();
		skin.set_fg(rgb(205, 214, 244));
		skin.bold.set_fg(rgb(166, 227, 161));
		skin.italic.set_fg(rgb(250, 179, 135));
		skin.headers[0].set_fg(rgb(198, 160, 246));
		skin.headers[1].set_fg(rgb(245, 224, 220));
		skin.paragraph.set_fg(rgb(198, 208, 245));

		let mut md = String::new();
		md.push_str("# Active Substances\n\n");

		for substance in &self.substances {
			md.push_str(&format!("## {}\n", substance.name));

			if let Some(phase) = &substance.dominant_phase {
				let indicator = match phase.classification {
					PhaseClassification::Onset => "⟳",
					PhaseClassification::Comeup => "↑",
					PhaseClassification::Peak => "→",
					PhaseClassification::Comedown => "↓",
					PhaseClassification::Afterglow => "∿",
					PhaseClassification::Unknown => "?",
				};

				let bar_length = 10;
				let filled = (phase.progress * bar_length as f64).round() as usize;
				let progress_bar = format!(
					"[{}{}]",
					"=".repeat(filled),
					"-".repeat(bar_length - filled)
				);

				md.push_str(&format!("{} {} _{} ({} remaining)_\n",
					indicator,
					progress_bar,
					phase.classification,
					format_duration(phase.time_remaining)));
			}

			md.push_str(&format!("**Ingested**: {}\n", substance.total_actual));
			md.push_str(&format!("**Feeling**: {} {} ({:.0}%)\n\n",
				substance.trend_indicator,
				substance.total_subjective,
				substance.effect_percentage));
		}

		skin.text(&md, None).to_string()
	}
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

		let mut active_substances = Vec::new();
		
		for (substance_name, ingestions) in substance_groups {
			let mut total_subjective = Dosage::from_base_units(0.0);
			let total_actual = ingestions.iter()
				.fold(Dosage::from_base_units(0.0), |acc, i| {
					Dosage::from_base_units(acc.as_base_units() + i.dosage.as_base_units())
				});
			
			let mut trend = 0.0;
			let mut active_count = 0;
			let mut dominant_phase = None;
			let mut max_effect = 0.0;
			
			for ingestion in &ingestions {
				if let Some(current_phase) = ingestion.phases.iter()
					.find(|p| p.start_time.start <= now && p.end_time.end >= now) {
					
					let progress = calculate_phase_progress(
						now,
						current_phase.start_time.start,
						current_phase.end_time.end
					);
					
					let effect = calculate_phase_coefficient(&current_phase.class, progress);
					let subjective_dosage = calculate_subjective_dosage(
						&ingestion.dosage,
						&current_phase.class,
						progress
					);
					
					total_subjective = Dosage::from_base_units(
						total_subjective.as_base_units() + subjective_dosage.as_base_units()
					);
					
					if effect > max_effect {
						max_effect = effect;
						dominant_phase = Some((current_phase, progress));
					}
					
					trend += match current_phase.class {
						PhaseClassification::Onset | PhaseClassification::Comeup => 1.0,
						PhaseClassification::Peak => 0.0,
						PhaseClassification::Comedown | PhaseClassification::Afterglow => -1.0,
						PhaseClassification::Unknown => 0.0,
					};
					active_count += 1;
				}
			}
			
			if total_actual.as_base_units() > 0.0 {
				let trend_indicator = if active_count > 0 {
					let avg_trend = trend / active_count as f64;
					if avg_trend > 0.3 {
						"↑"
					} else if avg_trend < -0.3 {
						"↓"
					} else {
						"→"
					}
				} else {
					"·"
				}.to_string();

				let effect_percentage = if total_actual.as_base_units() > 0.0 {
					(total_subjective.as_base_units() / total_actual.as_base_units() * 100.0).round()
				} else {
					0.0
				};

				let active_substance = ActiveSubstanceViewModel::builder()
					.name(substance_name)
					.total_actual(total_actual)
					.total_subjective(total_subjective)
					.effect_percentage(effect_percentage)
					.trend_indicator(trend_indicator)
					.dominant_phase(dominant_phase.map(|(phase, progress)| {
						ActivePhaseViewModel::builder()
							.classification(phase.class.clone())
							.progress(progress)
							.time_remaining(phase.end_time.end - now)
							.build()
					}))
					.build();

				active_substances.push(active_substance);
			}
		}

		let view_model = MomentViewModel::builder()
			.substances(active_substances)
			.timestamp(now)
			.build();

		println!("{}", view_model.format(ctx.stdout_format));
		Ok(())
	}
}
