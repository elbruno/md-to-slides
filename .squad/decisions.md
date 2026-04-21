# Squad Decisions

## Active Decisions

### 1. First-Release Scope: Presentation Skill (Danny, 2026-04-21)

**Status:** ✅ Locked  
**Decision:** Define v1 scope, phases, and repository strategy for a reusable presentation skill for GitHub Copilot and Claude Code.

**In Scope:**
- Skill contract (Markdown input format)
- HTML deck generation (Reveal.js-compatible, single-file output)
- Basic theme system (Light/Dark modes, configurable accent colors)
- Speaker notes (per-slide, visible in presenter mode)
- Section semantics (Title, content, transition, code slides)
- One reference deck (Global Azure Spain 2026 keynote as template)

**Out of Scope (v1):**
- Slide animations (static transitions only)
- Embedded video/media
- Live demos or interactive content
- WYSIWYG editor or UI builder
- Multi-file projects
- Accessibility audit (deferred to v2)

**Implementation Phases:**
1. **Phase 1: Skill Contract** (Rusty) → SPEC.md + 3 examples
2. **Phase 2: Slide Primitives** (Linus) → Reusable HTML + CSS
3. **Phase 3: Deck Generator** (Rusty) → Prompt-driven HTML generation
4. **Phase 4: Packaging + Examples** (Basher) → Repo structure, docs, GitHub Pages
5. **Phase 5: Acceptance Testing** (Livingston) → Validation gates, regression suite

**Success Criteria:**
- ✅ Skill works identically on GitHub Copilot and Claude Code
- ✅ Generates valid, presenter-ready HTML from 3 different Markdown outlines
- ✅ Produces readable output without manual post-generation fixes
- ✅ Example decks demonstrate real-world usage
- ✅ Repo is publishable with clear docs and no maintenance debt

**Repository Recommendation:** `copilot-presentation-skill` (clear scope) or `slide-architect` (memorable)

**Handoff:** Rusty validates Phase 1 approach; Linus prepares Phase 2; Basher identifies repo template; Livingston defines acceptance criteria.

---

### 2. Skill Contract: HTML Presentation Generation (Rusty, 2026-04-21)

**Status:** ✅ Proposed  
**Decision:** Define the input/output contract and portability strategy across GitHub Copilot and Claude Code.

**User Inputs:**
- **Minimal:** Presentation title (required), Speaker/Author (optional), Topic summary (optional)
- **Standard:** Minimal + Slide outline, Event details, Theme/Style
- **Power User:** Standard + Code examples, Demo plan, Custom CSS variables, Existing presentation URL

**Expected Outputs:**
- **Primary:** `slides.html` (self-contained, embedded Reveal.js)
- **Secondary:** `README.md` (usage guide), `speaker-notes.md` (optional)

**Slide Types (v1):** Title, Content, Code, Demo Transition, Two-Column, Closing

**Portability Strategy:**
- **Foundation:** Markdown + YAML (both tools parse natively)
- **Template Engine:** Jinja2-style (portable, deterministic)
- **Environment Detection:** Check env vars (COPILOT_SESSION, CLAUDE_CODE_SESSION); default to generic Markdown
- **Portability Rule:** MUST NOT depend on tool-specific APIs; use lowest common denominator (file I/O, Markdown)

**Tool-Specific Affordances:**
| Feature | GitHub Copilot | Claude Code | Notes |
|---------|----------------|-------------|-------|
| Multi-file creation | `create()` | `create()` | Same API ✅ |
| Interactive prompts | `ask_user()` | `ask()` | Different names, same concept |
| Web preview | Copilot preview pane | CLI, manual open | Document both |
| Git integration | Auto-commit prompt | Manual | Skill doesn't assume |

**Example Templates:**
1. Minimal Talk (3 slides, default theme)
2. Tech Conference (8 slides, branded dark, code + diagrams)
3. Workshop Series (4-deck consistency, speaker notes)
4. Custom Theme (CSS variables, brand colors)
5. Update Existing (parse → modify → regenerate workflow)

**Success Metrics (v1):**
- [ ] Generate valid `slides.html` in <10s
- [ ] Render correctly in Chrome, Firefox, Safari
- [ ] Both GitHub Copilot and Claude Code execute without errors
- [ ] 5 examples cover 80% of use cases
- [ ] Zero external runtime dependencies

---

### 3. Deck Structure & Primitives (Linus, 2026-04-21)

**Status:** ✅ Proposal for v1 Architecture  
**Decision:** Define HTML presentation patterns, CSS theming, and slide primitives based on reference deck analysis.

**Core Framework:** Reveal.js 5.2.0 (battle-tested, PDF export, speaker notes, keyboard navigation)

