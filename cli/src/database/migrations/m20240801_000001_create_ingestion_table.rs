use sea_orm::EnumIter;
use sea_orm::Iterable;
use sea_orm_migration::prelude::*;
use sea_orm_migration::schema::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration
{
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr>
    {
        manager
            .create_table(
                Table::create()
                    .table(Ingestion::Table)
                    .if_not_exists()
                    .col(pk_auto(Ingestion::Id))
                    .col(string(Ingestion::SubstanceName))
                    .col(enumeration(
                        Ingestion::RouteOfAdministration,
                        Alias::new("route_of_administration"),
                        RouteOfAdministrationClassification::iter(),
                    ))
                    .col(float(Ingestion::Dosage))
                    .col(string(Ingestion::DosageUnit))
                    .col(string_null(Ingestion::Notes))
                    .col(date_time(Ingestion::IngestedAt))
                    .col(date_time(Ingestion::UpdatedAt))
                    .col(date_time(Ingestion::CreatedAt))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr>
    {
        manager
            .drop_table(Table::drop().table(Ingestion::Table).to_owned())
            .await
    }
}

#[derive(Iden, EnumIter)]
enum RouteOfAdministrationClassification
{
    #[iden = "oral"]
    Oral,
}

#[derive(DeriveIden)]
enum Ingestion
{
    Table,
    Id,
    SubstanceName,
    RouteOfAdministration,
    /// Dosage amount
    Dosage,
    /// Unit of measurement for the dosage (e.g., mg, g, ml)
    DosageUnit,
    /// Optional notes about the ingestion
    Notes,
    /// Timestamp of when the substance was ingested
    IngestedAt,
    /// Timestamp of when the record was created
    CreatedAt,
    /// Timestamp of when the record was last updated
    UpdatedAt,
}
