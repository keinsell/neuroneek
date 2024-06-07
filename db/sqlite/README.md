# Primary Database

This is a database that is used for storing all the data that is needed for the application to function.

## TODOs

- This directory should "export" packages necessary to work with database in monorepository (prisma)
- This directory should be one and only source of truth for database implementations around apps in project.
- This directory should contain only database related code.
- Integration with tlbs for sharing database documentation.
- Scripts for managing database along with documentation.
- CI/CD for applying and linting changes of database.

## Compatibility

Atlas covers most of the databases which is not a common case when we'll take look into ORMs, even with Prisma there are a lot of cases where database functionality supports something but Prisma does not and migrations in such case are becoming little pain, to avoid all of this there is a tool called `Atlas` which will be useful for actual SQLite migrations and then migrations of cloud database with correct enforcing of gitflow-like migrations.
We no longer depend on Prisma as main definition of database, and instead we use `schema.hcl` which is representation of latest database schema and other implementations of features that related to database are pulling schema from `schema.hcl` not in a different manner (however one is possible).

## Creating database with Prisma integration

```bash
atlas migrate diff \
  --dir "file://migrations" \
  --to "file://schema.lt.hcl" \
  --dev-url "sqlite://dev?mode=memory"
atlas schema apply --to "file://schema.lt.hcl" --url "sqlite://../../db.sqlite"  --auto-approve 
prisma db pull
```


Publishing changes to database
```bash
atlas migrate push neuronek --dev-url "sqlite://dev?mode=memory"
```


## Introspection

```bash
atlas schema inspect -u "sqlite://dev.db"
```

## Migrations

### Checking changes

```bash
atlas migrate diff baseline_migration \
  --dir "file://migrations" \
  --to "file://schema.lt.hcl" \
  --dev-url "sqlite://migration.db"
```

```bash
atlas migrate diff \
  --dir "file://migrations" \
  --to "file://schema.lt.hcl" \
  --dev-url "sqlite://dev?mode=memory"
```

### Applying changes

```bash
atlas schema apply --to "file://schema.lt.hcl" --url "sqlite://../../db.sqlite"
```

## Checkpoint

```bash
atlas migrate checkpoint --dev-url "sqlite://dev?mode=memory"
```

## Dumping Database

```bash
echo ".dump" | sqlite3 dev.db > dump.sql
```

// TODO: Make dumping script to add dump to latest checkpoint in migraitons directory or fail dump.
```bash
sqlite3 /home/keinsell/Projects/neuronek/db.sqlite .dump | sed -e '/BEGIN TRANSACTION;/i \
PRAGMA foreign_keys=OFF;' -e '/COMMIT;/i \
PRAGMA foreign_keys=ON;' | grep "INSERT INTO" > dump.sql
```
