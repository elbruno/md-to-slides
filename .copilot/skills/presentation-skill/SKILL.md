---
name: "presentation-skill"
description: "Create or update input.md and generate a self-contained slides.html deck beside it"
domain: "presentation-generation"
confidence: "high"
source: "repo contract"
---

# Generate HTML presentation decks

Try this:

```text
Create `slides.html` from `examples/minimal-talk/input.md` using `skill/contract.md`.
```

This skill turns a repo-hosted Markdown deck source into a self-contained `slides.html` presentation. Treat `skill/contract.md` as the source of truth for the file format, allowed slide types, output guarantees, and portability rules.

---

## When to use this skill

Use this skill when you need to:

- turn a talk brief or outline into a browser-ready HTML deck
- normalize a loose presentation brief into the repo's v1 authoring format
- regenerate `slides.html` after the Markdown source changes

## Required workflow contract

- Default source name: `input.md`
- Required v1 output: `slides.html`
- Default file placement: put `slides.html` beside the source file
- Source of truth: always update the Markdown source before regenerating HTML

## End-to-end workflow

1. Read `skill/contract.md` first.
2. Resolve the working source file.
   - If the user gives a path such as `examples/my-talk/input.md`, use it.
   - If the user gives only a brief, create or update `input.md` in the requested repo folder before generating HTML.
3. Normalize the source into the contract format:
   - YAML front matter at the top
   - Markdown body split into slides with `---`
   - a heading at the start of each slide
   - optional `<!-- slide:type=... -->` directives
   - optional `??? notes` blocks at the end of slides
4. Generate `slides.html` in the same folder as the source file.
5. Use repo templates such as `templates/reveal-base.html` and `templates/theme.css` as implementation guidance when they exist, but keep the final `slides.html` self-contained.
6. Verify before finishing:
   - both source and output files exist
   - slide order matches the source
   - code fences and speaker notes are preserved
   - the result does not require a follow-up build step or client-specific API

## Authoring rules to enforce

- The source format is YAML front matter plus Markdown slides.
- Slides are separated with `---` on its own line.
- Each slide should start with a heading.
- Optional slide typing uses `<!-- slide:type=... -->`.
- Speaker notes use `??? notes`.
- If no slide type is specified, default to `content`.

## Output rules to enforce

- Produce a single `slides.html` file in v1.
- Write it beside the source Markdown file.
- Preserve slide order, code fences, and speaker notes.
- Keep the deck portable across GitHub Copilot and Claude Code.
- Do not depend on client-specific APIs, preview panes, or hidden runtime services.

## Practical defaults

When the source is underspecified:

- create a small but complete `input.md` first
- choose a clear title slide
- keep content slides concise
- reserve code slides for real fenced code
- use a closing slide with a next step, contact, or Q and A
- fill gaps conservatively instead of inventing a complex narrative

## Anti-patterns

- Do not invent a new input syntax when `skill/contract.md` already defines one.
- Do not write `slides.html` to a different folder unless the user explicitly asks for that.
- Do not treat the HTML as the source of truth after generation.
- Do not emit multi-file decks for v1.
- Do not drop notes, rewrite code examples, or reorder slides without a clear reason.
- Do not hide important assumptions outside the repo files.

## Reference

- Contract: `skill/contract.md`
- Portable package: `skill/README.md`
- Claude Code guide: `skill/claude-code.md`
- Minimal example: `examples/minimal-talk/input.md`
