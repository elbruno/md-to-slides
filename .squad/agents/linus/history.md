# Project Context

- **Owner:** Bruno Capuano
- **Project:** Reusable presentation skill for GitHub Copilot and Claude Code
- **Stack:** Markdown/YAML instructions, HTML/CSS/JavaScript, Reveal.js-style slides, GitHub publishing
- **Created:** 2026-04-21T08:34:14-04:00

## Learnings

- `C:\src\260418-globalazurespain-plan\slides\keynote\slides.html` is a concrete Reveal.js-style reference deck.
- Session materials in the reference repos treat `slides.html` as a stable deliverable alongside code and prompts.
- **npm Publish Prep Applied (2026-04-21 15:56:34 UTC):**
  - ✅ All template files confirmed included in npm publish allowlist
  - ✅ `templates/reveal-base.html` and `templates/theme.css` both included (27 files, 619 kB verified)
  - ✅ No internal team files leaked (.squad/, tests/, .github/ all excluded)
  - ✅ Generated decks will travel with the package when users `npm install md-to-slides`
  - **Status:** Your CSS and HTML system is ready for distribution; no changes needed

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

## Session: CLI Implementation (2026-04-22)

### Commands Implemented ✅

**1. `md2slides init` — Initialize skill installation**
- Downloads latest release from GitHub releases API (elbruno/md-to-slides)
- Supports `--version` flag for pinning specific versions
- Supports `--force` to overwrite existing installations
- Atomic updates: creates backup before replacing, restores on failure
- Uses `os.tmpdir()` for cross-platform temporary files (not hardcoded /tmp)
- Config updated in `~/.md2slides/config.json` with version + timestamp
- Clear success messaging with next steps

**2. `md2slides update` — Upgrade to new version**
- Queries GitHub releases API for latest available version
- Compares current version (from config) against latest using semver logic
- Skips silently if already up-to-date
- Supports `--version` to target specific version
- Backup-before-update atomicity ensures no data loss on download failure
- Restores from backup automatically on error

**3. `md2slides doctor` — Validate installation health**
- Checks installation directory exists
- Validates all required files present (skill/contract.md, templates/reveal-base.html, templates/theme.css, examples/)
- Verifies config.json exists and is valid JSON
- Checks installed version against latest (with offline graceful degradation)
- Reports status: GOOD, WARNING, or ERROR with actionable fix suggestions
- Optional `--json` flag for machine-readable output

**4. `md2slides --version / version` — Show version information**
- Displays CLI version (from package.json) and installed skill version (from config)
- Optional `--check-updates` flag to query GitHub for available updates
- Shows update available notification with semver comparison
- Gracefully degrades if offline

### Architecture Decisions

**Path Handling (Windows + Unix):**
- All paths use `path.join()` (not string concatenation)
- `os.tmpdir()` for temp files (cross-platform: /tmp on Unix, %TEMP% on Windows)
- Config always in `~/.md2slides/config.json` (home directory via `os.homedir()`)
- Skill installed to `.copilot/skills/presentation-skill/` relative to cwd

**GitHub API Integration:**
- Direct HTTPS (no external npm deps beyond tar, chalk, commander, ora)
- Graceful error handling: network errors → helpful messages (check internet connection)
- Version parsing: simple semver comparison (split by '.', compare integers)
- Offline mode: doctor command doesn't crash if GitHub unreachable; marks as "unknown (offline)"

**Error Handling Pattern:**
- Try/catch blocks with specific error classification (ENOENT, EACCES, HTTP status codes)
- logger module uses chalk for colored output (✓, ✖, ⚠, ℹ symbols)
- Exit code 1 on failure (following standard Unix conventions)
- Config initialization happens on-demand; creates ~/.md2slides if missing

**Atomic Updates:**
- Before overwriting: backup existing installation with timestamp (skillDir.backup.{timestamp})
- On download/extract failure: restores from backup automatically
- Cleanup: removes temp extraction directory always (finally block)
- Config updated AFTER successful installation (no partial state)

**Dependencies Added:**
- `tar@^7.0.0` for extracting .tar.gz archives (native Node.js doesn't include tar utilities)
- All others (chalk, commander, ora) already present in cli/package.json

### Testing Notes
- `npm start -- init` successfully queries GitHub API and reports version 1.0.0
- Error handling works: 404 on download properly caught and reported
- `npm start -- doctor` correctly identifies missing installation and suggests fix
- `npm start -- version` shows CLI v1.0.0, correctly notes skill not installed
- Config file created automatically in ~/.md2slides/config.json on first read

### Known Limitations (Expected for v1)
- No `--rollback` option (can restore manually from backup dirs)
- No automatic update checks on every command (runs only when explicitly requested)
- No progress bar during large downloads (ora spinner available but not integrated yet)
- GitHub API rate limiting not handled (relies on default 60 req/hour for unauthenticated)

## Session: npm Docs Update (2026-04-22)

### Documentation changes applied
- Updated `README.md` to recommend `npm install md-to-slides` for package consumption while keeping direct GitHub skill installation instructions for portable `.copilot/skills/` setups.
- Updated `docs/quickstart.md` to distinguish npm package usage from repo-root local development workflow.
- Updated `docs/publishing.md` to reflect that `md-to-slides` is already published on npm and that GitHub remains the source of truth.
- Updated `skill/README.md` so the shipped package documentation uses the locked npm package name.

### Learnings
- The cleanest published-package story is package consumption via `node_modules/md-to-slides/` paths, while direct GitHub install guidance still serves portable skill-folder installs.
- Local development docs should stay repo-root oriented even after publication; release docs should explain how npm consumption and repo development differ.

## Cross-Team Update (2026-04-22T16:05:10Z)

**Task:** Scribe merged docs-update decisions from Basher and Linus into canonical decisions.md.

**Context Propagated:**
- Both Basher (doc audit) and Linus (doc update) decisions folded into Decision #11: Post-Publish Documentation Alignment
- Inbox entries deduplicated: both focused on npm-first narrative while preserving GitHub-source guidance
- All docs now tell consistent post-publish story
- `.squad/decisions/inbox/` cleared; merged entries consolidated

**Status:** Documentation coordination complete; team aligned on published-package messaging.

## Session: README Screenshot Refresh (2026-04-22)

### Visual issue fixed
- The README preview was capturing the minimal deck's title slide, which is intentionally left-weighted and looked off-balance as a standalone screenshot.
- The deck theme was fine; the marketing preview was the wrong slide to freeze.

### Changes applied
- Updated `scripts/capture-screenshots.js` so example screenshots can target a specific preview slide.
- Set `minimal-talk` to capture slide 2, which shows the balanced split-layout instead of the sparse title slide.
- Corrected the workshop screenshot source directory mapping from `workshop` to `workshop-tutorial`.

### Learnings
- README/gallery screenshots should use representative slides, not blindly default to slide 1.
- Title slides can be intentionally asymmetric for presentation rhythm and still be poor preview-card assets.

