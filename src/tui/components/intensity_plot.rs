use crate::database::Ingestion;
use ratatui::style::Color;
use ratatui::style::Style;
use ratatui::widgets::Axis;
use ratatui::widgets::Block;
use ratatui::widgets::Borders;
use ratatui::widgets::Chart;

/// A component that renders intensity plots for multiple substance ingestions
pub struct IntensityPlot<'a>
{
    ingestions: &'a [Ingestion],
    phase_data: Vec<Vec<(f64, f64)>>,
    max_duration: f64,
}

impl<'a> IntensityPlot<'a>
{
    /// Creates a new intensity plot for multiple ingestions
    pub fn new(ingestions: &'a [Ingestion]) -> Self
    {
        Self {
            ingestions,
            phase_data: vec![],
            max_duration: 0.0,
        }
    }

    /// Renders the intensity plot as a Chart widget
    pub fn render(&'a self) -> Chart<'a>
    {
        let datasets = Vec::new();
        let _colors = [
            Color::Red,
            Color::Green,
            Color::Yellow,
            Color::Blue,
            Color::Magenta,
            Color::Cyan,
        ];

        Chart::new(datasets)
            .block(
                Block::default()
                    .title("Active Ingestions Intensity")
                    .borders(Borders::ALL),
            )
            .x_axis(
                Axis::default()
                    .title("Time (minutes)")
                    .style(Style::default().fg(Color::Gray))
                    .bounds([0.0, self.max_duration.max(60.0)]),
            )
            .y_axis(
                Axis::default()
                    .title("Intensity (%)")
                    .style(Style::default().fg(Color::Gray))
                    .bounds([0.0, 100.0]),
            )
    }
}
