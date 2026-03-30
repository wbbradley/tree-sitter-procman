# tree-sitter-procman

A [tree-sitter](https://tree-sitter.github.io/) grammar for the
[procman](https://github.com/wbbradley/procman) `.pman` language.

## Procman version compatibility

This grammar targets **procman v0.20.0**.

When bumping compatibility, check the procman
[CHANGELOG](https://github.com/wbbradley/procman/blob/main/CHANGELOG.md) from
the current target version forward and update the grammar, external scanner,
queries, and test corpus as needed.

## Usage

```sh
# generate the parser
npx tree-sitter generate

# run tests
npx tree-sitter test
```

## Query files

| File | Purpose |
|------|---------|
| `queries/highlights.scm` | Syntax highlighting |
| `queries/indents.scm` | Auto-indentation |
| `queries/locals.scm` | Local scope tracking |
