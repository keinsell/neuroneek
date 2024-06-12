orm-push:
	cargo run -- fresh --database-url sqlite://db.sqlite

orm-pull: orm-push
	sea-orm-cli generate entity --database-url sqlite://db.sqlite --output-dir src --date-time-crate chrono --with-copy-enums --serde-skip-hidden-column --ignore-tables seaql_migrations,substance_route_of_administration_phase_effects --expanded-format --seaography -v --with-serde both --model-extra-derives "async_graphql::SimpleObject"

build: orm-pull
	cargo build
