use sea_orm_migration::prelude::*;

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
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Substance::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
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
