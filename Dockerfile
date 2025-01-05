# Base image with GCC and other required tools
FROM registry.suse.com/bci/gcc:latest

LABEL org.opencontainers.image.source=https://github.com/rust-lang/docker-rust

ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH \
    RUST_VERSION=nightly \
    RUSTC_WRAPPER=sccache

VOLUME /usr/local/cargo
VOLUME /usr/local/rustup

# Add the required repositories and refresh zypper
RUN zypper -n ar https://download.opensuse.org/repositories/devel:tools:compiler/15.5/devel:tools:compiler.repo \
    && zypper -n ar https://download.opensuse.org/repositories/devel:/languages:/rust/15.6/devel:languages:rust.repo \
    && zypper --gpg-auto-import-keys ref -s

# Install dependencies for Rust, Zig, and builds
RUN zypper -n in zig rustup lld clang-devel xz sccache openssl-devel \
    && zypper -n inr \
    && zypper clean -a

RUN rustup default nightly \
    && rustup component add rust-src \
    && rustup component add rustc-codegen-cranelift-preview \
    && rustup component add llvm-tools

RUN cargo install cargo-binstall \
    && cargo binstall -y cargo-zigbuild cargo-binstall cargo-machete cargo-sort cargo-nextest cargo-zigbuild cargo-expand cargo-mommy bacon cargo-deny just cargo-tarpaulin xargo cargo-outdated cargo-prebuilt cargo-cache cargo-dist cargo-bundle

# Download and cache MacOS SDKs
RUN curl -L "https://github.com/phracker/MacOSX-SDKs/releases/download/11.3/MacOSX10.9.sdk.tar.xz" | tar -J -x -C /opt \
    && curl -L "https://github.com/phracker/MacOSX-SDKs/releases/download/11.3/MacOSX11.3.sdk.tar.xz" | tar -J -x -C /opt
ENV SDKROOT=/opt/MacOSX11.3.sdk

# Pre-install and cache Rust targets (separated into steps to leverage caching)
RUN rustup target add x86_64-unknown-linux-gnu
RUN rustup target add x86_64-unknown-linux-musl
RUN rustup target add aarch64-unknown-linux-gnu
RUN rustup target add aarch64-unknown-linux-musl
RUN rustup target add arm-unknown-linux-gnueabihf
RUN rustup target add arm-unknown-linux-musleabihf
RUN rustup target add x86_64-apple-darwin
RUN rustup target add aarch64-apple-darwin
RUN rustup target add x86_64-pc-windows-gnu
RUN rustup target add x86_64-pc-windows-msvc
RUN rustup target add aarch64-pc-windows-gnullvm