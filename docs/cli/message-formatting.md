# Message Formatting

Application offers non-interactive functionality which would modify the way of formatting information piped to `stdout`,
meaning you can use application's data that you would normally see in a table by other software programs.

Non-interactive mode would activate automatically when the environment in which the application is running is not
interactive (with use of a cargo library `atty` which contains complete specification on which conditions shell are
considered interactive or not).

Non-interactive mode is de-facto modifying underlying logic for stdout formatting, application expose `--format`
argument which forces usage of specified formatter for every of the following commands that is run by the application.

```bash
neuronek -f json ingestion list
```

```json
[
  {
    "id": 1,
    "substance_name": "caffeine",
    "route": "Oral",
    "dosage": "10.0 mg",
    "ingested_at": "2025-01-06 04:40:27.253301"
  }
]
```

## Examples

### Pipe command output to another program

Non-interactive mode would automatically activate when you are piping output, which allows you to use any program that
can ingest JSON and make use of it. Example shows how the application is used to list ingestion's and then use Nushell's
JSON parser to build a pretty table, which is the default way nushell shows information.

```nu
> neuronek ingestion list | from json
╭───┬────┬────────────────┬───────┬─────────┬────────────────────────────╮
│ # │ id │ substance_name │ route │ dosage  │        ingested_at         │
├───┼────┼────────────────┼───────┼─────────┼────────────────────────────┤
│ 0 │  1 │ caffeine       │ Oral  │ 10.0 mg │ 2025-01-06 04:40:27.253301 │
╰───┴────┴────────────────┴───────┴─────────┴────────────────────────────╯
```

## References

- [clig.dev](https://clig.dev/#output)