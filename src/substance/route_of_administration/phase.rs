use crate::substance::PhaseClassification;

pub const PHASE_ORDER: [PhaseClassification; 5] = [
    PhaseClassification::Onset,
    PhaseClassification::Comeup,
    PhaseClassification::Peak,
    PhaseClassification::Comedown,
    PhaseClassification::Afterglow,
];
