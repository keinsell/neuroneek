# Install toolchain for building for x86_64-unknown-linux-gnu
_install-target-linux:
	rustup target add x86_64-unknown-linux-gnu

# Build for x86_64-unknown-linux-gnu (production)
build-linux: _install-target-linux
	cargo build --target x86_64-unknown-linux-gnu --release
	# Clean target directory
	rm -rf dist/linux
	mkdir -p dist/linux
	cp target/x86_64-unknown-linux-gnu/release/neuronek dist/linux/neuronek
	# Stipping is a process of removing unneeded data from the binary, this is done to reduce the size of the binary
	strip dist/linux/neuronek
	# Upx is a binary compression tool that can reduce the size of the binary by a factor of 2-3x
	# https://upx.github.io/
	upx dist/linux/neuronek
	# Add installation instructions to the binary
	cp docs/.release/INSTALL-LINUX.txt dist/linux/INSTALL
	# Add README to the binary
	cp README.md dist/linux/README

install_bin_windows:
	cp target/release/neuronek.exe dist/windows/neuronek.exe

install_bin_linux:
	cp target/release/neuronek-cli /usr/local/bin/neuronek

orm-push:
	cd src/migrator && cargo run -- fresh --database-url sqlite://db.sqlite

orm-pull:
	sea-orm-cli generate entity --database-url sqlite://src/migrator/db.sqlite --output-dir src/entities --seaography --expanded-format --with-serde both --date-time-crate chrono

# Requires:
# - paru -S mingw-w64 pkg-config
# - rustup target add x86_64-pc-windows-gnu
# - rustup target add x86_64-pc-windows-msvc
# XDGs do not work on Windows
# build:
# 	cargo build -Zmultitarget --target x86_64-unknown-linux-gnu --target x86_64-pc-windows-gnu

#orm_generate_migration:
#	cd cargo run -- generate MIGRATION_NAME --database-url sqlite://db.sqlite
#orm_migrate_refresh:
#	cargo run -- fresh
#orm_migrate_up:
#	sea-orm-cli migrate up --database-url sqlite://db.sqlite -d src/migrator
#orm_migrate_down:
#	sea-orm-cli migrate down --database-url sqlite://db.sqlite -d src/migrator
