# Quickstart

## Intended onboarding path

```bash
npm install md-to-slides
npx md2slides init
```

Run those commands at the root of the repository where you want to use the skill.

The same CLI also works as `md2slides init` when the package is installed globally or your environment exposes local npm binaries on `PATH`.

## Current package reality

The published root `md-to-slides` package now includes:

- the shipped skill files under `node_modules/md-to-slides/`
- the `md2slides` CLI wrapper, which reuses the implementation in `cli/src/`

## Direct-file usage

If you prefer not to materialize `.copilot/skills/presentation-skill/`, point your AI agent at the package files directly:

- `node_modules/md-to-slides/skill/contract.md`
- `node_modules/md-to-slides/templates/reveal-base.html`
- `node_modules/md-to-slides/templates/theme.css`

Example prompt:

```text
Use `node_modules/md-to-slides/skill/contract.md`, `node_modules/md-to-slides/templates/reveal-base.html`, and `node_modules/md-to-slides/templates/theme.css` to create `slides.html` from my Markdown outline.
```

## Working in this repository

If you are contributing in this repo, start with:

```bash
npm test
```

Then review these files in order:

1. `skill/contract.md`
2. `examples/minimal-talk/input.md`
3. `examples/minimal-talk/slides.html`

That gives you the contract, the source, and the shipped output in one pass.

## Next steps

- [install-options.md](install-options.md)
- [architecture-overview.md](architecture-overview.md)
- [repository-structure.md](repository-structure.md)
- [testing.md](testing.md)
