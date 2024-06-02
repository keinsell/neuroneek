use crate::db::phase;
use crate::db::prelude::Phase;
use sea_orm::prelude::ChronoTime;
use sea_orm::ActiveValue::Set;
use sea_orm::{DatabaseConnection, EntityTrait};
use serde::{Deserialize, Serialize};
use std::str::FromStr;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
enum PhaseClassification {
    /// The onset phase can be defined as the period until the very first changes in perception (i.e. "first alerts") are able to be detected.
    Onset,
    /// The "come up" phase can be defined as the period between the first noticeable changes in perception and the point of highest subjective intensity. This is colloquially known as "coming up."
    Comeup,
    /// The peak phase can be defined as period of time in which the intensity of the substance's effects are at its height.
    Peak,
    /// The offset phase can be defined as the amount of time in between the conclusion of the peak and shifting into a sober state. This is colloquially referred to as "coming down."
    Offset,
    /// The after effects can be defined as any residual effects which may remain after the experience has reached its conclusion. After effects depend on the substance and usage. This is colloquially known as a "hangover" for negative after effects of substances, such as alcohol, cocaine, and MDMA or an "afterglow" for describing a typically positive, pleasant effect, typically found in substances such as cannabis, LSD in low to high doses, and ketamine.
    AfterEffects,
}

impl From<PhaseClassification> for String {
    fn from(phase: PhaseClassification) -> Self {
        match phase {
            PhaseClassification::Onset => "onset".to_string(),
            PhaseClassification::Comeup => "comeup".to_string(),
            PhaseClassification::Peak => "peak".to_string(),
            PhaseClassification::Offset => "offset".to_string(),
            PhaseClassification::AfterEffects => "after_effects".to_string(),
        }
    }
}

impl FromStr for PhaseClassification {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "onset" => Ok(PhaseClassification::Onset),
            "comeup" => Ok(PhaseClassification::Comeup),
            "peak" => Ok(PhaseClassification::Peak),
            "offset" => Ok(PhaseClassification::Offset),
            "after_effects" => Ok(PhaseClassification::AfterEffects),
            _ => Err(()),
        }
    }
}

fn parse_duration_to_chrono_time(duration: u32) -> ChronoTime {
    ChronoTime::from_hms_milli_opt(0, 0, 0, duration).unwrap()
}

pub struct CreatePhase {
    route_of_administration_id: i32,
    phase_classification: PhaseClassification,
    min_duration: ChronoTime,
    max_duration: ChronoTime,
}

pub async fn create_phase(db: &DatabaseConnection, create_phase: CreatePhase) {
    let phase_active_model: phase::ActiveModel = phase::ActiveModel {
        id: Default::default(),
        route_of_administration_id: Set(create_phase.route_of_administration_id),
        classification: Set(String::from(create_phase.phase_classification)),
        duration_min: Set(create_phase.min_duration.to_string().parse().unwrap()),
        duration_max: Set(create_phase.max_duration.to_string().parse().unwrap()),
    };

    Phase::insert(phase_active_model)
        .exec_with_returning(db)
        .await
        .unwrap();
}
