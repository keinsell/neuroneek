pub use sea_orm_migration::prelude::*;


use rust_embed::Embed;

#[derive(Embed)]
#[folder = "src/migration/migrations"]
pub struct Migrations;


macro_rules! sql_migration {
    ($name:ident, $migration_name:expr, $filename:expr) => {
        pub struct $name;

        impl MigrationName for $name
        {
            fn name(&self) -> &str { $migration_name }
        }

        #[async_trait::async_trait]
        impl MigrationTrait for $name
        {
            async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr>
            {
                let migration_filename = format!("{}.sql", $filename);
                let migration_file = Migrations::get(&migration_filename).ok_or_else(|| {
                    DbErr::Custom(format!("Migration file not found: {}", migration_filename))
                })?;
                let sql_statement = std::str::from_utf8(migration_file.data.as_ref())
                    .map_err(|e| DbErr::Custom(format!("Error decoding SQL: {}", e)))?;
                manager
                    .get_connection()
                    .execute_unprepared(sql_statement)
                    .await?;
                Ok(())
            }

            async fn down(&self, _manager: &SchemaManager) -> Result<(), DbErr>
            {
                panic!("Down migrations aren't supported before official release")
            }
        }
    };
}
macro_rules! import_migration {
    ($name:ident, $migration_name:expr, $filename:expr) => {{
        sql_migration!($name, $migration_name, $filename);
        Box::new($name)
    }};
}

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator
{
    fn migrations() -> Vec<Box<dyn MigrationTrait>>
    {
        vec![
            import_migration!(
                M20020101000002CreateDatabaseSchema,
                "m20220101_000001_create_table",
                "20250101000001_add_ingestion_table"
            ),
            import_migration!(
                M20020101000002CreateDatabaseSchema,
                "m20020101_000002_create_database_schema",
                "20250101000002_import_substance"
            ),
            import_migration!(
                M20250101235153DropUnrelatedData,
                "20250101235153_drop_unrelated_data",
                "20250101235153_drop_unrelated_data"
            ),
            import_migration!(
                M20250104060831UpdateDosageBounds,
                "20250104060831_update_dosage_bounds",
                "20250104060831_update_dosage_bounds"
            ),
            import_migration!(
                M20250108183655UpdateRouteOfAdministrationClassificationValues,
                "20250108183655_update_route_of_administration_classification_values",
                "20250108183655_update_route_of_administration_classification_values"
            ),
        ]
    }
}
