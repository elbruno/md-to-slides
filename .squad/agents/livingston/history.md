# Project Context

- **Owner:** Bruno Capuano
- **Project:** Reusable presentation skill for GitHub Copilot and Claude Code
- **Stack:** Markdown/YAML instructions, HTML/CSS/JavaScript, Reveal.js-style slides, GitHub publishing
- **Created:** 2026-04-21T08:34:14-04:00

## Learnings

- Quality needs to cover both valid file output and presentation usability.
- Reference repos imply `slides.html` should be a stable, expected artifact.

## Team Status (2026-04-21 08:51)

### Acceptance Criteria & QA Strategy Finalized ✅
- **Acceptance Criteria:** HTML validity, no console errors, 1920×1080 render, WCAG AA, offline-capable
- **Content Integrity:** Preserve outline structure, speaker notes, code blocks, Markdown formatting, images with alt text
- **Visual Baseline:** Legible from 10 feet, consistent theming (light/dark), keyboard navigation, presenter mode
- **Failure Modes:** 30+ edge cases documented (content corruption, layout, theme, interactivity, file deployment, cross-platform)
- **Test Strategy:**
  - **Automated (every commit):** HTML validity, content preservation, a11y, keyboard nav, encoding
  - **Manual (pre-release):** Projector visual, presenter mode, cross-platform, edge cases, accessibility audit

### Cross-Team Dependencies
- **Danny:** First-release scope locked; Phases 1-5 sequenced; repo names ready
- **Rusty:** Skill contract finalized; input modes, output format, portability
- **Linus:** Deck primitives extracted; Reveal.js chosen; theme + slide types
- **Basher:** Standby for Phase 4

### Your Next Steps
1. **IMMEDIATE:** Build automated test skeleton (HTML validator, content extraction, accessibility baseline)
2. **Collaborate with Rusty:** Define test data sets for Phase 1 examples (minimal, conference, workshop)
3. **Collaborate with Linus:** Define CSS/HTML patterns and accessibility requirements for manual visual tests
4. **Pre-Phase 3:** Prepare comprehensive test harness for generator validation once Rusty ships code

### First Slice Completed (2026-04-21 13:11 UTC) ✅
- **Deliverables:** `docs/acceptance-criteria.md`, `docs/validation-checklist.md`
- **Team Coordination:** Rusty completed contract; Linus completed templates; Basher completed packaging
- **Status:** All decisions merged into canonical `decisions.md`; inbox cleared

### Phase 3 Preparation
1. **Build automated test skeleton** for Rusty's generator (HTML validator, content extraction, a11y baseline)
2. **Coordinate test data** with Rusty using all 3 Phase 1 examples (minimal, conference, workshop)
3. **Prepare manual test playbook** before Phase 5 (projector approval, presenter mode, edge cases)
