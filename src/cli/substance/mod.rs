pub mod get_substance;

use crate::lib::CommandHandler;
use crate::lib::Context;
use clap::Parser;
use clap::Subcommand;
use sea_orm::prelude::async_trait::async_trait;

#[derive(Debug, Subcommand)]
enum SubstanceCommands
{
    Get(crate::cli::GetSubstance),
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
            | SubstanceCommands::Get(command) => command.handle(context).await.map(|_| ()),
        }
    }
}

use crate::cli::formatter::Formatter;
use serde::Deserialize;
use serde::Serialize;
use tabled::Tabled;
use typed_builder::TypedBuilder;

type SubstanceTable = crate::lib::orm::substance::Model;

#[derive(Debug, Serialize, Deserialize, Tabled, TypedBuilder)]
pub struct ViewModel
{
    pub id: String,
    pub name: String,
    pub common_names: String,
}

impl Formatter for ViewModel {}

impl From<SubstanceTable> for ViewModel
{
    fn from(model: SubstanceTable) -> Self
    {
        ViewModel {
            id: model.id.clone().chars().take(6).collect(),
            name: model.name,
            common_names: model.common_names.clone(),
        }
    }
}
