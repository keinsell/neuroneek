VERSION 0.8
PROJECT keinsell/neuronek
IMPORT github.com/earthly/lib/rust:3.0.1 AS rust

install:
    FROM keinsell/rust
    WORKDIR /tmp/neuronek
    DO rust+INIT --keep_fingerprints=true

checkout:
    FROM +install
    COPY --dir .cargo ./
    COPY --keep-ts Cargo.toml ./
    COPY --keep-ts --dir src ./
    COPY --keep-ts --dir tests ./
    COPY --keep-ts --dir resources ./

format:
    FROM +lint
    DO rust+CARGO --args="fmt --check"

lint:
    FROM +checkout
    DO rust+CARGO --args="clippy --all-features --offline -- -D warnings"

check:
    FROM +lint
    DO rust+CARGO --args="check"

test:
    FROM +check
    DO rust+CARGO --args="nextest run"

coverage:
    FROM +test
    RUN rustup component add llvm-tools
    DO rust+CARGO --args="llvm-cov --lcov --output-path lcov.info"
    DO rust+CARGO --args="llvm-cov report --lcov"
    DO rust+CARGO --args="llvm-cov --html --output-dir ./coverage"
    SAVE ARTIFACT ./lcov.info AS LOCAL lcov.info
    SAVE ARTIFACT ./coverage AS LOCAL coverage

compile:
    ARG RUST_TARGET
    FROM +checkout
    DO rust+CARGO --args="+nightly zigbuild --release --target $RUST_TARGET --artifact-dir=out -Z unstable-options"
    SAVE ARTIFACT out/neuronek* AS LOCAL ./out/$RUST_TARGET/
    SAVE ARTIFACT out/neuronek*  $RUST_TARGET/

build:
    FROM +checkout
    DO rust+CARGO --args="+nightly build --release --artifact-dir=out -Z unstable-options"  --output="release/[^/\.]+"
    SAVE ARTIFACT out/neuronek neuronek

cross-compile:
    BUILD +compile \
        --RUST_TARGET=aarch64-apple-darwin \
        --RUST_TARGET=x86_64-apple-darwin \
        --RUST_TARGET=x86_64-pc-windows-gnu \
        --RUST_TARGET=x86_64-unknown-linux-gnu \
        --RUST_TARGET=x86_64-unknown-linux-musl \
        --RUST_TARGET=aarch64-unknown-linux-gnu

docker:
    FROM registry.suse.com/bci/bci-micro:latest
    ARG tag='latest'
    WORKDIR /
    COPY +build/neuronek /bin/neuronek
    VOLUME /root/.local/share/neuronek
    ENTRYPOINT ["/bin/neuronek"]
    SAVE IMAGE --push keinsell/neuronek:latest

ci:
	BUILD +test
    BUILD +build

