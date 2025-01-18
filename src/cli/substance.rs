use crate::formatter::Formatter;
use crate::migration::async_trait::async_trait;
use crate::substance::Substance;
use crate::substance::SubstanceTable;
use crate::utils::AppContext;
use crate::utils::CommandHandler;
use clap::Args;
use clap::Parser;
use clap::Subcommand;
use serde::Deserialize;
use serde::Serialize;
use tabled::Tabled;
use typed_builder::TypedBuilder;

#[derive(Debug, Args)]
pub struct GetSubstance
{
    #[arg(index = 1)]
    pub name: String,
}

#[async_trait]
impl CommandHandler<Substance> for GetSubstance
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<Substance>
    {
        let substance =
            crate::substance::repository::get_substance(&self.name, ctx.database_connection)
                .await?
                .unwrap();

        Ok(substance)
    }
}

#[derive(Debug, Subcommand)]
enum SubstanceCommands
{
    Get(GetSubstance),
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
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()>
    {
        match &self.commands
        {
            | SubstanceCommands::Get(command) => command.handle(ctx).await.map(|_| ()),
        }
    }
}

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
