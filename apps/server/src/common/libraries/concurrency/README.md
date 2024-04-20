# Concurrency

TypeScript sometimes is a little big of trouble when it comes to concurrency
mechanism, by our experience, we found that
the best way to handle concurrency is to use `async/await` and `Promise` to
handle concurrency. There is a lot of ways
to deal with additional complexities.

- `Mutex`
- `Fiber`
- `Semaphore`