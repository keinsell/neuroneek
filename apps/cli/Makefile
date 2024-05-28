build_linux:
	cargo build --release
install_bin_linux:
	cp target/release/neuronek-cli /usr/local/bin/neuronek

orm_refresh:
	cd src/migrator && cargo run -- fresh --database-url sqlite://db.sqlite
orm_generate_entity:
	sea-orm-cli generate entity --database-url sqlite://src/migrator/db.sqlite --output-dir src/entities --seaography --expanded-format --with-serde both --date-time-crate chrono
#orm_generate_migration:
#	cd cargo run -- generate MIGRATION_NAME --database-url sqlite://db.sqlite
#orm_migrate_refresh:
#	cargo run -- fresh
#orm_migrate_up:
#	sea-orm-cli migrate up --database-url sqlite://db.sqlite -d src/migrator
#orm_migrate_down:
#	sea-orm-cli migrate down --database-url sqlite://db.sqlite -d src/migrator
