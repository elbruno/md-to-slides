---
contract: presentation-skill/v1
title: Edge case fixture
speaker: Livingston
event: Validation bench
theme: default-dark
objective: Cover the high-value authoring cases in a compact deck
---

<!-- slide:type=title -->
# Edge case fixture

A compact source deck for the v1 validation surface.

??? notes
- Keep this fixture small enough to scan and broad enough to catch format regressions.

---

# Text, lists, and links

- Plain text, **bold**, _italic_, and `inline code`
- Nested lists:
  - second level
    - third level with emoji ✅ and arrow →
- Long link: [Docs anchor](https://example.com/docs/presentation-skill?view=full#speaker-notes)
- Special characters: °, €, ™, →, “quotes”, and 🚀

> Blockquotes should stay readable and should not collapse list spacing.

??? notes
- This slide exists to catch formatting damage before it reaches a browser.

---

<!-- slide:type=code -->
# Code keeps its shape

```js
const title = "md-to-slides";

function formatDeck(name) {
  return `${name} keeps notes, code, and links together`;
}

console.log(formatDeck(title));
```

??? notes
- Preserve indentation, quotes, and template literals.

---

<!-- slide:type=two-column -->
# Split content stays balanced

## Left

- Two-column slides use `## Left` and `## Right`
- Images still need alt text: ![Diagram of slide pipeline](images/pipeline.png)

## Right

| Check | Expectation |
| --- | --- |
| Table | Cells stay aligned |
| Image | Alt text survives |
| Notes | Presenter-only |

??? notes
- This slide combines subheadings, an image reference, and a table.

---

<!-- slide:type=demo-transition -->
# Demo handoff

Ready to switch from static slides to a live walkthrough.

??? notes
- Keep demo transitions short. They are pacing slides, not content dumps.

---

<!-- slide:type=closing -->
# Thanks

Questions or edge cases I missed?

??? notes
- Closing slides still need notes so the fixture exercises that path too.
