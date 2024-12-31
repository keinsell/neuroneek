default:
    @just --list

lint:
    cargo lint

check:
    cargo check

format:
    cargo fmt
    just --fmt --unstable

fix:
    @just format
    cargo fix

build:
    cargo build

test:
    cargo nextest r

run +args='--help':
    cargo run -- {{ args }}

watch:
    bacon

# Install application on current machine
install:
    cargo install --path=.
