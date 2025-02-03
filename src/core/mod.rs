use crate::utils::AppContext;

pub mod config;
pub(crate) mod error_handling;
pub mod foundation;
pub(crate) mod logging;

pub use foundation::QueryHandler;

#[async_trait::async_trait]
pub trait CommandHandler<O = ()>
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<O>;
}
