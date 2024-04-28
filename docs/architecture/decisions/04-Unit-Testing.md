Okay... What the fuck is wrong with testing ecosystem in this bullshit runtime, I've spent literally 4h trying Jest to just turn on and transpile TypeScript files, `ava` had no problem with this but suddenly Facebook do not give damn about usage of `jest` at `node`.

### Further Research

- https://betterstack.com/community/guides/testing/best-node-testing-libraries/
- https://www.npmjs.com/package/ts-jest-resolver
- https://github.com/Raathigesh/majestic
- https://github.com/jaredpalmer/tsdx
- https://www.npmjs.com/package/supertape
- https://github.com/asd-xiv/tsd-lite-cli
- https://japa.dev/docs/introduction
- https://github.com/tsdjs/tsd
- https://stryker-mutator.io
- https://www.inextenso.dev/speed-up-nestjs-test-executions-with-jest

Eventually after few hours I've come down to usage of `esbuild-jest` transformer which apparently seem to resolve a problem but I'm not sure how this will play with `nestjs` and decorations as one of these transpilers (swc or esbuild) had major problem with decorators and reflection.
