# Architecture overview

`md-to-slides` is portable and contract-driven.

The core workflow is simple:

1. Start with a Markdown presentation source.
2. Apply the rules in `skill/contract.md`.
3. Use `templates/reveal-base.html` and `templates/theme.css` as the rendering reference.
4. Produce one self-contained `slides.html`.

## Core assets

| Path | Purpose |
| --- | --- |
| `skill/contract.md` | Defines the v1 authoring contract: front matter, slide separators, notes, and output expectations. |
| `templates/reveal-base.html` | Base HTML shell for the generated deck. |
| `templates/theme.css` | Shared presentation theme, layout rules, and visual primitives. |
| `examples/` | Reference inputs and finished decks that prove the contract works. |
| `docs/` | Installation, usage, testing, and publishing guidance. |

## Why this stays portable

- No tool-specific authoring format beyond Markdown + front matter.
- Source of truth stays in versioned Markdown files.
- Output is a single HTML file with no required build step.
- The same contract can be used from GitHub Copilot or Claude Code.

## What ships in the published root package

The published `md-to-slides` package currently ships the reusable content:

- `skill/`
- `templates/`
- `examples/`
- `docs/`

That makes the package useful immediately inside `node_modules/md-to-slides/`.

## Current CLI status

The repo contains a real `md2slides` CLI implementation under `cli/`, and the published root package exposes it through a thin wrapper:

- `md2slides init`
- `md2slides update`
- `md2slides doctor`
- `md2slides version`
- `md2slides generate`
- `md2slides serve`

The root package keeps its skill assets and docs intact, while reusing `cli/src/` for command execution.

## Related docs

- [quickstart.md](quickstart.md)
- [install-options.md](install-options.md)
- [repository-structure.md](repository-structure.md)
- [testing.md](testing.md)
