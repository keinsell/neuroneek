use crate::analyzer::model::IngestionAnalysis;
use crate::substance::Substance;
use crate::substance::route_of_administration::phase::PhaseClassification;
use ratatui::{
    style::{Color, Style},
    text::Line,
    widgets::{Axis, Block, Borders, Chart, Dataset},
    symbols,
};

/// A component that renders intensity plots for multiple substance ingestions
pub struct IntensityPlot<'a> {
    ingestions: &'a [IngestionAnalysis],
    phase_data: Vec<Vec<(f64, f64)>>,
    max_duration: f64,
}

impl<'a> IntensityPlot<'a> {
    /// Creates a new intensity plot for multiple ingestions
    pub fn new(ingestions: &'a [IngestionAnalysis]) -> Self {
        let mut phase_data = Vec::new();
        let colors = [
            Color::Red,
            Color::Green,
            Color::Yellow,
            Color::Blue,
            Color::Magenta,
            Color::Cyan,
        ];

        for analysis in ingestions.iter() {
            if analysis.substance.is_some() {
                phase_data.push(Self::collect_phase_data(analysis));
            }
        }

        let max_duration = Self::calculate_max_duration(ingestions);

        Self { 
            ingestions,
            phase_data,
            max_duration,
        }
    }

    /// Renders the intensity plot as a Chart widget
    pub fn render(&'a self) -> Chart<'a> {
        let mut datasets = Vec::new();
        let colors = [
            Color::Red,
            Color::Green,
            Color::Yellow,
            Color::Blue,
            Color::Magenta,
            Color::Cyan,
        ];

        for (idx, (analysis, data)) in self.ingestions.iter()
            .filter(|a| a.substance.is_some())
            .zip(self.phase_data.iter())
            .enumerate() 
        {
            if let Some(substance) = &analysis.substance {
                let color = colors[idx % colors.len()];
                let dataset = Dataset::default()
                    .name(Line::from(substance.name.as_str()))
                    .marker(symbols::Marker::Braille)
                    .style(Style::default().fg(color))
                    .graph_type(ratatui::widgets::GraphType::Line)
                    .data(data);
                datasets.push(dataset);
            }
        }

        Chart::new(datasets)
            .block(Block::default()
                .title("Active Ingestions Intensity")
                .borders(Borders::ALL))
            .x_axis(Axis::default()
                .title("Time (minutes)")
                .style(Style::default().fg(Color::Gray))
                .bounds([0.0, self.max_duration.max(60.0)]))
            .y_axis(Axis::default()
                .title("Intensity (%)")
                .style(Style::default().fg(Color::Gray))
                .bounds([0.0, 100.0]))
    }

    /// Collects and interpolates phase data points for plotting
    fn collect_phase_data(analysis: &IngestionAnalysis) -> Vec<(f64, f64)> {
        let mut phase_data = Vec::new();
        let mut last_duration = 0.0;

        for phase in &analysis.phases {
            let duration = phase.duration_range.end
                .signed_duration_since(phase.duration_range.start)
                .num_minutes() as f64;
            
            let intensity = match phase.class {
                PhaseClassification::Peak => 100.0,
                PhaseClassification::Comeup => {
                    // Interpolate from previous intensity to peak
                    let prev_intensity = phase_data.last().map(|&(_, i)| i).unwrap_or(0.0);
                    phase_data.push((last_duration, prev_intensity));
                    75.0
                }
                PhaseClassification::Comedown => {
                    // Interpolate from peak to comedown
                    let prev_intensity = phase_data.last().map(|&(_, i)| i).unwrap_or(75.0);
                    phase_data.push((last_duration, prev_intensity));
                    50.0
                }
                PhaseClassification::Onset => {
                    // Start from 0 and gradually increase
                    phase_data.push((last_duration, 0.0));
                    25.0
                }
                PhaseClassification::Afterglow => {
                    // Gradually decrease to baseline
                    let prev_intensity = phase_data.last().map(|&(_, i)| i).unwrap_or(25.0);
                    phase_data.push((last_duration, prev_intensity));
                    10.0
                }
                PhaseClassification::Unknown => 0.0,
            };

            // Add the main point for this phase
            phase_data.push((last_duration + duration / 2.0, intensity));
            
            // Add end point with interpolation to next phase
            if let Some(next_phase) = analysis.phases.iter()
                .skip_while(|p| p.class != phase.class)
                .nth(1) 
            {
                let next_intensity = match next_phase.class {
                    PhaseClassification::Peak => 100.0,
                    PhaseClassification::Comeup | PhaseClassification::Comedown => 75.0,
                    PhaseClassification::Onset => 25.0,
                    PhaseClassification::Afterglow => 10.0,
                    PhaseClassification::Unknown => 0.0,
                };
                phase_data.push((last_duration + duration, (intensity + next_intensity) / 2.0));
            } else {
                // Last phase, return to baseline
                phase_data.push((last_duration + duration, 0.0));
            }

            last_duration += duration;
        }

        phase_data
    }

    /// Gets the maximum duration across all ingestions in minutes
    fn calculate_max_duration(ingestions: &[IngestionAnalysis]) -> f64 {
        ingestions.iter()
            .filter_map(|analysis| {
                Some(analysis.phases.iter()
                    .map(|phase| phase.duration_range.end
                        .signed_duration_since(phase.duration_range.start)
                        .num_minutes() as f64)
                    .sum::<f64>())
            })
            .max_by(|a: &f64, b: &f64| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal))
            .unwrap_or(60.0)
    }
} 