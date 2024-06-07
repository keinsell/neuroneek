orm-push:
	cd src/migrator && cargo run -- fresh --database-url sqlite://db.sqlite

orm-pull:
	sea-orm-cli generate entity --database-url sqlite:///home/keinsell/Projects/neuronek/db.sqlite --output-dir src --date-time-crate chrono --with-copy-enums --serde-skip-hidden-column --ignore-tables seaql_migrations,substance_route_of_administration_phase_effects --expanded-format -v
