# Validation checklist — presentation skill v1

> **Purpose:** Run the real validation harness and the manual checks that still protect the room.
>
> **Owner:** Livingston (Tester)  
> **Status:** v1 validation gate  
> **Last updated:** 2026-04-21

---

## Automated check

Run this command from the repo root:

```bash
node tests/validate-example.mjs
```

The script uses built-in Node modules only and exits non-zero on any failure.

### What the harness checks

- Example deck file contract in `examples/minimal-talk/slides.html`
- Example deck title and chrome against the shipped minimal source, not stale literal strings
- Example deck slide count and stable slide treatments
- Inline runtime behavior for the current key bindings and speaker view
- Fragment-first navigation on the middle slide before the deck advances
- File size ceiling for the shipped HTML example
- Source fixture alignment for `tests/fixtures/minimal-deck.md`
- Coverage expectations for `tests/fixtures/edge-cases.md`

---

## Files under test

| File | Role |
| --- | --- |
| `examples/minimal-talk/input.md` | Shipped minimal source example |
| `examples/minimal-talk/slides.html` | Shipped minimal HTML deck |
| `tests/fixtures/minimal-deck.md` | Locked fixture that mirrors the minimal source |
| `tests/fixtures/edge-cases.md` | Compact source fixture for important v1 edge cases |

---

## Manual follow-up before release

The harness is necessary, not sufficient. Before release, also verify:

- [ ] Chrome renders the minimal deck cleanly
- [ ] Firefox renders the minimal deck cleanly
- [ ] Safari renders the minimal deck cleanly
- [ ] Light mode stays readable on a bright display
- [ ] Dark mode stays readable on a dim display
- [ ] Speaker view is usable during a real rehearsal
- [ ] Full-screen mode looks clean on a projector or large monitor
- [ ] No slide shows visible overflow, clipping, or broken code layout

---

## Fixture maintenance rules

- [ ] If `examples/minimal-talk/input.md` changes, update `tests/fixtures/minimal-deck.md` in the same commit.
- [ ] If the v1 authoring surface expands, update `tests/fixtures/edge-cases.md` in the same commit.
- [ ] If the shipped HTML example changes intentionally, update the source-aligned harness assertions in `tests/validate-example.mjs` in the same commit.

---

## Failure policy

- [ ] Do not merge when `node tests/validate-example.mjs` fails.
- [ ] Do not cut a release when any manual follow-up item fails.
- [ ] Do not describe unimplemented browser automation as a passing gate.
