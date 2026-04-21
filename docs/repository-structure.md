# Repository structure

This repository stays intentionally shallow so a new contributor can understand it from the root.

## Top-level layout

```text
md-to-slides/
├── cli/                # Separate md2slides CLI workspace
├── docs/               # Installation, architecture, testing, publishing
├── examples/           # Checked-in Markdown inputs and generated decks
├── scripts/            # Repo maintenance helpers such as screenshot capture
├── skill/              # Portable skill contract and integration guidance
├── templates/          # Reusable HTML shell and CSS theme primitives
├── tests/              # Root validation harness and fixtures
├── README.md           # GitHub-facing entry point
└── package.json        # Root package metadata and validation scripts
```

## Directory guide

| Path | Purpose | Owner | Notes |
| --- | --- | --- | --- |
| `cli/` | Houses the reusable `md2slides` CLI implementation. | Shared CLI work | Root package now ships a thin wrapper that delegates here. |
| `skill/` | Stores the reusable skill contract and skill-facing guidance. | Rusty | This is the authoring contract users follow. |
| `templates/` | Stores the HTML and CSS deck primitives used to shape `slides.html`. | Linus | Keep this presentation-focused and reusable. |
| `examples/` | Stores source material and finished reference decks. | Shared | Show the workflow by example. |
| `docs/` | Stores install, architecture, testing, and publishing docs. | Basher | Keep docs short, direct, and linked from the README. |
| `tests/` | Stores the root validation harness and fixtures. | Livingston | Guards the shipped minimal example. |
| `scripts/` | Stores helper scripts for repo maintenance. | Shared | Current example: screenshot generation. |
| `.github/` | Stores GitHub workflows and automation metadata. | Repo support | CI and repo automation live here. |
| `.copilot/` | Stores local Copilot skill references and helper guidance. | Repo support | Local tooling support only. |
| `.squad/` | Stores team history, decisions, and agent context. | Squad support | Never treat this as shipped package content. |

## Folder contracts

### `skill/`

Use `skill/` for:

- the portable contract
- skill-facing instructions
- integration notes

Do not put generated decks or screenshots here.

### `templates/`

Use `templates/` for:

- base HTML shell
- shared theme CSS
- reusable presentation primitives

Do not turn this into a generic app source tree.

### `examples/`

Use `examples/` for:

- example `input.md` sources
- checked-in `slides.html` outputs
- publishable demo assets

Examples should prove the workflow by doing the work.

### `docs/`

Use `docs/` for pages that explain:

- installation
- architecture
- testing
- publishing
- automation

Keep details here, not in the main README.

### `tests/`

Use `tests/` for:

- repo-root validation harnesses
- fixtures that lock expected behavior
- regression coverage for shipped examples

## Working rule

Place new content where a first-time reader would expect to find it:

- contract in `skill/`
- rendering primitives in `templates/`
- proof in `examples/`
- explanation in `docs/`
- validation in `tests/`

That keeps the repository obvious and keeps the README focused on onboarding.
