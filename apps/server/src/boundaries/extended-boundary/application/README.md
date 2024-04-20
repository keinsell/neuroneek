# Application layer

## Application Services

Application Services (also called "Workflow Services", "Use Cases", "Interactors", etc.) are used to orchestrate the
steps required to fulfill the commands imposed by the client.

Application services:

- Typically used to orchestrate how the outside world interacts with your application and performs tasks required by the
  end users;
- Contain no domain-specific business logic;
- Operate on scalar types, transforming them into Domain types. A scalar type can be considered any type that's unknown
  to the Domain Model. This includes primitive types and types that don't belong to the Domain;
- Uses ports to declare dependencies on infrastructural services/adapters required to execute domain logic (ports are
  just interfaces, we will discuss this topic in details below);
- Fetch domain `Entities`/`Aggregates` (or anything else) from database/external APIs (through ports/interfaces, with
  concrete implementations injected by the [DI](https://en.wikipedia.org/wiki/Dependency_injection) library);
- Execute domain logic on those `Entities`/`Aggregates` (by invoking their methods);
- In case of working with multiple `Entities`/`Aggregates`, use a `Domain Service` to orchestrate them;
- Execute other out-of-process communications through Ports (like event emits, sending emails, etc.);
- Services can be used as a `Command`/`Query` handlers;
- Should not depend on other application services since it may cause problems (like cyclic dependencies);

One service per use case is considered a good practice.

<details>
<summary>What are "Use Cases"?</summary>

[wiki](https://en.wikipedia.org/wiki/Use_case):

> In software and systems engineering, a use case is a list of actions or event steps typically defining the
> interactions between a role (known in the Unified Modeling Language as an actor) and a system to achieve a goal.

Use cases are, simply said, list of actions required from an application.

---

</details>

Example file: [create-user.service.ts](src/modules/user/commands/create-user/create-user.service.ts)

More about services:

- [Domain-Application-Infrastructure Services pattern](https://badia-kharroubi.gitbooks.io/microservices-architecture/content/patterns/tactical-patterns/domain-application-infrastructure-services-pattern.html)
- [Services in DDD finally explained](https://developer20.com/services-in-ddd-finally-explained/)

## Commands & Queries

This principle is
called [Command–Query Separation(CQS)](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation). When possible,
methods should be separated into `Commands` (state-changing operations) and `Queries` (data-retrieval operations). To
make a clear distinction between those two types of operations, input objects can be represented as `Commands`
and `Queries`. Before DTO reaches the domain, it's converted into a `Command`/`Query` object.

## Ports

Ports are interfaces that define contracts that should be implemented by adapters. For example, a port can abstract
technology details (like what type of database is used to retrieve some data), and infrastructure layer can implement an
adapter in order to execute some action more related to technology details rather than business logic. Ports act
like [abstractions](<https://en.wikipedia.org/wiki/Abstraction_(computer_science)>) for technology details that business
logic does not care about. Name "port" most actively is used
in [Hexagonal Architecture](<https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)>).

In Application Core **dependencies point inwards**. Outer layers can depend on inner layers, but inner layers never
depend on outer layers. Application Core shouldn't depend on frameworks or access external resources directly. Any
external calls to out-of-process resources/retrieval of data from remote processes should be done through `ports` (
interfaces), with class implementations created somewhere in infrastructure layer and injected into application's
core ([Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)
and [Dependency Inversion](https://en.wikipedia.org/wiki/Dependency_inversion_principle)). This makes business logic
independent of technology, facilitates testing, allows to plug/unplug/swap any external resources easily making
application modular and [loosely coupled](https://en.wikipedia.org/wiki/Loose_coupling).

- Ports are basically just interfaces that define what has to be done and don't care about how it's done.
- Ports can be created to abstract side effects like I/O operations and database access, technology details, invasive
  libraries, legacy code etc. from the Domain.
- By abstracting side effects, you can test your application logic in isolation
  by [mocking](https://en.wikipedia.org/wiki/Mock_object) the implementation. This can be useful
  for [unit testing](https://en.wikipedia.org/wiki/Unit_testing).
- Ports should be created to fit the Domain needs, not simply mimic the tools APIs.
- Mock implementations can be passed to ports while testing. Mocking makes your tests faster and independent of the
  environment.
- Abstraction provided by ports can be used to inject different implementations to a port if
  needed ([polymorphism](<https://en.wikipedia.org/wiki/Polymorphism_(computer_science)>)).
- When designing ports, remember
  the [Interface segregation principle](https://en.wikipedia.org/wiki/Interface_segregation_principle). Split large
  interfaces into smaller ones when it makes sense, but also keep in mind to not overdo it when not necessary.
- Ports can also help to delay decisions. The Domain layer can be implemented even before deciding what technologies (
  frameworks, databases etc.) will be used.

**Note**: since most ports implementations are injected and executed in application service, Application Layer can be a
good place to keep those ports. But there are times when the Domain Layer's business logic depends on executing some
external resource, in such cases those ports can be put in a Domain Layer.

**Note**: abusing ports/interfaces may lead
to [unnecessary abstractions](https://mortoray.com/2014/08/01/the-false-abstraction-antipattern/) and overcomplicate
your application. In a lot of cases it's totally fine to depend on a concrete implementation instead of abstracting it
with an interface. Think carefully if you really need an abstraction before using it.

Read more:

- [A Color Coded Guide to Ports and Adapters](https://8thlight.com/blog/damon-kelley/2021/05/18/a-color-coded-guide-to-ports-and-adapters.html)