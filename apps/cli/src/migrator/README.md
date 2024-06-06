# Running Migrator CLI

```
# Most important one for generating entities for db
  cargo run -- fresh --database-url sqlite://db.sqlite
```

- Generate a new migration file
  ```sh
  cargo run -- generate add_ingestion_route_of_administration --database-url sqlite:///home/keinsell/Projects/neuronek/stores/primarydb/dev.db
  ```
- Apply all pending migrations
  ```sh
  cargo run --database-url sqlite://db.sqlite
  ```
  ```sh
  cargo run -- up --database-url sqlite://db.sqlite
  ```
- Apply first 10 pending migrations
  ```sh
  cargo run -- up -n 10
  ```
- Rollback last applied migrations
  ```sh
  cargo run -- down
  ```
- Rollback last 10 applied migrations
  ```sh
  cargo run -- down -n 10
  ```
- Drop all tables from the database, then reapply all migrations
  ```sh
  cargo run -- fresh --database-url sqlite://db.sqlite
  ```
- Rollback all applied migrations, then reapply all migrations
  ```sh
  cargo run -- refresh --database-url sqlite://db.sqlite
  ```
- Rollback all applied migrations
  ```sh
  cargo run -- reset --database-url sqlite://db.sqlite
  ```
- Check the status of all migrations
  ```sh
  cargo run -- status --database-url sqlite://db.sqlite
  ```
