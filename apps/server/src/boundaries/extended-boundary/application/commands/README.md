# Commands

`Command` is an object that signals user intent, for example `CreateUserCommand`. It describes a single action (but does
not perform it).

`Commands` are used for state-changing actions, like creating new user and saving it to the database. Create, Update and
Delete operations are considered as state-changing.

Data retrieval is responsibility of `Queries`, so `Command` methods should not return business data.

Some CQS purists may say that a `Command` shouldn't return anything at all. But you will need at least an ID of a
created item to access it later. To achieve that you can let clients generate
a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) (more info
here: [CQS versus server generated IDs](https://blog.ploeh.dk/2014/08/11/cqs-versus-server-generated-ids/)).

Though, violating this rule and returning some metadata, like `ID` of a created item, redirect link, confirmation
message, status, or other metadata is a more practical approach than following dogmas.

**Note**: `Command` is similar but not the same as described
here: [Command Pattern](https://refactoring.guru/design-patterns/command). There are multiple definitions across the
internet with similar but slightly different implementations.

To execute a command you can use a `Command Bus` instead of importing a service directly. This will decouple a command
Invoker from a Receiver, so you can send your commands from anywhere without creating coupling.

Avoid command handlers executing other commands in this fashion: Command → Command. Instead, use events for that
purpose, and execute next commands in a chain in an Event handler: Command → Event → Command.

Read more:

- [What is a command bus and why should you use it?](https://barryvanveen.nl/blog/49-what-is-a-command-bus-and-why-should-you-use-it)
- [Why You Should Avoid Command Handlers Calling Other Commands?](https://www.rahulpnath.com/blog/avoid-commands-calling-commands/)