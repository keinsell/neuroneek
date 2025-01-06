use crate::lib;
use crate::lib::CommandHandler;
use crate::lib::dosage::Dosage;
use chrono::Local;
use chrono::TimeZone;
use chrono_humanize::HumanTime;
use clap::Parser;
use miette::IntoDiagnostic;
use owo_colors::OwoColorize;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;
use sea_orm::QuerySelect;
use sea_orm::prelude::async_trait::async_trait;

/// Represents a line in the graph output with prefix (graph symbols) and
/// content
struct GraphLine
{
    level: usize,
    prefix: String,
    content: String,
}

impl GraphLine
{
    fn new(level: usize, prefix: &str, content: &str) -> Self
    {
        Self {
            level,
            prefix: prefix.to_string(),
            content: content.to_string(),
        }
    }

    fn to_string(&self) -> String
    {
        let indent = "  ".repeat(self.level);
        format!("{}{}{}", indent, self.prefix, self.content)
    }
}

/// Journal is a one-stop command to inform user about active ingestions and
/// their stages in a form similar to calendar or git-log. It relies on analyze
/// ingestion and journal features.
#[derive(Parser, Debug)]
#[command(
    version,
    about = "View journal of your ingestions",
    long_about = "View journal, a place where all of your ingestions are nicely ordered and \
                  displayed in a git-log style graph."
)]
pub struct Journal
{
    /// Number of ingestions to display
    #[arg(short = 'l', long, default_value_t = 10)]
    pub limit: u64,

    /// Collapse past ingestions for a cleaner view
    #[arg(short = 'c', long, default_value_t = true)]
    pub collapse_past: bool,
}

#[async_trait]
impl CommandHandler for Journal
{
    async fn handle<'a>(&self, context: lib::Context<'a>) -> miette::Result<()>
    {
        let ingestion_models = crate::orm::ingestion::Entity::find()
            .order_by_desc(crate::orm::ingestion::Column::IngestedAt)
            .limit(self.limit)
            .all(context.database_connection)
            .await
            .into_diagnostic()?;

        let mut output_lines = Vec::new();
        let mut collapsed_count = 0;
        let mut last_active_idx = None;

        for (idx, ingestion_model) in ingestion_models.iter().enumerate()
        {
            let ingestion = crate::lib::ingestion::Ingestion::from(ingestion_model.clone());
            let substance = match crate::lib::substance::repository::get_substance_by_name(
                &ingestion.substance,
                context.database_connection,
            )
            .await
            {
                | Ok(substance) => substance,
                | Err(_) =>
                {
                    eprintln!("Warning: Substance '{}' not found", &ingestion.substance);
                    continue;
                }
            };

            let analysis = match crate::lib::analyzer::IngestionAnalysis::analyze(
                ingestion.clone(),
                substance,
            )
            .await
            {
                | Ok(analysis) => analysis,
                | Err(e) =>
                {
                    eprintln!(
                        "Warning: Failed to analyze ingestion {}: {}",
                        ingestion_model.id, e
                    );
                    continue;
                }
            };

            if analysis.progress < 1.0
            {
                last_active_idx = Some(idx);
            }
        }

        println!("{}", "│ ".dimmed().to_string());

        // Second pass to display ingestions
        for (idx, ingestion_model) in ingestion_models.iter().enumerate()
        {
            let ingestion = crate::lib::ingestion::Ingestion::from(ingestion_model.clone());
            let substance = match crate::lib::substance::repository::get_substance_by_name(
                &ingestion.substance,
                context.database_connection,
            )
            .await
            {
                | Ok(substance) => substance,
                | Err(_) => continue,
            };

            let analysis = match crate::lib::analyzer::IngestionAnalysis::analyze(
                ingestion.clone(),
                substance,
            )
            .await
            {
                | Ok(analysis) => analysis,
                | Err(_) => continue,
            };

            let is_past = analysis.progress >= 1.0;
            let should_collapse = self.collapse_past && is_past && Some(idx) != last_active_idx;

            if should_collapse
            {
                collapsed_count += 1;
                continue;
            }

            if collapsed_count > 0
            {
                let collapse_prefix = "│ ".dimmed().to_string();
                let collapse_msg = format!("{} past ingestions collapsed", collapsed_count)
                    .dimmed()
                    .to_string();
                output_lines.push(GraphLine::new(0, &collapse_prefix, &collapse_msg));
                output_lines.push(GraphLine::new(0, "│", ""));
                collapsed_count = 0;
            }

            let local_ingestion_date = Local.from_utc_datetime(&ingestion_model.ingested_at);
            let commit_prefix = if is_past
            {
                "○ ".dimmed().to_string()
            }
            else
            {
                "● ".bright_yellow().to_string()
            };

            let humanized_date = HumanTime::from(local_ingestion_date);

            let ingestion_line = if is_past
            {
                format!(
                    "{} {} {} ({} {} via {}) {}",
                    humanized_date.to_string().dimmed(),
                    "ingestion".dimmed(),
                    ingestion_model.id.to_string().dimmed(),
                    Dosage::from_base_units(ingestion_model.dosage as f64)
                        .to_string()
                        .dimmed(),
                    ingestion_model.substance_name.dimmed(),
                    ingestion_model.route_of_administration.dimmed(),
                    format!(
                        "[{}%]",
                        (analysis.progress * 100.0).round().to_string().green()
                    )
                )
            }
            else
            {
                format!(
                    "{} {} {} ({} {} via {}) {}",
                    humanized_date.to_string().yellow(),
                    "ingestion".bold(),
                    ingestion_model.id.to_string().yellow(),
                    Dosage::from_base_units(ingestion_model.dosage as f64)
                        .to_string()
                        .yellow(),
                    ingestion_model.substance_name.bold(),
                    ingestion_model.route_of_administration.yellow(),
                    format!(
                        "[{}%]",
                        (analysis.progress * 100.0).round().to_string().yellow()
                    )
                )
            };
            output_lines.push(GraphLine::new(0, &commit_prefix, &ingestion_line));

            if idx < ingestion_models.len() - 1
            {
                output_lines.push(GraphLine::new(0, "│", ""));
            }
        }

        // Show remaining collapsed count if any
        if collapsed_count > 0
        {
            let collapse_prefix = "│ ".dimmed().to_string();
            let collapse_msg = format!("{} past ingestions collapsed", collapsed_count)
                .dimmed()
                .to_string();
            output_lines.push(GraphLine::new(0, &collapse_prefix, &collapse_msg));
        }

        for line in output_lines
        {
            println!("{}", line.to_string());
        }

        println!();

        Ok(())
    }
}
