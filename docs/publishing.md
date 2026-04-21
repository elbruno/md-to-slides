# Publishing

This repository is close to a reviewable source release, but it is not yet the final public package.

## What is ready now

- the v1 contract in `skill/contract.md`
- reusable deck primitives in `templates/`
- a checked-in minimal example source and generated deck in `examples/minimal-talk/`
- root npm scripts for repo checks and example validation wiring
- practical docs in `README.md` and `docs/`

## What still needs to be locked

- Livingston's full validation harness and release-time QA pass
- release tags and release notes
- license choice
- final public-facing repository and skill name

Keep the repo and package metadata neutral until the naming decision is made. The docs can discuss naming options, but the files in this repo should not bake one in early.

## Recommended publishing model

Use the GitHub repository as the source of truth.

1. Publish the repository publicly from `github.com/elbruno`.
2. Keep `skill/`, `templates/`, `examples/`, and `docs/` as the top-level user-facing structure.
3. Tag stable milestones once validation and release hygiene are in place.
4. Add hosted previews after release validation is complete and example decks are intentionally published.

## What people will consume

| Asset | Where it lives | How people use it |
|---|---|---|
| Skill contract | `skill/` | Reuse the authoring and output contract in GitHub Copilot or Claude Code. |
| Deck primitives | `templates/` | Reuse the HTML shell and theme system. |
| Example workflow | `examples/` | Learn the contract from a real input and output pair. |
| Usage docs | `README.md` and `docs/` | Understand the root workflow and publishing expectations. |

## Readiness summary

The repo now works as a source package and reference implementation. It is not blocked on structure anymore; it is blocked on validation completion, release hygiene, and the final naming decision.
