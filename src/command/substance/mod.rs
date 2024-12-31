pub mod get_substance;

pub use crate::command::substance::get_substance::GetSubstance;
use crate::lib::CommandHandler;
use crate::lib::Context;
use clap::Parser;
use clap::Subcommand;
use sea_orm::prelude::async_trait::async_trait;

#[derive(Debug, Subcommand)]
enum SubstanceCommands
{
    Get(crate::command::GetSubstance),
}

#[derive(Debug, Parser)]
pub struct SubstanceCommand
{
    #[command(subcommand)]
    commands: SubstanceCommands,
}

#[async_trait]
impl CommandHandler for SubstanceCommand
{
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        match &self.commands
        {
            | SubstanceCommands::Get(command) => command.handle(context).await,
        }
    }
}
