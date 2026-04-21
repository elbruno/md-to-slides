# Testing

Testing is split between the root package and the separate CLI workspace.

## Root validation flow

Run this from the repository root:

```bash
npm test
```

At the root, `npm test` runs:

1. `npm run check` — verifies the expected skill, template, and example files exist
2. `npm run validate:example` — runs `tests/validate-example.mjs` against the shipped minimal example deck

## What the root harness validates

The root harness checks the checked-in minimal example for:

- HTML file contract
- expected slide structure
- presentation chrome
- runtime navigation behavior
- notes support
- fixture alignment
- key edge cases

Primary files involved:

- `examples/minimal-talk/input.md`
- `examples/minimal-talk/slides.html`
- `tests/validate-example.mjs`
- `tests/fixtures/minimal-deck.md`
- `tests/fixtures/edge-cases.md`

## CLI workspace tests

The repository also includes a separate CLI package in `cli/`.

That workspace has its own `package.json`, `src/`, and Jest-based test suite. Treat it as separate from the published root content package when you are working on CLI behavior.

## Manual release checks

Automated checks are not the whole story. Before calling a deck release-ready, also verify:

- browser rendering
- theme readability
- speaker view usability
- fullscreen behavior
- no visible overflow or clipping

For the full quality gate, read:

- [acceptance-criteria.md](acceptance-criteria.md)
- [validation-checklist.md](validation-checklist.md)
