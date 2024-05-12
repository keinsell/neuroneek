- There are two-three ways of setting up repository for development, the nix-based one is preferred way as it minimized need for interaction from developer-side and is configuration based.

## The Nix Way

- [nix]()
- [devenv]()
- [direnv]() (optional, but recommended)

- You need to have `nix-daemon` and `devenv` installed on your machine.
- You may want to install `direnv` along with [shell hooks](https://direnv.net/docs/hook.html). 
- You may want to allow `devenv` to use `cachix` and manage it for you.

### Tips

Before hook in your shell it's good to do `export DIRENV_LOG_FORMAT=` to avoid verbosity from `direnv`. See: https://github.com/direnv/direnv/issues/68


### Linux

```
# Install Nix ()
sh <(curl -L https://nixos.org/nix/install) --daemon
# Install DevEnv
nix-env -iA devenv -f https://github.com/NixOS/nixpkgs/tarball/nixpkgs-unstable
```

### MacOS

```
# Install Nix
curl -L https://raw.githubusercontent.com/NixOS/experimental-nix-installer/main/nix-installer.sh | sh -s install
# Install DevEnv
nix-env -iA devenv -f https://github.com/NixOS/nixpkgs/tarball/nixpkgs-unstable
```


## Native Way


```
~/.config/nixpkgs/config.nix << allowUnfree = true
```
