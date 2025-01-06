# Architecture

- src
    - `interface/`
        - contains code related to presentation layer of application, in our case it's `cli`
            - `interface/cli`
                - should reflect structure of cli application, one file per command or subcommand.
    - `utils.rs`
        - small or larger file with cross-cutting utilities like `CommandHandler` trait which is completly out of
          application's scope