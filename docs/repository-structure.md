# Repository structure

This repository stays shallow on purpose. You should be able to understand the package from the root without hunting through framework folders.

## Top-level directories

| Path | Purpose | Owner | Notes |
|---|---|---|---|
| `skill/` | Stores the reusable skill contract and skill input examples. | Rusty | This is the user-facing authoring entry point. |
| `templates/` | Stores the HTML and CSS building blocks used to shape `slides.html`. | Linus | Keep these reusable and presentation-focused. |
| `examples/` | Stores example source material and generated deck outputs. | Shared, with Basher owning packaging examples | Use this folder to teach by example. |
| `docs/` | Stores repository, usage, and publishing guidance. | Basher | Keep docs practical and publish-ready. |
| `.github/` | Stores GitHub-specific automation and agent metadata. | Repo support | Useful for workflows and repo integration. |
| `.copilot/` | Stores local Copilot skill references and helper guidance. | Repo support | Helps local tooling and agent behavior. |
| `.squad/` | Stores team coordination history, decisions, and agent context. | Squad support | Not part of the shipped skill package. |

## Directory contracts

### `skill/`

Use `skill/` for the portable skill itself:

- `SKILL.md`
- input examples
- contract-facing instructions

Do not use this folder for generated HTML or visual assets.

### `templates/`

Use `templates/` for deck primitives:

- base HTML shell
- shared CSS tokens
- syntax highlighting styles

Do not turn this into a general app source folder.

### `examples/`

Use `examples/` to show the system working:

- example authoring inputs
- generated output decks
- publishable demo assets

Examples should explain the workflow by doing the work, not by describing it in the abstract.

### `docs/`

Use `docs/` for pages that help someone install, understand, publish, or extend the repository. These pages should stay short, direct, and easy to scan.

## Working rule for this repository

When you add something new, place it in the folder that matches what a new user would expect:

- authoring contract in `skill/`
- rendering building blocks in `templates/`
- proof and samples in `examples/`
- explanation in `docs/`

That folder contract keeps the repository obvious and keeps publishing simple.
