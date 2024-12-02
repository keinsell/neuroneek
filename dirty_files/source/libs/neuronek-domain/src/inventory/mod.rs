use chrono::{DateTime, Utc};
use measurements::Mass;

pub enum InventoryCommand {
    Create(CreateInventory),
    Update(UpdateInventory),
    Delete(DeleteInventory),
}

pub struct CreateInventory {
    pub name: String,
    pub description: String,
    pub price: f64,
    pub quantity: i32,
    pub category: String,
}

pub struct UpdateInventory {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub price: f64,
    pub quantity: i32,
    pub category: String,
}

pub struct DeleteInventory {
    pub id: i32,
}

pub trait InventoryManagement {
    fn create_inventory(&self, command: CreateInventory) -> Result<(), String>;
    fn update_inventory(&self, command: UpdateInventory) -> Result<(), String>;
    fn delete_inventory(&self, command: DeleteInventory) -> Result<(), String>;
    fn get_inventory(&self, id: i32) -> Result<Inventory, String>;
    fn get_inventories(&self) -> Result<Vec<Inventory>, String>;
}

pub struct Inventory {
    /// The unique identifier of the stash.
    id: i32,
    /// The name of the substance in the stash.
    substance_name: String,
    /// The amount of the substance in the stash.
    amount: Mass,
    /// The purity of the substance in the stash.
    purity: Option<f32>,
    /// The date and time when the substance in the stash expires.
    expires_at: Option<DateTime<Utc>>,
    /// The date and time when the stash was created.
    created_at: DateTime<Utc>,
    /// The date and time when the stash was last updated.
    updated_at: DateTime<Utc>,
}

pub struct InventoryTransaction {
    id: i32,
    stash_id: i32,
    amount: Mass,
    transaction_date: DateTime<Utc>,
    created_date: DateTime<Utc>,
    updated_date: DateTime<Utc>,
}
