{ pkgs, lib, config, inputs, ... }:

{
  name = "neuronek";

  # Integrate delta into Git
  delta.enable = true;

  # Enable .devcontainer.json generation
  devcontainer.enable = true;
  devcontainer.settings.customizations.vscode.extensions = [
                                                             "mkhl.direnv"
                                                             "prisma.prisma"
                                                           ];

  # Enable dotenv integration
  dotenv.enable = true;
  dotenv.disableHint = true;


    # Enable languages related to project
    # https://devenv.sh/languages/#supported-languages

    languages = {
    typescript = {
      enable = true;
    };
    terraform = {
        enable = true;
        };
    javascript = {
        enable = true;
        bun.enable = true;
        corepack.enable = true;
        pnpm.enable = true;
        pnpm.install.enable = true;
        };
    };

  # https://devenv.sh/basics/
  env.DIRENV_LOG_FORMAT = "";

  # https://devenv.sh/packages/
  packages = [
    pkgs.git
    pkgs.jq
    pkgs.fet-sh
    # JavaScript Tooling
    pkgs.prettierd
    pkgs.turbo
    # Python Tooling
    pkgs.rye
    pkgs.uv
    # Node.js Global Packages
    pkgs.nodePackages_latest.prisma
    pkgs.nodePackages_latest.prettier
    # Node.js Experimental Toolchain
    pkgs.rslint
    pkgs.oxlint
    pkgs.ezno
    pkgs.eslint_d
 ];

  # https://devenv.sh/scripts/
  scripts.hello.exec = "echo hello from $GREET";

  enterShell = ''
    clear
    fet.sh
  '';

  # https://devenv.sh/tests/
  enterTest = ''
    echo "Running tests"
    git --version | grep "2.42.0"
  '';

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/languages/
  # languages.nix.enable = true;

  # https://devenv.sh/pre-commit-hooks/
  # pre-commit.hooks.shellcheck.enable = true;

  # https://devenv.sh/processes/
  # processes.ping.exec = "ping example.com";

  # See full reference at https://devenv.sh/reference/options/
}
