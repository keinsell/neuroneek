orm-push:
	cargo run -- fresh --database-url sqlite://db.sqlite

orm-pull: orm-push
	sea-orm-cli generate entity --database-url sqlite://db.sqlite --output-dir src --date-time-crate chrono --with-copy-enums --serde-skip-hidden-column --ignore-tables seaql_migrations,substance_route_of_administration_phase_effects --expanded-format --with-serde both

ormgql: orm-pull
	seaography-cli ./ src sqlite://db.sqlite neuronek-db-graphql

build: orm-pull
	cargo build
