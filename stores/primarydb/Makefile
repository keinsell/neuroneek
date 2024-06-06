db_rehash:
	atlas migrate hash
db_checkpoint_apply:
	atlas migrate checkpoint --dev-url "sqlite://dev?mode=memory"
db_migration_apply:
	atlas schema apply --to "file://schema.hcl" --url "sqlite://db.sqlite"
db_migration_create:
	atlas migrate diff --dir "file://migrations" --to "file://schema.hcl" --dev-url "sqlite://dev?mode=memory"
db_introspection:
	atlas schema inspect -u "sqlite://db.sqlite"
db_sync_atlas_from_prisma:
	prisma db push --accept-data-loss
	atlas schema inspect -u "sqlite://db.sqlite"
db_sync_prisma_from_atlas:
	atlas schema apply --to "file://schema.hcl" --url "sqlite://db.sqlite"
	pnpx prisma db pull
