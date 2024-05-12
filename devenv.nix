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
    pkgs.ruff
    # Node.js Global Packages
    pkgs.nodePackages_latest.prisma
    pkgs.nodePackages_latest.prettier
    # Node.js Experimental Toolchain
    pkgs.rslint
    pkgs.oxlint
    pkgs.ezno
    pkgs.eslint_d
    pkgs.go-task
    pkgs.just
    pkgs.nixpacks
    pkgs.tbls
    pkgs.git-lfs
    # Nix-related Tools
    pkgs.nil
    pkgs.git-extras
    pkgs.lolcat
    pkgs.nitch
 ];

  # https://devenv.sh/scripts/
  scripts.hello.exec = "echo hello from $GREET";

  scripts = {
    dev = {
        exec="pnpm dev";
        description="Starts development environment with all of the dependencies";
    };
  };

  scripts.silly-example.exec = ''curl "https://httpbin.org/get?$1" | jq .args'';
  scripts.silly-example.description = "curls httpbin with provided arg";

  scripts.serious-example.exec = ''${pkgs.cowsay}/bin/cowsay "$*"'';
  scripts.serious-example.description = ''echoes args in a very serious manner'';

  enterShell = ''
    clear
    nitch
    echo
    echo 🦾 Helper scripts you can run to make your development richer:
    echo
    ${pkgs.gnused}/bin/sed -e 's| |••|g' -e 's|=| |' <<EOF | ${pkgs.util-linuxMinimal}/bin/column -t | ${pkgs.gnused}/bin/sed -e 's|^|-> |' -e 's|••| |g'
    ${lib.generators.toKeyValue {} (lib.mapAttrs (name: value: value.description) config.scripts)}
    EOF
    echo
    just
  '';

  # https://devenv.sh/tests/
  enterTest = ''
    echo "Running tests"
    git --version | grep "2.42.0"
  '';

  # https://devenv.sh/services/
  services.postgres.enable = true;
  services.redis.enable = true;
  services.minio.enable = true;
  services.vault.enable = true;

  # https://devenv.sh/languages/
   languages.nix.enable = true;
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
    python.enable=true;
    };

  # https://devenv.sh/pre-commit-hooks/
  pre-commit.enabledPackages = [
    pkgs.actionlint
    pkgs.alejandra
    pkgs.checkmake
    pkgs.datalad
  ];

  pre-commit.hooks.shellcheck.enable = true;
  pre-commit.hooks.annex.enable = true;
  pre-commit.hooks.statix.enable = true;
  pre-commit.hooks.tflint.enable = true;
  pre-commit.hooks.topiary.enable = true;
  pre-commit.hooks.ruff.enable = true;
  pre-commit.hooks.ripsecrets.enable = true;
  pre-commit.hooks.pretty-format-json.enable = true;
  pre-commit.hooks.nil.enable = true;
  pre-commit.hooks.beautysh.enable = true;
  pre-commit.hooks.eslint.enable=true;

  # https://devenv.sh/processes/
   processes.ping.exec = "ping example.com";

  # See full reference at https://devenv.sh/reference/options/

  starship.enable = true;
  starship.config.enable = true;
}
