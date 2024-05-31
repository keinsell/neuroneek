use sea_orm_migration::prelude::*;
use tabled_derive::Tabled;

use crate::m20240530_215436_add_ingestion_route_of_administration::RouteOfAdministration::Classification;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Alter table by adding new column
        manager
            .alter_table(
                Table::alter()
                    .table(Ingestion::Table)
                    .add_column(
                        ColumnDef::new(Ingestion::RouteOfAdministration)
                            .string()
                            .not_null()
                            .default("oral"),
                    )
                    .to_owned(),
            )
            .await?;

        // Migration to add route of administration entity to the database

        manager
            .create_table(
                Table::create()
                    .table(RouteOfAdministration::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(RouteOfAdministration::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(RouteOfAdministration::SubstanceName)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(RouteOfAdministration::Classification)
                            .string()
                            .not_null(),
                    )
                    .to_owned(),
            )
            .await?;

        // Migration to add phase entity which will be linked to route of administration

        manager
            .create_table(
                Table::create()
                    .table(Phase::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Phase::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Phase::RouteOfAdministrationId)
                            .integer()
                            .not_null(),
                    )
                    .col(ColumnDef::new(Phase::Classification).string().not_null())
                    .col(ColumnDef::new(Phase::DurationMin).integer().not_null())
                    .col(ColumnDef::new(Phase::DurationMax).integer().not_null())
                    .to_owned(),
            )
            .await?;

        // Migration to add dosage entity which will be linked to route of administration

        manager
            .create_table(
                Table::create()
                    .table(Dosage::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Dosage::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Dosage::RouteOfAdministrationId)
                            .integer()
                            .not_null(),
                    )
                    .col(ColumnDef::new(Dosage::Classification).string().not_null())
                    .col(ColumnDef::new(Dosage::Min).integer().not_null())
                    .col(ColumnDef::new(Dosage::Max).integer().not_null())
                    .to_owned(),
            )
            .await?;

        // manager.create_foreign_key(
        //     ForeignKey::create()
        //         .name("fk_dosage_route_of_administration")
        //         .from(Dosage::Table, Dosage::RouteOfAdministrationId)
        //         .to(RouteOfAdministration::Table, RouteOfAdministration::Id)
        //         .on_delete(ForeignKeyAction::Cascade)
        //         .on_update(ForeignKeyAction::Cascade)
        //         .to_owned(),
        // ).await?;
        //
        // manager.create_foreign_key(
        //     ForeignKey::create()
        //         .name("fk_phase_route_of_administration")
        //         .from(Phase::Table, Phase::RouteOfAdministrationId)
        //         .to(RouteOfAdministration::Table, RouteOfAdministration::Id)
        //         .on_delete(ForeignKeyAction::Cascade)
        //         .on_update(ForeignKeyAction::Cascade)
        //         .to_owned(),
        // ).await?;
        //
        // // Add unique constraint allowing only one route of administration classification per substance
        //
        // manager.create_index(
        //     Index::create()
        //         .name("idx_substance_route_of_administration_classification")
        //         .table(RouteOfAdministration::Table)
        //         .col(RouteOfAdministration::RouteOfAdministrationClassification)
        //         .col(RouteOfAdministration::SubstanceName)
        //         .unique()
        //         .to_owned(),
        // ).await?;
        //
        // // Add unique constraint allowing only one phase classification per route of administration
        //
        // manager.create_index(
        //     Index::create()
        //         .name("idx_route_of_administration_phase_classification")
        //         .table(Phase::Table)
        //         .col(Phase::PhaseClassification)
        //         .col(Phase::RouteOfAdministrationId)
        //         .unique()
        //         .to_owned(),
        // ).await?;
        //
        // // Add unique constraint allowing only one dosage classification per route of administration
        //
        // manager.create_index(
        //     Index::create()
        //         .name("idx_route_of_administration_dosage_classification")
        //         .table(Dosage::Table)
        //         .col(Dosage::DosageClassification)
        //         .col(Dosage::RouteOfAdministrationId)
        //         .unique()
        //         .to_owned(),
        // ).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Ingestion::Table)
                    .drop_column(Ingestion::RouteOfAdministration)
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Ingestion {
    Table,
    RouteOfAdministration,
}

#[derive(DeriveIden)]
enum RouteOfAdministration {
    Table,
    Id,
    SubstanceName,
    Classification,
}

#[derive(DeriveIden)]
enum Phase {
    Table,
    Id,
    RouteOfAdministrationId,
    Classification,
    DurationMin,
    DurationMax,
}

#[derive(DeriveIden)]
enum Dosage {
    Table,
    Id,
    RouteOfAdministrationId,
    Classification,
    Min,
    Max,
}
