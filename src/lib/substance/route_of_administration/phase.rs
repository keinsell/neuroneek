use crate::lib::substance::PhaseClassification;

pub const PHASE_ORDER: [PhaseClassification; 5] = [
    crate::lib::substance::PhaseClassification::Onset,
    crate::lib::substance::PhaseClassification::Comeup,
    crate::lib::substance::PhaseClassification::Peak,
    crate::lib::substance::PhaseClassification::Comedown,
    crate::lib::substance::PhaseClassification::Afterglow,
];
