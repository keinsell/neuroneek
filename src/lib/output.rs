use serde::Serialize;
use tabled::Table;
use tabled::Tabled;
use crate::OutputFormat;

pub trait Formattable: Serialize + Tabled + Sized {
    fn format(&self, format: OutputFormat) -> String {
        match format {
            OutputFormat::Pretty => {
                Table::new(std::iter::once(self))
                    .with(tabled::settings::Style::modern())
                    .to_string()
            }
            OutputFormat::Json => {
                serde_json::to_string_pretty(self).unwrap_or_else(|_| "Error serializing to JSON".to_string())
            }
        }
    }
}

pub struct FormattableVec<T: Formattable>(Vec<T>);

impl<T: Formattable> FormattableVec<T> {
    pub fn new(items: Vec<T>) -> Self {
        Self(items)
    }

    pub fn format(&self, format: OutputFormat) -> String {
        match format {
            OutputFormat::Pretty => {
                if self.0.is_empty() {
                    return "No items found.".to_string();
                }
                Table::new(&self.0)
                    .with(tabled::settings::Style::modern())
                    .to_string()
            }
            OutputFormat::Json => {
                serde_json::to_string_pretty(&self.0).unwrap_or_else(|_| "Error serializing to JSON".to_string())
            }
        }
    }
} 