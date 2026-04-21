# Quickstart

If you want to consume the published package in another repo, start there:

```bash
npm install md-to-slides
```

Try this:

```text
Use `skill/contract.md`, `examples/minimal-talk/input.md`, `templates/reveal-base.html`, and `templates/theme.css` to produce a `slides.html` deck, then run `npm test` from the repo root.
```

This repo already includes one complete reference path: a source deck in Markdown and the generated HTML deck beside it.

## Before you start

You need:

- Node.js and npm
- a browser to open `slides.html`
- GitHub Copilot or Claude Code if you want to regenerate the deck instead of only reviewing the checked-in example

If you installed from npm, use the same files from `node_modules/md-to-slides/`. The rest of this page is for working in this repository itself.

## 1. Start at the repo root

Run the root check first:

```bash
npm test
```

Today that command verifies the expected example files from the root. If Livingston's validation harness exists at `tests/validate-example.mjs`, the same command runs it automatically against the minimal example.

## 2. Read the source contract

Open these files in order:

1. `skill/contract.md`
2. `examples/minimal-talk/input.md`
3. `examples/minimal-talk/slides.html`

That sequence shows the full v1 flow:

- the contract
- the source Markdown
- the generated deck

## 3. Regenerate the minimal example

The repo does not ship a standalone generator CLI. Generation is driven by the skill contract and template files.

From the repo root, use a prompt like this in GitHub Copilot or Claude Code:

```text
Using `skill/contract.md`, `templates/reveal-base.html`, and `templates/theme.css`, create `examples/minimal-talk/slides.html` from `examples/minimal-talk/input.md`.
```

Keep the output self-contained and write it beside the source file.

## 4. Validate from the root again

After you regenerate the deck, run:

```bash
npm run validate:example
```

This keeps the root workflow simple: source and output live under `examples/`, while validation starts from the repo root.

## 5. Open the deck

Open `examples/minimal-talk/slides.html` in your browser.

Use the checked-in example to confirm that your regenerated deck still preserves:

- slide order
- speaker notes
- Markdown headings and lists
- the self-contained single-file output

## Next steps

- Read `docs/repository-structure.md` to keep new examples in the expected folders.
- Read `docs/publishing.md` for the current release and package distribution model.
