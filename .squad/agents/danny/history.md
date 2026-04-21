# Project Context

- **Owner:** Bruno Capuano
- **Project:** Reusable presentation skill for GitHub Copilot and Claude Code
- **Stack:** Markdown/YAML instructions, HTML/CSS/JavaScript, Reveal.js-style slides, GitHub publishing
- **Created:** 2026-04-21T08:34:14-04:00

## Learnings

- The first milestone is a focused skill that outputs a polished HTML deck from a talk brief.
- Reference repos show two useful patterns: a real Reveal.js deck and session packaging that always includes `slides.html`.

## Team Status (2026-04-21 08:51)

### Squad Spawned & Planning Complete ✅
- **Scope Locked:** First release focused on skill contract, HTML generation, basic theming, speaker notes
- **5 Phases Sequenced:** Contract → Primitives → Generator → Packaging → Acceptance
- **Team Assignments:** Rusty (Phase 1+3), Linus (Phase 2), Basher (Phase 4), Livingston (Phase 5)
- **Repo Name Shortlist:** `copilot-presentation-skill` (recommended) or `slide-architect`

### Decisions Finalized
1. ✅ First-Release Scope (Danny) — 5 phases, clear ownership, dependencies mapped
2. ✅ Skill Contract (Rusty) — Input modes, output format, portability strategy
3. ✅ Deck Primitives (Linus) — Reveal.js, 6 slide types, theme system
4. ✅ Acceptance Criteria (Livingston) — Criteria, failure modes, test strategy

### Handoff Checklist Status
- [x] Danny: Locked scope, created first-release decision, phase plan
- [x] Rusty: Defined skill contract, portability strategy, examples matrix
- [x] Linus: Extracted deck architecture, theme tokens, slide primitives
- [x] Livingston: Defined acceptance criteria, test strategy, failure modes
- [x] Danny: Design review complete — implementation interfaces locked

### Design Review Complete (2026-04-21)
- ✅ Minimal repo structure defined (flat, 4 top-level dirs)
- ✅ File ownership assigned: Rusty (skill/), Linus (templates/), Basher (docs/, examples/, README)
- ✅ v1 contract: YAML front matter + Markdown slides → self-contained HTML
- ✅ No severe blockers — work may proceed
- ✅ Repository name: `copilot-presentation-skill` (clear scope)
- **Next:** Rusty creates `skill/SKILL.md` + 3 example inputs
