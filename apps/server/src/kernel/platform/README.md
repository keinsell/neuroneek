# Platform

Through almost 2 years of experience with Nest.js I can say with grace this
framework was made by incompetent people for incompetent people no matter of
current market share of this piece of shit.
Nobody could even reason why they are using this, nobody understands how it
works but most of them claim "they know and have read the source code and
then are somehow suprised when they see transformation and decoration of
code".

Behind the silly community, I find it extremely inconvenient in most of the
places, its engine has tons of synchronized promises and unhandled ones
which makes debugging hard, and it's against performance of V8.
Dependency Injection engines was actually written by Microsoft good at least
4-5 years ago once TypeScript has become a thing, and personally, the only
thing I like in Nest.js is easy and understandable dependency injection
system which plays well with some other design patters such as Interceptor—
but at the end of the day it's all the same thing I could do from scratch in
one week (talking there about framework) so I come down to decision where
coming back to Express.js or playing around new technology such as Elysia
and Bun will be a much better choice.

- [ ] Interceptor Pattern
- [ ] Middleware through Dependency Injection (DI)
- [ ] Filter Pattern
- [ ] Controller Pattern
- [ ] Guard Pattern
- [ ] Pipe Pattern
- "Platform-Agnostic" (btw. I have different understanding of this term than
  Node.js but considering they first call `@nestjs/cqrs` lightweight and
  then say they meant it's not production-ready by saying lightweight I'll
  not take any of their word seriously. Same as there platform agnosticsm of
  Nest.js is like... when you switch from fastify to express you need to
  kick out half of modules and rewrite everything related to http anyway
  because things get ruined. So yeah...)
- Extension API (core, http, grpc, ws, gql + standard modules:
  reference, caching, scheduling, persistence)
- Out-Of-Box Bundler (based on TypeScript or Webpack if I sniff enough
  coke to use this bullshit—for the last 4 years without webpack in my life,
  I could consider my life minimally pleasurable)