**Slide Types (v1):**
1. **Title Slide** (`.title-slide`) — Gradient hero, speaker card, event info
2. **Section Divider** (`.section-divider`) — Decorative bar, centered gradient heading
3. **Content Slide** (`.content-slide`) — H2 title, two-column (text + image)
4. **Code Slide** (`.code-slide`) — H2 title, full-height code block, syntax highlighting
5. **Demo Transition** (`.demo-transition`) — Attention-grabbing accent gradient
6. **Two-Column** (`.two-column`) — H2 title, flex columns with optional divider

**Design Tokens (CSS Custom Properties):**
```css
/* Colors */
--ga-primary: #0078D4
--ga-teal: #089182
--ga-coral: #E8590C
/* Typography */
--ga-font-heading: 'Inter', sans-serif
--ga-font-code: 'JetBrains Mono', monospace
--ga-font-size-base: 38px
```

**Theme System:** Light/Dark modes with CSS variables; manual toggle (top-right); brand color override support

**Output Structure:** Single self-contained HTML (inline CSS/JS, base64 assets, public CDN fonts)

**Reveal.js Configuration:**
- `center: false` (top-left alignment, consistent reading flow)
- `controls: false` (keyboard-only navigation)
- `progress: true` (thin progress bar)
- `hash: true` (shareable slide URLs)

**Deferred to v2:**
- Slide animations beyond fragments
- Interactive elements (iframes, quizzes)
- Multi-deck management
- Real-time collaboration
- Video backgrounds

**Recommendations:**
- Build reusable primitives, not bespoke layouts
- Maintain semantic HTML for accessibility
- Avoid per-slide CSS (use class-based theming)
- Use relative units (em, %, vh) for responsiveness

---

### 4. Acceptance Criteria & QA Strategy (Livingston, 2026-04-21)

**Status:** ✅ Proposed  
**Decision:** Define acceptance criteria, failure modes, and test strategy for v1 validation and future regressions.

**Acceptance Criteria (Non-Negotiable):**

**1.1 Output Contract:**
- ✅ Valid HTML5 (W3C validator)
- ✅ No console errors in modern browsers
- ✅ 1920×1080 render, no horizontal scroll
- ✅ Working Reveal.js instance with navigation
- ✅ File ≤ 5MB with all assets embedded/CDN-linked
- ✅ All internal links resolve without 404 errors

**1.2 Content Integrity:**
- ✅ Preserve outline structure (all sections present)
- ✅ Preserve speaker notes and cue text
- ✅ Preserve code blocks exactly (no reformatting)
- ✅ Render all Markdown formatting
- ✅ Display images with alt text
- ✅ Display code with syntax highlighting

**1.3 Visual & UX Baseline:**
- ✅ Consistent visual theme (Dark/Light modes functional)
- ✅ Typography legible from 10 feet (24pt min)
- ✅ Color contrast ≥ 4.5:1 (WCAG AA)
- ✅ Slide numbers and total count displayed
- ✅ Keyboard navigation support (arrows, Page Up/Down, space)
- ✅ Presenter view with timer and notes

**1.4 Presentation-Room Reality:**
- ✅ Works on Windows, macOS, Linux
- ✅ Full-screen mode without UI glitches
- ✅ Maintains 16:9 aspect ratio
- ✅ Compatible with 1080p and 4K projectors
- ✅ Offline-capable (no failing CDN dependencies)

**Top Failure Modes (30+ edge cases documented):**
- Content corruption (special chars, nested quotes, URLs breaking)
- Layout & rendering (text overflow, image scaling, table readability)
- Theme & style (contrast, theme toggle, custom colors)
- Interactivity (keyboard shortcuts, transitions, presenter mode)
- File & deployment (encoding, relative paths, permissions)
- Cross-platform (CSS Grid/Flexbox, touch events, PDF export)

**Test Strategy:**
- **Automated (every commit):** HTML validity, content preservation, accessibility baseline, keyboard navigation
- **Manual (pre-release/major changes):** Projector visual inspection, presenter mode, cross-platform rendering, edge cases
- **Regression Suite:** Maintained post-launch to prevent regressions

**Success Metrics (v1):**
- ✅ 0 HTML validation errors
- ✅ 0 console errors across browsers
- ✅ ≥95% automated test coverage
- ✅ WCAG AA compliance
- ✅ Projector approval (2+ team members)
- ✅ Zero showstopper bugs in first 30 days

**Open Questions for Danny/Linus:**
1. Minimum browser version support?
2. File hosting (GitHub Pages vs local)?
3. User customization boundary?
4. PDF export requirement?
5. Reveal.js speaker view: required or optional?
6. Slide count/file size ceiling?
7. Accessibility: closed captions, video transcripts?

---

### 5. Skill Contract: Repository-Hosted Single-File Format (Rusty, 2026-04-21)

**Status:** ✅ Locked  
**Decision:** Lock v1 authoring contract around one repo-hosted source file to ensure portability and simplicity.

