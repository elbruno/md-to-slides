# Project Context

- **Owner:** Bruno Capuano
- **Project:** Reusable presentation skill for GitHub Copilot and Claude Code
- **Stack:** Markdown/YAML instructions, HTML/CSS/JavaScript, Reveal.js-style slides, GitHub publishing
- **Created:** 2026-04-21T08:34:14-04:00

## Core Context

(Summarized from 2026-04-21 sessions: Deck Primitives, Slide Centering, Npm Publish Prep)

- **Framework:** Reveal.js 5.2.0; Slide types: Title, Section Divider, Content, Code, Demo Transition, Two-Column
- **Theme:** CSS custom properties with light/dark toggle; 38px base typography
- **Output:** Single self-contained HTML with inline CSS/JS, base64 assets
- **npm Status:** ✅ Published as `md-to-slides@1.0.0`; templates included; all tests passing
- **Deliverables:** `templates/reveal-base.html`, `templates/theme.css`, `examples/` gallery with 4 decks
- **Team Coordination:** Rusty (contract), Basher (packaging), Livingston (QA), Danny (scope) all locked
- **Reference:** `C:\src\260418-globalazurespain-plan\slides\keynote\slides.html` is Reveal.js-style baseline

Key fixes from early sessions:
- ✅ Slide centering: Added `justify-content: center; align-items: center` to `.reveal .slides > section`
- ✅ Publish prep: Allowlisted 9 key files/folders; excluded .squad/, tests/, .github/

## Current Phase: Documentation & README Alignment (2026-04-22)

### Session: CLI Implementation (2026-04-22)

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
- Widened the title-slide hero block in `templates/theme.css` and the checked-in example decks so opening slides do not collapse into an overly narrow left rail.
- Corrected the workshop screenshot source directory mapping from `workshop` to `workshop-tutorial`.

### Learnings
- README/gallery screenshots should use representative slides, not blindly default to slide 1.
- Title slides can be intentionally asymmetric for presentation rhythm and still be poor preview-card assets.

## Session: Install Docs Split (2026-04-22)

### Documentation changes applied
- Simplified `README.md` so the main getting-started path stays npm-first and only shows `npm install md-to-slides`.
- Moved portable skill-folder, installer-script, archive, and clone-based install guidance into `docs/install-options.md`.
- Added a direct README link to the new install-options page so advanced users can still find non-npm paths quickly.

### Learnings
- README install sections stay cleaner when secondary distribution paths live in a dedicated docs page instead of competing with the default npm flow.
- Post-publish docs should treat portable `.copilot/skills/` setup as an advanced option, not a co-equal primary entry point.

## Session: README Visual Examples Alignment (2026-04-22)

### Documentation changes applied
- Replaced the stale README "Coming Soon" placeholder in the Visual Examples section with live preview cards for minimal, technical, executive, and workshop example decks.
- Kept the update confined to the README gallery area so the simplified Getting Started flow stayed untouched.
- Pointed each screenshot directly at its checked-in `examples/*/slides.html` deck for GitHub-friendly scanning.

### Learnings
- README example galleries read better on GitHub when all available decks appear as compact linked preview cards instead of mixed prose and placeholders.
- Visual-example copy should mirror the checked-in screenshot set exactly so docs do not lag behind regenerated assets.

## Session: README Getting Started Fix (2026-04-21T12:52:03Z)

### Issue Fixed
- **Problem:** Getting Started section had duplicate `npm install md-to-slides` in step 2
- **Solution:** Removed duplicate line from step 2 code block
- **Result:** Flow is now clean and linear:
  1. `npm install md-to-slides`
  2. `npx md2slides init`

### Learnings
- Getting Started flows benefit from clear step separation; duplication creates confusion about whether to re-run installation.

