build_linux:
	cargo build --release
install_bin_linux: build_linux
	cp target/release/neuronek-cli /usr/local/bin/neuronek
orm_generate:
	sea-orm-cli generate entity --database-url sqlite://db.sqlite --output-dir src/entities
orm_migrate_init:
	sea-orm-cli migrate init --database-url sqlite://db.sqlite
orm_migrate_up:
	sea-orm-cli migrate up --database-url sqlite://db.sqlite
orm_migrate_down:
	sea-orm-cli migrate down --database-url sqlite://db.sqlite