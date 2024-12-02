{
  pkgs,
  lib,
  config,
  inputs,
  ...
}: {
  devcontainer.enable = true;

  # https://devenv.sh/basics/
  env.GREET = "devenv";

  # https://devenv.sh/packages/
  packages = with pkgs; [jujutsu lazygit cargo-watch bacon git makeself earthly just upx];

  # https://devenv.sh/languages/
  languages = {
    rust = {
      enable = true;
      channel = "nightly";
      mold.enable = true;
      targets = [
        "x86_64-unknown-linux-gnu"
        "x86_64-unknown-linux-musl"
        "x86_64-pc-windows-gnu"
        "x86_64-pc-windows-msvc"
        "x86_64-apple-darwin"
        "aarch64-apple-darwin"
        "aarch64-unknown-linux-musl"
        "aarch64-pc-windows-msvc"
      ];
    };
  };

  # https://devenv.sh/processes/
  processes.cargo-watch.exec = "cargo-watch";

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/scripts/
  scripts.hello.exec = ''
    echo hello from $GREET
  '';

  enterShell = ''
    hello
    git --version
  '';

  # https://devenv.sh/tests/
  enterTest = ''
    echo "Running tests"
    git --version | grep --color=auto "${pkgs.git.version}"
  '';

  # https://devenv.sh/pre-commit-hooks/
  pre-commit.hooks = {
    shellcheck.enable = true;
    alejandra.enable = true;
    clippy.enable = true;
  };

  # See full reference at https://devenv.sh/reference/options/
}
