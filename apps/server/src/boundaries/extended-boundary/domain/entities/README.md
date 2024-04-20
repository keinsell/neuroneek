# Entities

Entities are the core of the domain. They encapsulate Enterprise-wide business rules and attributes. An entity can be an
object with properties and methods, or it can be a set of data structures and functions.

Entities represent business models and express what properties a particular model has, what it can do, when and at what
conditions it can do it. An example of business model can be a User, Product, Booking, Ticket, Wallet etc.

Entities must always protect their [invariant](https://en.wikipedia.org/wiki/Class_invariant):

> Domain entities should always be valid entities. There are a certain number of invariants for an object that should
> always be true. For example, an order item object always has to have a quantity that must be a positive integer, plus
> an
> article name and price. Therefore, invariants enforcement is the responsibility of the domain entities (especially of
> the aggregate root) and an entity object should not be able to exist without being valid.

Entities:

- Contain Domain business logic. Avoid having business logic in your services when possible, this leads
  to [Anemic Domain Model](https://martinfowler.com/bliki/AnemicDomainModel.html) (Domain Services are an exception for
  business logic that can't be put in a single entity).
- Have an identity that defines it and makes it distinguishable from others. Its identity is consistent during its life
  cycle.
- Equality between two entities is determined by comparing their identificators (usually its `id` field).
- Can contain other objects, such as other entities or value objects.
- Are responsible for collecting all the understanding of state and how it changes in the same place.
- Responsible for the coordination of operations on the objects it owns.
- Know nothing about upper layers (services, controllers etc.).
- Domain entities data should be modelled to accommodate business logic, not some database schema.
- Entities must protect their invariants, try to avoid public setters - update state using methods and execute invariant
  validation on each update if needed (this can be a simple `validate()` method that checks if business rules are not
  violated by update).
- Must be consistent on creation. Validate Entities and other domain objects on creation and throw an error on first
  failure. [Fail Fast](https://en.wikipedia.org/wiki/Fail-fast).
- Avoid no-arg (empty) constructors, accept and validate all required properties in a constructor (or in
  a [factory method](https://en.wikipedia.org/wiki/Factory_method_pattern) like `create()`).
- For optional properties that require some complex setting
  up, [Fluent interface](https://en.wikipedia.org/wiki/Fluent_interface)
  and [Builder Pattern](https://refactoring.guru/design-patterns/builder) can be used.
- Make Entities partially immutable. Identify what properties shouldn't change after creation and make them `readonly` (
  for example `id` or `createdAt`).

**Note**: A lot of people tend to create one module per entity, but this approach is not very good. Each module may have
multiple entities. One thing to keep in mind is that putting entities in a single module requires those entities to have
related business logic, don't group unrelated entities in one module.

Example files:

- [user.entity.ts](src/modules/user/domain/user.entity.ts)
- [wallet.entity.ts](src/modules/wallet/domain/wallet.entity.ts)

Read more:

- [Domain Entity pattern](https://badia-kharroubi.gitbooks.io/microservices-architecture/content/patterns/tactical-patterns/domain-entity-pattern.html)
- [Secure by design: Chapter 6 Ensuring integrity of state](https://livebook.manning.com/book/secure-by-design/chapter-6/)