# Project Context

- **Owner:** Bruno Capuano
- **Project:** Reusable presentation skill for GitHub Copilot and Claude Code
- **Stack:** Markdown/YAML instructions, HTML/CSS/JavaScript, Reveal.js-style slides, GitHub publishing
- **Created:** 2026-04-21T08:34:14-04:00

## Learnings

- Quality needs to cover both valid file output and presentation usability.
- Reference repos imply `slides.html` should be a stable, expected artifact.
- Screenshot validation currently follows the root workflow: `npm test` for the checked-in minimal deck, then `npm run screenshots` for visual previews.
- In this Windows environment, `npm run screenshots` needed `PUPPETEER_EXECUTABLE_PATH` pointed at system Chrome because Puppeteer's bundled browser was not installed.
- Current visual-example rendering looks acceptable for content slides: no browser console errors, no horizontal overflow at 1920×1080, and the regenerated previews now cover minimal, technical, executive, and workshop decks.
- Residual doc mismatch: README still shows only the minimal preview and says the other decks are "Coming Soon" even though the screenshot assets now exist.

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

---

## CLI Command Planning & Testing Strategy (2026-04-21 14:30 UTC) ✅

### Deliverables
- **Document:** .squad/decisions/inbox/livingston-cli-testing.md
- **Content:** Complete command specifications, testing strategy, error matrices, validation harness

### Command Specifications Locked

**Core Commands (6 total):**
1. **init** — Download + extract skill to .copilot/skills/presentation-skill/
   - Unit + Integration + E2E tests
   - Error handling: network down, permissions denied, corrupted download
   - Options: --offline, --force, --dry-run

2. **update** — Fetch newer version, backup old, replace with new
   - Automatic rollback on failure
   - Options: --force, --backup=<path>, --rollback

3. **doctor** — Validate installation health, report structure completeness
   - Detailed findings with remediation steps
   - Options: --verbose, --fix, --json

4. **--version** — Show installed skill version
   - Optional --check-update flag for latest availability

5. **generate** — (BONUS) Generate slides.html from Markdown
   - Validate YAML front matter, parse slides, render HTML
   - Options: --output, --validate-only, --verbose

6. **serve** — (BONUS) Local preview server with hot reload
   - Auto-fallback to next port if in use
   - Options: --port, --no-open, --poll

### Testing Strategy Documented

| Command | Unit | Integration | E2E | Manual |
|---------|------|-------------|-----|--------|
| init | ✓ | ✓ | ✓ | ✓ |
| update | ✓ | ✓ | ✓ | ✓ |
| doctor | ✓ | ✓ | — | — |
| --version | ✓ | — | — | — |
| generate | ✓ | ✓ | ✓ | ✓ |
| serve | ✓ | ✓ | ✓ | ✓ |

**Approach:**
- Real temp directories (not mocks) for integration tests
- Mock GitHub API calls with 
ock
- Jest test framework with >80% coverage target
- 
pm run validate:cli post-install harness
- 6 commands × 3-5 test cases each = ~30 total test scenarios

### Error Handling Matrix

**Fatal Errors (exit code ≠ 0):**
- Network unreachable
- Permissions denied
- Corrupted installation
- Missing required metadata
- Disk full

**Warnings (exit code 0):**
- Already up-to-date
- Port in use (auto-fallback)
- Directory exists (offer --force)

**Exit Codes Standardized:**
- 0 = Success
- 1 = Generic validation error
- 2 = Network error
- 3 = File system error
- 4 = Invalid input
- 5 = Installation/config error

### Validation Harness


pm run validate:cli post-install validation runs:
1. md2slides --version — CLI callable
2. md2slides doctor — Installation healthy
3. md2slides generate --validate-only <example> — Generation works

### Test Data Sets Proposed

Three reference decks for comprehensive testing:
- **Minimal:** 3 slides, no complex features
- **Conference:** 20 slides, images, code blocks, tables, speaker notes
- **Workshop:** 40 slides, two-column layouts, transitions, advanced formatting

### Blockers Identified

1. **Basher:** Version metadata location? (SKILL.md, separate file, or package.json?)
2. **Danny:** npm distribution confirmed? Or just installation destination?
3. **Team:** Approve test data sets before Phase 3 implementation

### Status
✅ Specifications complete and ready for implementation
⏳ Waiting for Basher (architecture) + Danny (distribution strategy) to confirm decisions
