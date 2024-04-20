# `Logger`

## Core Appenders

- `ConsoleAppender`
- `FileAppender`
- `RollingFileAppender`
- `SyslogAppender`

## Core Layouts

- `PatternLayout`
- `SimpleLayout`
- `SyslogLayout`
- `XmlLayout`
- `JsonLayout`
- `CsvLayout`
- `RawLayout`
- `RFC5424Layout`

## Core Filters

- `LevelFilter`
- `ThresholdFilter`
- `ExpressionFilter`
- `RegexFilter`
- `PropertyFilter`
- `MarkerFilter`
- `MapFilter`

## Developer Journal

- `[2024-02-06]`, Started overall work on `Logger` component and module for Nest.js, researched solutions over the web
  and I do not understand why people configure Pino in such weird way where they are doing 3-5 overrides of somehow
  globally defined config just to avoid splitting logger to few components. I do understand current approach is not
  efficient as it could be but I think this can deliver all of the features needed (transports to external places,
  logfiles and formatting).