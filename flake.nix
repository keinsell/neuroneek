{
  description = "🧬 Terminal utility to track intake of caffeine (or other stimulants), vitamins, supplements, nootropics and chemical compounds in general.";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    rust-overlay.url = "github:oxalica/rust-overlay";
    flake-utils.url = "github:numtide/flake-utils";
    crane = {
      url = "github:ipetkov/crane";
    };
    devenv.url = "github:cachix/devenv";
  };

  outputs = {
    self,
    nixpkgs,
    rust-overlay,
    flake-utils,
    crane,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        overlays = [(import rust-overlay)];
        pkgs = import nixpkgs {
          inherit system overlays;
        };

        rustToolchain = pkgs.rust-bin.nightly.latest.default.override {
          extensions = [
            "rust-src"
            "llvm-tools-preview"
            "miri"
          ];
        };

        craneLib = (crane.mkLib pkgs).overrideToolchain rustToolchain;

        buildInputs = with pkgs;
          [
            openssl
            pkg-config
          ]
          ++ lib.optionals stdenv.isDarwin [
            darwin.apple_sdk.frameworks.Security
          ];

        commonArgs = {
          src = craneLib.cleanCargoSource (craneLib.path ./.);
          buildInputs = buildInputs;
          nativeBuildInputs = with pkgs; [ pkg-config ];
        };

        cargoArtifacts = craneLib.buildDepsOnly commonArgs;

      in {
        devShells.default = pkgs.mkShell {
          packages = with pkgs;
            [
              rustToolchain
              cargo-edit
              cargo-watch
              rust-analyzer
              bacon
            ]
            ++ buildInputs;

          shellHook = ''
            export RUST_BACKTRACE=1
            echo "Using Rust nightly: $(rustc --version)"
          '';

          RUST_SRC_PATH = "${rustToolchain}/lib/rustlib/src/rust/library";
        };

        packages = {
          default = craneLib.buildPackage (commonArgs
            // {
              inherit cargoArtifacts;
              pname = "neuronek";
              version = "0.0.1-alpha.3";

              doCheck = false;

              preBuild = ''
                export CARGO_INCREMENTAL=0
              '';

              postInstall = ''
                ${pkgs.file}/bin/file $out/bin/*
              '';
            });

          check = craneLib.cargoNextest (commonArgs
            // {
              inherit cargoArtifacts;
              cargoNextestExtraArgs = "--workspace";
            });
        };

        checks = {
          clippy = craneLib.cargoClippy (commonArgs
            // {
              inherit cargoArtifacts;
              cargoClippyExtraArgs = "--all-targets -- --deny warnings";
            });

          fmt = craneLib.cargoFmt {
            src = ./.;
          };
        };
      }
    );
}
