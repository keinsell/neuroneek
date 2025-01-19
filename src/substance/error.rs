use miette::Diagnostic;
use thiserror::Error;

#[derive(Error, Diagnostic, Debug, PartialEq, Clone)]

pub enum SubstanceError
{
    #[error("error with disk cache")]
    DiskError,
    #[error("substance not found")]
    NotFound,
}
