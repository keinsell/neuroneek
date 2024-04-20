# Aggregate

[Aggregate](https://martinfowler.com/bliki/DDD_Aggregate.html) is a cluster of domain objects that can be treated as a single unit. It encapsulates entities and value objects which conceptually belong together. It also contains a set of operations which those domain objects can be operated on.

## When to introduce?

- Boundary is complex enough and cannot be managed by itself which creates a need to build aggregate around it, to manage the complexity.