use chrono::{DateTime, Utc};

use crate::core::mass::Mass;

pub struct Stash {
    id: i32,
    substance_name: String,
    amount: Mass,
    purity: Option<f32>,
    expires_at: Option<DateTime<Utc>>,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}

pub struct StashTransaction {
    id: i32,
    stash_id: i32,
    amount: Mass,
    transaction_date: DateTime<Utc>,
    created_date: DateTime<Utc>,
    updated_date: DateTime<Utc>,
}
