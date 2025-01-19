#[async_trait::async_trait]
pub trait QueryHandler<U>
{
    async fn query(&self) -> miette::Result<U>;
}
