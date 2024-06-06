[//]: # (Directory containing cross-application testing &#40;mostly e2e testing of apps&#41;. Probably it's good idea to centralize those tests into most root directory but idk.)

# Root-level Tests

There are contained tests that are executed on the system level, they are ensuring components of repository are talking well each other and general compatibility between them is ensured. In terms of testing individual components the tests are contained per-component directory. However, tests contained in this repository are considered most important as if something breaks here means the system is not functioning at all.


- `e2e/` (End-to-End tests)
- `integration/` (Integration tests)

