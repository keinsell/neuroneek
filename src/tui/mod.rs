pub mod app;
pub mod core;
pub mod events;
pub mod layout;
pub mod theme;
pub mod views;
pub mod widgets;

// Re-export commonly used types
pub use app::Application;
pub use core::Component;
pub use core::Renderable;
pub use theme::Theme;

pub mod prelude
{
    pub use super::core::Component;
    pub use super::core::Renderable;
}

use miette::Result;

pub(super) async fn run() -> Result<()>
{
    let mut app = Application::new().await?;
    app.run().await?;
    Ok(())
}
