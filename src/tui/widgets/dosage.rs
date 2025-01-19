use crate::substance::DosageClassification;

pub fn dosage_dots(dosage_classification: DosageClassification) -> String
{
    let dosage_strength_bar = match dosage_classification
    {
        | DosageClassification::Threshold => "●○○○○",
        | DosageClassification::Light => "●●○○○",
        | DosageClassification::Medium => "●●●○○",
        | DosageClassification::Strong => "●●●●○",
        | DosageClassification::Heavy => "●●●●●",
    };

    dosage_strength_bar.to_string()
}
