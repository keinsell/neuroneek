use sea_orm_migration::prelude::*;
use tabled::Tabled;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Substance::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Substance::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Substance::Name).string().not_null())
                    .col(ColumnDef::new(Substance::CommonNames).string().not_null())
                    .col(ColumnDef::new(Substance::BrandNames).string().not_null())
                    .col(
                        ColumnDef::new(Substance::SubstituteName)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(Substance::ChemicalClasses)
                            .string()
                            .not_null(),
                    )
                    .col(ColumnDef::new(Substance::Description).string().not_null())
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(Ingestion::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Ingestion::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Ingestion::SubstanceName).string().not_null())
                    .col(ColumnDef::new(Ingestion::IngestedAt).date_time().not_null())
                    .col(ColumnDef::new(Ingestion::Dosage).string().not_null())
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Substance::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(Ingestion::Table).to_owned())
            .await?;

        Ok(())
    }
}

#[derive(DeriveIden, Tabled)]
enum Substance {
    Table,
    Id,
    Name,
    CommonNames,
    BrandNames,
    SubstituteName,
    ChemicalClasses,
    Description,
}

#[derive(DeriveIden, Tabled)]
enum Ingestion {
    Table,
    Id,
    SubstanceName,
    #[sea_orm(column_type = ColumnType::DateTimeWithTimeZone)]
    IngestedAt,
    Dosage,
}
