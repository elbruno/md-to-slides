# Project Context

- **Owner:** Bruno Capuano
- **Project:** Reusable presentation skill for GitHub Copilot and Claude Code
- **Stack:** Markdown/YAML instructions, HTML/CSS/JavaScript, Reveal.js-style slides, GitHub publishing
- **Created:** 2026-04-21T08:34:14-04:00

## Learnings

- `C:\src\260418-globalazurespain-plan\slides\keynote\slides.html` is a concrete Reveal.js-style reference deck.
- Session materials in the reference repos treat `slides.html` as a stable deliverable alongside code and prompts.

## Team Status (2026-04-21 08:51)

### Deck Primitives Extracted ✅
- **Framework:** Reveal.js 5.2.0 (battle-tested, speaker notes, PDF export built-in)
- **Slide types (v1):** Title, Section Divider, Content, Code, Demo Transition, Two-Column
- **Theme:** CSS custom properties (colors, fonts, spacing); light/dark toggle; accent customization
- **Output:** Single self-contained HTML (inline CSS/JS, base64 assets, CDN fonts)
- **Typography:** 38px base, 2.6em H1, 1.85em H2; Inter + JetBrains Mono

### Cross-Team Dependencies
- **Rusty:** Skill contract finalized; input modes, output format, portability locked
- **Danny:** First-release scope locked; Phases sequenced; repo names ready
- **Livingston:** Acceptance criteria comprehensive; failure modes mapped; test strategy defined
- **Basher:** Standby for Phase 4 (repo packaging)

### Your Next Steps
1. **IMMEDIATE:** Await Rusty's Phase 1 SPEC.md (already drafted, pending formal publish)
2. **Once Phase 1 locked:** Begin building templates/reveal-base.html.j2 with reusable components
3. **Collaborate with Livingston:** Define CSS/HTML patterns that feed into automated visual tests
