# Publishing

This repository is the source of truth for the published npm package `md-to-slides`.

## What is published now

- the v1 contract in `skill/contract.md`
- reusable deck primitives in `templates/`
- a checked-in minimal example source and generated deck in `examples/minimal-talk/`
- root npm scripts for repo checks and example validation wiring
- practical docs in `README.md` and `docs/`
- the npm package `md-to-slides`

## What still needs to stay aligned after release

- Livingston's full validation harness and release-time QA pass
- release tags and release notes
- npm package contents and README install guidance
- GitHub and npm version parity

The public package name is now locked as `md-to-slides`. Keep the repository docs and package metadata aligned with that name.

## Recommended publishing model

Use the GitHub repository as the source of truth.

1. Publish from this repository and keep Git tags as the release anchor.
2. Keep `skill/`, `templates/`, `examples/`, and `docs/` as the top-level user-facing structure in both GitHub and npm.
3. Treat npm as the easiest consumption path for repo users who want the contract and templates in an existing project.
4. Keep direct GitHub install paths available for users who want a portable `.copilot/skills/presentation-skill/` folder.
5. Add hosted previews after release validation is complete and example decks are intentionally published.

## What people will consume

| Asset | Where it lives | How people use it |
|---|---|---|
| Skill contract | `skill/` | Reuse the authoring and output contract in GitHub Copilot or Claude Code. |
| Deck primitives | `templates/` | Reuse the HTML shell and theme system. |
| Example workflow | `examples/` | Learn the contract from a real input and output pair. |
| npm package | `md-to-slides` | Install the published package into an existing repo and reference the shipped files directly. |
| Usage docs | `README.md` and `docs/` | Understand the root workflow, npm install path, and publishing expectations. |

## Readiness summary

The repo now works as both the reference implementation and the published npm distribution. It is no longer blocked on package naming; the remaining work is release hygiene, validation depth, and keeping GitHub and npm release details aligned.
