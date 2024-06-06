<h1 align="center">Neuronek</h1>

<p align="center">
  <b>Build journal of your neurochemisty</b>
  <br><br>
  <a href="https://codecov.io/gh/keinsell/neuronek" >
  <img src="https://codecov.io/gh/keinsell/neuronek/branch/main/graph/badge.svg?token=RCgwN04Ije"/>
  </a>
    <a href="https://wakatime.com/badge/user/13a02f4d-34c9-45f7-95ee-bf9d66b139fb/project/69d00351-b8a4-4431-a21e-798846120e57"><img src="https://wakatime.com/badge/user/13a02f4d-34c9-45f7-95ee-bf9d66b139fb/project/69d00351-b8a4-4431-a21e-798846120e57.svg" alt="wakatime"></a>
</p>

<br>

Neuronek is an application that provides essential tools for people who want to use psychoactive
substances in a safe and healthy way, regardless of their personal goals or usage patterns. The app offers personalized
dosing recommendations, insights into usage patterns, a comprehensive database of substances, and a community of users
who are also interested in promoting responsible usage of these substances.

<p align="center">
Special thanks for current >10 ⭐ stargazzers, somehow this revived project.
</p>



<h2 align="center">Getting started</h2>

<br>

> [!CAUTION]  
> Application is during development and drafting stage, there are and will be a lot of breaking changes and none of applications or features are recommended to be used yet, for public usage there is a [Hosted Instance on Railway](https://neuronek.up.railway.app/reference) which is a read-only overview what server will provide yet first application released related to repository will be CLI Application as it's easiest to write and allow for quick experimenting comparing to changes needed to be made in server or web environments.

Application currently is available as CLI Application, you can find it in [bin](./apps/cli) directory, it's a Rust application and you can run it with `cargo run` command. Eventually there is `Makefile` contained which allows you to build application with `make build-linux` and then `sudo make install-bin-linux` to install one in `${HOME}/.local/bin` on your host machine, as it's early development version it is not released publicly and again, it's not recommended to be used yet.

```bash
cd apps/cli && make build-linux && sudo make install-bin-linux
```

<h2 align="center">Development</h2>

There are various ways to get started with development on this project, as Nix Stan I always prefer to have like "native-like" experience, when I'm working on some code - that means I like everybody in project to have the same versions of packages as ones used for building project, deploying project  through pipeline and at the end running the project - to archive such there are two ways that makes it easy - [Nix](https://nixos.org/) and [Docker](https://www.docker.com/), where Docker is a virtualized environment which wastes some resources during development and Nix which may be something new to newcomers, yet it's setup is pretty straightforward and available for every machine.

Some folks who do not like Nix, or Docker (or both) may want to use tools like [`pkgx`](https://pkgx.sh/) which is fundamentally something like `nix` therefore without `nix` - you can build configuration of tools and packages you need to run project and then use them in project.

Starting a development in recommended way requires you to have [`nix`](https://nixos.org/),
[`direnv`](https://direnv.net/) and [`devenv`](https://devenv.sh/) installed on your machine,
configuration in repository will automatically spin up all dependencies and set up environment for you ([refer to devenv documentation for setup guide](https://devenv.sh/getting-started/))

```bash
direnv allow
cp example.env .env
devenv shell
pnpm dev
```

If you are person who prefer working with Docker, you can use probably known concept of [Devcontainer](https://code.visualstudio.com/docs/remote/containers) and [Remote Development](https://code.visualstudio.com/docs/remote/remote-overview) to get started with development, and the configuration is available at `.devcontainer.json` - it's a replication of Nix-based environment in Docker which should be enough provide you environment in which you can start development of project.

```
# TODO
```

<h2 align="center">Documentation</h2>

Documentation is actively maintained in `docs` directory, it's public so anyone can
read it and understand vision of project. There is no near plans to change place where documentation is mantained as once it was available in Notion things we're not so accessible as they can be in repository.

<h2 align="center">Contributing</h2>

Before contributing to this project, please read [Code of Conduct](./CODE_OF_CONDUCT.md) and [Contributing Guidelines](./CONTRIBUTING.md).

I would like to discourage you to contribute to this project, as I think it's too early as one question about contributing was asked - however, if you really want it's necessary to conduct `docs` to see like bigger picture of application, choose application you would like to extend - no matter it's a server, web or cli (for purpose of learning I use different language for each app) and then you can just open PR and change things, leave it for me to review, and we can discuss it together.

Some issues may be tagged as `help wanted` or `good first issue`, there are always good starting point however this do not mean other issues cannot be taken or are more  complicated (I mean this project will be indefinitely complicated due to my technical approach there but this should fade away over time).
