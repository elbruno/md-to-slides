# Acceptance criteria — presentation skill v1

> **Purpose:** Define the quality gate the repo can prove today for the shipped minimal example deck.
>
> **Owner:** Livingston (Tester)  
> **Status:** v1 validation gate  
> **Last updated:** 2026-04-21

---

## Commit-time gate

A change passes the current automated gate only when `node tests/validate-example.mjs` succeeds.

### Example deck file contract

- [ ] `examples/minimal-talk/slides.html` starts with an HTML5 doctype.
- [ ] The file declares `lang="en"` and UTF-8 encoding.
- [ ] The document `<title>` matches the shipped minimal source title instead of a hard-coded historical label.
- [ ] The file includes an inline `<style>` block and an inline `<script>` block.
- [ ] The file size stays at or below 5 MB.
- [ ] No unresolved template markers such as `{{ ... }}` or `{% ... %}` remain.

### Example deck structure

- [ ] The deck chrome exists: theme toggle, notes button, slide counter, and progress bar.
- [ ] The chrome title and deck metadata align with the shipped minimal source, not stale fixture strings.
- [ ] The minimal example contains exactly three top-level slides.
- [ ] The shipped slide treatments stay stable: title slide, content slide with split layout, and closing slide.
- [ ] Each slide includes presenter notes.
- [ ] The middle slide includes a checklist, multiple fragments, and a code panel that reflects the shipped example source.
- [ ] The closing slide includes an in-deck return link to `#/1`.

### Example runtime contract

- [ ] The inline runtime initializes on slide 1 of 3.
- [ ] `ArrowRight`, `ArrowLeft`, `PageDown`, `PageUp`, `Space`, `Home`, and `End` move through the deck as currently implemented.
- [ ] Forward navigation reveals all fragments on the middle slide before it advances to the closing slide.
- [ ] `T` toggles the theme.
- [ ] `S` opens speaker view with the current slide title, presenter notes, and next-slide preview.
- [ ] `F` toggles full-screen state in the runtime model.
- [ ] The current implementation is custom reveal-style HTML and JavaScript. This gate does not require a `Reveal` global.

### Fixture contract

- [ ] `tests/fixtures/minimal-deck.md` stays byte-for-byte aligned with `examples/minimal-talk/input.md`.
- [ ] `tests/fixtures/edge-cases.md` covers front matter, notes, nested lists, fenced code, tables, images with alt text, links, special characters, `demo-transition`, `two-column`, and `closing`.

---

## Manual release gate

Run these checks before you call the deck presentation-ready outside the repo:

- [ ] Open the minimal deck in Chrome, Firefox, and Safari.
- [ ] Verify light and dark themes stay readable on a 16:9 display.
- [ ] Verify speaker view feels usable in a real talk flow.
- [ ] Verify no visible overflow, clipping, or unreadable code blocks.
- [ ] Verify full-screen mode works cleanly on a projector or large monitor.

---

## Not yet automated

These checks still matter, but this repo does not prove them automatically today:

- Browser console capture
- W3C HTML validation
- Automated accessibility audit
- Pixel-checked projector layout
- Speaker timer assertions
- Arbitrary markdown-to-HTML fidelity beyond the shipped example deck

---

## Definition of done for this slice

This slice is done when all of the following are true:

1. The Node harness fails fast with a non-zero exit code on broken example output.
2. The minimal source fixture stays aligned with the shipped example source.
3. The edge-case fixture gives the team one compact place to add future regressions.
4. The docs describe the gate that exists now, not a future browser-automation stack.
