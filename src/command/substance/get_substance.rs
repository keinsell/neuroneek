use crate::lib::CommandHandler;
use crate::lib::Context;
use clap::Parser;
use sea_orm::prelude::async_trait::async_trait;

#[derive(Parser, Debug)]
#[command(
    version,
    about = "Name of substance to query",
    long_about,
    aliases = vec!["create", "add"]
)]
pub struct GetSubstance
{
    #[arg(index = 1, value_name = "SUBSTANCE", required = true)]
    pub substance_name: String,
}

use miette::Result;

#[async_trait]
impl CommandHandler<crate::substance::Substance> for GetSubstance
{
    async fn handle<'a>(&self, context: Context<'a>) -> Result<crate::substance::Substance>
    {
        let substance =
            crate::substance::repository::get_substance_by_name(&self.substance_name, &context
                .database_connection)
                .await?;
        print!("{}", &substance.to_string());
        Ok(substance)
    }
}

#[cfg(test)]
mod tests
{
    use async_std::test;
}
