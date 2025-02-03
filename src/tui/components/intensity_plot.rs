use crate::analyzer::model::IngestionAnalysis;
use crate::substance::Substance;
use crate::substance::route_of_administration::phase::PhaseClassification;
use ratatui::{
    style::{Color, Style},
    text::{Line, Span},
    widgets::{Axis, Block, Borders, Chart, Dataset, canvas::{Canvas, Line as CanvasLine, Points}},
    symbols,
};
use chrono::{Local, Duration};

/// A component that renders intensity plots for multiple substance ingestions
pub struct IntensityPlot<'a> {
    ingestions: &'a [IngestionAnalysis],
    phase_data: Vec<Vec<(f64, f64)>>,
    time_marker_data: Vec<(f64, f64)>,
    time_labels: Vec<String>,
    max_duration: f64,
}

impl<'a> IntensityPlot<'a> {
    fn generate_time_labels(&self) -> Vec<String> {
        let now = Local::now();
        let mut labels = Vec::new();
        
        // Find the current time point
        if let Some(current_point) = self.ingestions.iter()
            .filter(|a| a.substance.is_some())
            .filter_map(|analysis| {
                let start_time = analysis.ingestion_start;
                let minutes_elapsed = now.signed_duration_since(start_time)
                    .num_minutes() as f64;
                if minutes_elapsed >= 0.0 && minutes_elapsed <= self.max_duration {
                    Some(minutes_elapsed)
                } else {
                    None
                }
            })
            .next()
        {
            // Generate 5 labels including "now"
            let step = self.max_duration / 4.0;
            
            // Add labels before "now"
            if current_point > step {
                labels.push(format!("-{}m", current_point.round() as i64));
            }
            if current_point > 0.0 {
                labels.push("now".to_string());
            }
            
            // Add future time points
            let remaining = self.max_duration - current_point;
            if remaining > 0.0 {
                let future_steps = (remaining / step).min(3.0) as i32;
                for i in 1..=future_steps {
                    let mins = (step * i as f64).round() as i64;
                    labels.push(format!("+{}m", mins));
                }
            }
        } else {
            // If no current point, just show regular intervals
            let step = self.max_duration / 4.0;
            for i in 0..=4 {
                let mins = (step * i as f64).round() as i64;
                labels.push(format!("{}m", mins));
            }
        }
        
        labels
    }

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

        let time_marker_data = Vec::new();
        let time_labels = Vec::new();

        Self { 
            ingestions,
            phase_data,
            time_marker_data,
            time_labels,
            max_duration,
        }
    }

    /// Renders the intensity plot as a Chart widget
    pub fn render(&'a mut self) -> Chart<'a> {
        let mut datasets = Vec::new();
        
        // Add intensity curves
        for (idx, (analysis, data)) in self.ingestions.iter()
            .filter(|a| a.substance.is_some())
            .zip(self.phase_data.iter())
            .enumerate() 
        {
            if let Some(substance) = &analysis.substance {
                let color = match idx % 6 {
                    0 => Color::Red,
                    1 => Color::Green,
                    2 => Color::Yellow,
                    3 => Color::Blue,
                    4 => Color::Magenta,
                    _ => Color::Cyan,
                };
                datasets.push(Dataset::default()
                    .name(Line::from(substance.name.as_str()))
                    .marker(symbols::Marker::Braille)
                    .style(Style::default().fg(color))
                    .graph_type(ratatui::widgets::GraphType::Line)
                    .data(&data));
            }
        }

        // Calculate and add current time marker if there are active ingestions
        let now = Local::now();
        if let Some(time_point) = self.ingestions.iter()
            .filter(|a| a.substance.is_some())
            .filter_map(|analysis| {
                let start_time = analysis.ingestion_start;
                let minutes_elapsed = now.signed_duration_since(start_time)
                    .num_minutes() as f64;
                if minutes_elapsed >= 0.0 && minutes_elapsed <= self.max_duration {
                    Some(minutes_elapsed)
                } else {
                    None
                }
            })
            .next() 
        {
            self.time_marker_data = vec![(time_point, 0.0), (time_point, 100.0)];
            datasets.push(Dataset::default()
                .marker(symbols::Marker::Braille)
                .style(Style::default().fg(Color::White))
                .graph_type(ratatui::widgets::GraphType::Line)
                .data(&self.time_marker_data));
        }            // Update time labels
            self.time_labels = self.generate_time_labels();

            Chart::new(datasets)
                .block(Block::default()
                    .title("Active Ingestions Intensity")
                    .borders(Borders::ALL))
                .x_axis(Axis::default()
                    .title("Time")
                    .style(Style::default().fg(Color::Gray))
                    .bounds([0.0, self.max_duration.max(60.0)])
                    .labels(self.time_labels.iter().map(|s| Span::raw(s)).collect()))
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
