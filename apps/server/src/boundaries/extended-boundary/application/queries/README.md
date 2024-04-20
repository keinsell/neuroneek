# Queries

`Query` is similar to a `Command`. It belongs to a read model and signals user intent to find something and describes
how to do it.

`Query` is just a data retrieval operation and should not make any state changes (like writes to the database, files,
third party APIs, etc.). For this reason, in read model we can bypass a domain and repository layers completely and
query database directly from a query handler.

Similarly to Commands, Queries can use a `Query Bus` if needed. This way you can query anything from anywhere without
importing classes directly and avoid coupling.

---

By enforcing `Command` and `Query` separation, the code becomes simpler to understand. One changes something, another
just retrieves data.

Also, following CQS from the start will facilitate separating write and read models into different databases if someday
in the future the need for it arises.

**Note**: this repo uses [NestJS CQRS](https://docs.nestjs.com/recipes/cqrs) package that provides a command/query bus.

Read more about CQS and CQRS:

- [Command Query Segregation](https://khalilstemmler.com/articles/oop-design-principles/command-query-segregation/).
- [Exposing CQRS Through a RESTful API](https://www.infoq.com/articles/rest-api-on-cqrs/)
- [What is the CQRS pattern?](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)
- [CQRS and REST: the perfect match](https://lostechies.com/jimmybogard/2016/06/01/cqrs-and-rest-the-perfect-match/)