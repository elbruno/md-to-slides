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

### First Slice Completed (2026-04-21 13:11 UTC) ✅
- **Deliverables:** `templates/reveal-base.html`, `templates/theme.css`, `examples/minimal-talk/slides.html`
- **Team Coordination:** Rusty completed contract; Basher completed packaging; Livingston completed QA docs
- **Status:** All decisions merged into canonical `decisions.md`; inbox cleared

### Your Next Steps
1. **AWAIT:** Rusty's Phase 3 deck generator (consumes your templates)
2. **COLLABORATE:** With Livingston on visual/accessibility test patterns derived from your CSS/HTML
3. **PREPARE:** For integration testing once Rusty ships generator implementation

## Session: Slide Centering Fix (2026-04-21 14:xx UTC)

### Issue Fixed
- **Problem:** Generated slides.html decks had all content appearing on the left side instead of being centered
- **Root Cause:** `.reveal .slides > section` used `position: absolute; inset: 0` with flexbox but lacked centering justification properties
- **Solution:** Added `justify-content: center; align-items: center;` to properly center content both horizontally and vertically within the viewport

### Change Details
- **File Modified:** `templates/theme.css` (lines 140-159)
- **CSS Properties Added:** 
  - `justify-content: center` — vertically centers flex children
  - `align-items: center` — horizontally centers flex children
- **Impact:** All slide types (title-slide, content-slide, code-slide, two-column, etc.) now render centered
- **Constraints Maintained:** 
  - Padding values unchanged (intentional design)
  - All existing slide type styling preserved
  - Both dark and light themes work correctly
  - Accessibility features maintained

### Verification
- Fix applies to all responsive breakpoints
- Tested against example decks: `examples/minimal-talk/slides.html`, etc.
- Commit: "fix: center slide content in viewport"
