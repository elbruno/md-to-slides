# Presentation skill v1 contract

Use this contract when you turn a presentation brief into a self-contained `slides.html` deck.

## Contract at a glance

| Artifact | Role | Required in v1 |
| --- | --- | --- |
| `input.md` | Source deck definition | Yes |
| `slides.html` | Generated presentation deck | Yes |

In this repo, `input.md` is the conventional source name used in `examples/`. Any Markdown file that follows this contract is valid, but the generated `slides.html` should sit beside the source file.

## Working convention

When you need a concrete default workflow, use this one:

1. Create or update `input.md`.
2. Keep deck metadata in YAML front matter and slide content in Markdown.
3. Generate `slides.html` in the same folder.

This naming convention is a workflow default, not a hard format requirement. The contract still accepts any Markdown filename that follows the rules below.

## Input contract

### Source file shape

The source file uses:

1. YAML front matter for deck-level metadata
2. Markdown body for slide content
3. `---` on its own line to separate slides

```md
---
contract: presentation-skill/v1
title: Talk title
speaker: Your name
---

<!-- slide:type=title -->
# Talk title

Subtitle or promise

---

# First content slide

- Point one
- Point two
```

### Required front matter

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | Required. Deck title shown on the title slide and document title. |

### Recommended front matter

| Field | Type | Notes |
| --- | --- | --- |
| `contract` | string | Recommended value: `presentation-skill/v1`. |
| `speaker` | string | Presenter name. |
| `event` | string | Event, customer, or venue name. |
| `date` | string | Human-readable presentation date. |
| `duration` | string | Example: `10 minutes`, `45 minutes`. |
| `audience` | string | Who the deck is for. |
| `tone` | string | Example: `practical`, `technical`, `executive`. |
| `theme` | string | Theme hint only. Keep values simple, such as `default-dark` or `default-light`. |
| `objective` | string | One-sentence outcome for the talk. |

Unknown front matter keys are allowed and should be preserved for future versions, but v1 behavior only depends on the fields above.

## Slide authoring rules

### Slide boundaries

- Use `---` on its own line to separate slides.
- Do not nest slides in v1.
- Start each slide with a heading.
- Keep slide order meaningful. The renderer must preserve it.
- Do not use standalone `---` inside slide content unless you intend to start a new slide.

### Supported Markdown

V1 supports standard Markdown that stays portable across GitHub Copilot and Claude Code:

- headings
- paragraphs
- bullet and numbered lists
- blockquotes
- tables
- fenced code blocks
- images with alt text
- links

### Optional slide type directive

If you need a specific slide treatment, start the slide with a single-line HTML comment:

```md
<!-- slide:type=code -->
```

Supported v1 values:

- `title`
- `content`
- `code`
- `demo-transition`
- `two-column`
- `closing`

If the directive is omitted, the slide defaults to `content`.

### Type-specific expectations

| Type | Authoring expectation |
| --- | --- |
| `title` | Opening slide. Use a clear `#` heading and a short subtitle or promise. |
| `content` | Default slide for points, lists, quotes, images, and short tables. |
| `code` | Include at least one fenced code block. Keep prose short. |
| `demo-transition` | Short bridge into a live demo or walkthrough. Keep it punchy. |
| `two-column` | Use `## Left` and `## Right` subheadings to mark the two content regions. |
| `closing` | End slide with recap, call to action, contact info, or Q and A. |

### Speaker notes

Use a `??? notes` block at the end of a slide when you want presenter-only notes:

```md
??? notes
- Open with the problem before the solution.
- Keep this slide under 45 seconds.
```

Everything under `??? notes` belongs in presenter notes until the next slide separator.

## Output contract

### Required output

The generator produces one file:

- `slides.html`

### Output guarantees

`slides.html` must:

- be self-contained and ready to open in a browser
- preserve slide order from the source file
- preserve headings, lists, tables, links, images, code blocks, and speaker notes
- remain editable by a human after generation
- avoid requiring client-specific features, custom IDE APIs, or follow-up build steps

### Out of contract for v1

These are explicitly not required in v1:

- companion `README.md` output
- separate `speaker-notes.md`
- multi-file asset bundles
- external runtime services

## Portability rules

This contract is repo-first and cross-client:

- The source of truth lives in versioned files inside the repo.
- The same `input.md` must work in GitHub Copilot and Claude Code.
- The workflow must rely on Markdown, YAML, and normal file creation only.
- Do not require tool-specific APIs, custom slash commands, or IDE-only preview features.
- Keep naming and paths simple enough to work on Windows, macOS, and Linux.

## Definition of done

The contract is satisfied when:

1. A source Markdown file follows the YAML-plus-Markdown structure above.
2. Every slide in the source appears in `slides.html` in the same order.
3. Speaker notes and code blocks are preserved.
4. The result is a single browser-openable `slides.html` file.
5. No extra required artifacts are introduced outside this contract.

## Reference example

See `examples/minimal-talk/input.md` for the smallest useful deck that follows v1.
