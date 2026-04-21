# Project Context

- **Owner:** Bruno Capuano
- **Project:** Reusable presentation skill for GitHub Copilot and Claude Code
- **Stack:** Markdown/YAML instructions, HTML/CSS/JavaScript, Reveal.js-style slides, GitHub publishing
- **Created:** 2026-04-21T08:34:14-04:00

## Learnings

- The skill should likely accept a presentation brief, audience, tone, duration, and optional branding cues.
- A useful first release should emit both guidance and a concrete HTML deck scaffold.

## Team Status (2026-04-21 08:51)

### Skill Contract Finalized ✅
- **Input modes:** Minimal (title), Standard (outline + event), Power (code + CSS)
- **Output:** `slides.html` (primary), `README.md`, optional `speaker-notes.md`
- **Slide types (v1):** Title, Content, Code, Demo Transition, Two-Column, Closing
- **Portability:** Markdown + YAML foundation; env var detection (GitHub Copilot vs Claude Code)
- **Non-negotiable:** Lowest common denominator (no tool-specific APIs)

### Cross-Team Dependencies
- **Danny:** First-release scope locked; Phases 1-5 sequenced; repo name shortlist ready
- **Linus:** Reveal.js chosen; 6 slide types mapped; theme tokens + CSS system prepared
- **Livingston:** Acceptance criteria locked; 30+ failure modes; auto + manual test strategy
- **Basher:** Standby for Phase 4

### Your Next Steps
1. **IMMEDIATE:** Publish Phase 1 SPEC.md with 3 runnable examples (minimal, conference, workshop)
2. **In parallel:** Work with Livingston on test case definitions to ensure spec examples are testable
3. **Await:** Linus's Phase 2 templates; then proceed to Phase 3 (generator implementation)
