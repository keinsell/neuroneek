- There are two-three ways of setting up repository for development, the nix-based one is preferred way as it minimized need for interaction from developer-side and is configuration based.

## "Another Nix Stan" Way

Personally I'm lover of NixOS and configuration-based environments, especially for programming where working on most of the projects in commercial environments we're pain to which I do not expose anybody else, in order to deal with bs I come to idea to use NixOS and per-project environment that developer can use to start contributing to project, setup of initial tooling should not require from developer more than 3-5 commands to be run.

- [devenv]()
- [direnv]() (optional, but recommended)

- You need to have `nix-daemon` and `devenv` installed on your machine.
- You may want to install `direnv` along with [shell hooks](https://direnv.net/docs/hook.html).

### Installation on Linux

```bash
sh <(curl -L https://nixos.org/nix/install) --daemon
nix-env -iA devenv -f https://github.com/NixOS/nixpkgs/tarball/nixpkgs-unstable
```

### Installation on MacOS

```bash
curl -L https://raw.githubusercontent.com/NixOS/experimental-nix-installer/main/nix-installer.sh | sh -s install
nix-env -iA devenv -f https://github.com/NixOS/nixpkgs/tarball/nixpkgs-unstable
```

### Tips

- Before import lines of direnv hook in your shell it's good to do `export DIRENV_LOG_FORMAT=` to avoid verbosity from `direnv`. See: https://github.com/direnv/direnv/issues/68

## "Oh my Docker!"

We've integrated [devenv]() with Docker Devcontainer which means you can use `.devcontainer.json` in the repository root to get your own development environment.

Once you will log inside devcontainer it's necessary to use `devenv shell` command to have all of the project tooling.


## "Works on my machine" (Not Recommended)

Install everything used in project and develop on this layer. It's important to notice we'll not be responsible for any issues what you will experience with our own environment.

- `node`
- `python`
- `docker`