**Contract Details:**
- **Input:** Single Markdown file with YAML front matter
- **Separators:** `---` for slide boundaries
- **Directives:** Optional `<!-- slide:type=... -->` for explicit slide type control
- **Speaker Notes:** `??? notes` syntax for per-slide notes
- **Output:** One self-contained `slides.html` file written beside source

**Rationale:**
- Keeps contract explicit and portable across GitHub Copilot and Claude Code
- Easy to version in repo and integrate with existing workflows
- Small enough for Linus and Basher to build around without format churn
- Supports all 6 v1 slide types without requiring multi-file projects

**Success Metrics:**
- ✅ Skill generates valid HTML in <10 seconds
- ✅ All 3 example inputs (minimal, conference, workshop) produce working decks
- ✅ Zero external runtime dependencies for output files

---

### 6. Slide Primitives: Self-Contained Reveal.js Runtime (Linus, 2026-04-21)

**Status:** ✅ Locked  
**Decision:** Build reusable starter runtime and CSS system so generated decks work immediately without external tooling.

**Core Components:**
- **Base Template:** `templates/reveal-base.html` with embedded Reveal.js 5.2.0
- **CSS System:** `templates/theme.css` with design tokens and slide primitives
- **Default Theme:** System font stacks (no web font dependency required)
- **Accessibility:** Semantic HTML, WCAG AA contrast, keyboard navigation

**Design Principles:**
- All assets self-contained or CDN-linked (no build step required)
- CSS custom properties enable runtime theme customization
- Slide types extensible through class-based styling (not per-slide CSS)
- Projector-friendly defaults (16:9, offline-capable, keyboard-accessible)

**Benefits:**
- Linus and Basher can build independently from Rusty's generator
- Generated output immediately ready for presenter mode and PDF export
- Users can hand-edit output if needed (portable, version-control friendly)

---

### 7. Repository Packaging & Docs-First Approach (Basher, 2026-04-21)

**Status:** ✅ Locked  
**Decision:** Execute Phase 4 packaging as docs-first pass without placeholder implementation files.

**Deliverables:**
- **`README.md`** — Main entry point with quick start and feature highlights
- **`docs/repository-structure.md`** — Define folder contract and ownership boundaries
- **`docs/publishing.md`** — Establish GitHub Pages and skill registration path

**Rationale:**
- Rusty and Linus own implementation; Basher avoids duplication by focusing on packaging surface
- Honest documentation prevents repo from appearing runnable before it is
- Clear folder structure and ownership boundaries reduce merge conflicts
- Publishing path established before code lands (enables faster release)

**Impact:**
- Contributors have one clear layout to build into
- Public path from GitHub to Copilot ecosystem is concrete and documented
- Baseline repo health (license, gitignore, contributing guide) ready before Phase 3

---

### 8. Acceptance Criteria & Two-Phase Validation (Livingston, 2026-04-21)

**Status:** ✅ Locked  
**Decision:** Define acceptance criteria upfront (before implementation) and establish two-phase validation strategy.

**Phase 1: Acceptance Criteria (Quality Contract)**
- Output Contract: HTML5 valid, no console errors, 1920×1080 render, ≤5MB file size
- Content Integrity: Preserve outline, notes, code blocks, special chars, images with alt text
- Visual Baseline: 24pt min body text, 44pt min headings, WCAG AA contrast, offline capability
- Presentation-Room Reality: Works on Windows/macOS/Linux, 1080p/4K projectors, 16:9 aspect ratio
- Success Metrics: HTML validity, console errors, accessibility baseline, keyboard navigation

**Phase 2: Two-Phase Validation**
- **Commit-Time (Automated):** HTML validator, content extraction, a11y baseline, keyboard nav, encoding
- **Release-Time (Manual):** Projector visual test (mandatory 2+ sign-off), theme toggle, presenter mode, edge cases

**Key Decisions:**
- Acceptance criteria **written before implementation** (gates quality upfront)
- 30+ failure modes documented and maintained (edge case registry)
- Regression suite: 3 baseline decks tested repeatedly across releases
- Presentation-room reality testing mandatory pre-release (projector approval required)

**Impact:**
- Teams align on pass/fail criteria before Phases 2-5 begin
- Prevents scope creep and output that looks valid but fails in production
- Regression suite prevents subtle breaks (e.g., presenter mode timer)

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
- Decisions merged from `.squad/decisions/inbox/` weekly; inbox files deduplicated and archived
- Decisions 5-8 represent locked commitments from first implementation slice (2026-04-21)

### 9. Installation UX & Marketplace Strategy (Danny, 2026-04-21)

**Status:** ✅ Locked
**Decision:** v1-v3 distribution roadmap for presentation-skill.

**v1 (Now):** Shell install scripts + GitHub Actions template
**v2 (Q3 2026):** GitHub Marketplace submission
**v3 (Future):** GitHub Skills Registry / Claude Marketplace

Full research: .squad/decisions/inbox/danny-installation-ux.md`n
