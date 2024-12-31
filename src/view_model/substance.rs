use crate::lib::output::Formatter;
use serde::Deserialize;
use serde::Serialize;
use tabled::Tabled;
use typed_builder::TypedBuilder;

type SubstanceTable = crate::lib::orm::substance::Model;

#[derive(Debug, Serialize, Deserialize, Tabled, TypedBuilder)]
pub struct ViewModel
{
    pub id: String,
    pub systematic_name: String,
    pub common_names: String,
}

impl Formatter for ViewModel {}

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
