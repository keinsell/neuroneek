# Neuronek CLI 🧬

Intelligent dosage tracker application for monitoring supplements, nootropics and psychoactive substances along with their long-term influence on one's mind and body.

## Features

- Track supplement and substance dosages
- Monitor effects and side effects
- Long-term influence tracking
- Cross-platform support (Linux, Windows, macOS)
- Command-line interface for efficient usage

## Installation

### Pre-built Binaries

Download the latest release for your platform from the [Releases](https://github.com/keinsell/neuronek-cli/releases) page.

### Building from Source

```bash
git clone https://github.com/keinsell/neuronek-cli.git
cd neuronek-cli
cargo build --release
```

The binary will be available at `target/release/neuronek-cli`.

## Development

### Prerequisites

- [Nix Package Manager](https://nixos.org/download.html)
- [direnv](https://direnv.net/) (recommended)

### Development Environment

This project uses [devenv](https://devenv.sh/) for a reproducible development environment. The environment includes:

- Rust (nightly toolchain)
- Cross-compilation targets
- Development tools and dependencies

To get started:

1. Clone the repository:
```bash
git clone https://github.com/keinsell/neuronek-cli.git
cd neuronek-cli
```

2. Allow direnv (if using):
```bash
direnv allow
```

3. Or activate the development environment manually:
```bash
devenv shell
```

### Building

```bash
# Development build
cargo build

# Release build
cargo build --release

# Run tests
cargo test
```

### Cross-compilation

The project supports multiple targets:
- x86_64-unknown-linux-gnu
- x86_64-unknown-linux-musl
- x86_64-pc-windows-gnu
- x86_64-pc-windows-msvc
- x86_64-apple-darwin
- aarch64-apple-darwin
- aarch64-unknown-linux-musl
- aarch64-pc-windows-msvc

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
