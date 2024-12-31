use crate::lib::CommandHandler;
use crate::lib::Context;
use crate::lib::output::{Formattable, FormattableVec};
use clap::Parser;
use clap::Subcommand;
use sea_orm::prelude::async_trait::async_trait;
use sea_orm::EntityTrait;
use serde::Deserialize;
use serde::Serialize;
use tabled::Tabled;
use typed_builder::TypedBuilder;

type SubstanceTable = crate::orm::substance::Model;

#[derive(Debug, Serialize, Deserialize, Tabled, TypedBuilder)]
pub struct ViewModel
{
    pub id: String,
    pub systematic_name: String,
    pub common_names: String,
}

impl Formattable for ViewModel {}

impl From<SubstanceTable> for ViewModel
{
    fn from(model: SubstanceTable) -> Self
    {
        ViewModel {
            id: model.id.clone().chars().take(6).collect(),
            common_names: model.common_names.clone(),
            systematic_name: model.systematic_name.clone(),
        }
    }
}


#[derive(Debug, Subcommand)]
pub(super) enum SubstanceCommands
{
    Get(crate::command::GetSubstance),
}

#[derive(Debug, Parser)]
pub(super) struct SubstanceCommand
{
    #[command(subcommand)]
    commands: crate::substance::SubstanceCommands,
}

#[async_trait]
impl CommandHandler for crate::substance::SubstanceCommand
{
    async fn handle<'a>(&self, context: Context<'a>) -> miette::Result<()>
    {
        match &self.commands
        {
            | SubstanceCommands::Get(command) => command.handle(context).await,
        }
    }
}

