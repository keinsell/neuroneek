pub use miette::Result;
use ratatui::backend::CrosstermBackend;
pub use ratatui::prelude::*;
use ratatui::Terminal;
/**
 * This file contains core abstraction layer for the terminal user
 * interface. Think about it as micro-framework on top of framework like
 * ratatui.
 */
use std::io::Stdout;

pub type DefaultTerminal = Terminal<CrosstermBackend<Stdout>>;

pub trait Renderable
{
    /// Renders a UI component within a specified area of the terminal.
    ///
    /// This trait provides a standardized interface for rendering components in
    /// a Ratatui-based TUI. It follows Ratatui's rendering model where
    /// components are drawn within constrained areas.
    ///
    /// # Arguments
    ///
    /// * `area` - A [`Rect`] defining the drawing area (width, height, and
    ///   position).
    ///   - The coordinate system is top-left based (0,0) is the top-left corner
    ///   - The area is automatically constrained by parent components
    ///   - See: [`Rect`](https://docs.rs/ratatui/latest/ratatui/layout/struct.Rect.html)
    ///
    /// * `frame` - A mutable reference to the [`Frame`] used for rendering.
    ///   - The frame provides access to the terminal buffer
    ///   - All drawing operations must go through the frame
    ///   - See: [`Frame`](https://docs.rs/ratatui/latest/ratatui/terminal/struct.Frame.html)
    ///
    /// # Returns
    ///
    /// * `Result<()>` - Returns `Ok(())` on success or an error if rendering
    ///   fails.
    ///   - Uses [`miette::Result`] for rich error reporting
    ///
    /// # Implementation Guidelines
    ///
    /// 1. Components should respect the provided `area` boundaries
    /// 2. Use Ratatui's layout system for complex component structures
    /// 3. Consider using [`Buffer`] directly for performance-critical rendering
    /// 4. Handle terminal resizing gracefully
    ///
    /// # Example
    ///
    /// ```rust
    /// impl Renderable for MyComponent
    /// {
    ///     fn render(&self, area: Rect, frame: &mut Frame) -> Result<()>
    ///     {
    ///         let text = Text::from("Hello Ratatui");
    ///         frame.render_widget(text, area);
    ///         Ok(())
    ///     }
    /// }
    /// ```
    ///
    /// See also:
    /// - [Ratatui Rendering Model](https://ratatui.rs/concepts/rendering/)
    /// - [Widget Implementation Guide](https://ratatui.rs/how-to-guide/implement-a-widget/)
    fn render(&self, area: Rect, frame: &mut Frame) -> Result<()>;
}

pub trait Component: Renderable {}
