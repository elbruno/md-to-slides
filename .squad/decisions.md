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

## CLI Implementation Phase — npm + Commander.js (v1)

**Status:** ✅ Locked  
**Date:** 2026-04-22  
**Team:** Danny (Architecture), Basher (Packaging), Livingston (Testing)

### Framework Choice

**Decision:** Use **Commander.js v12+** for CLI framework.

**Rationale:**
- Lightweight, battle-tested (Vite, Create React App, Prettier)
- Explicit command structure (not middleware-based)
- Built-in help, version tracking, subcommand support
- ~7KB minified bundle
- No framework lock-in

**Alternatives Evaluated:**
- ✅ `commander` — Chosen
- ❌ `yargs` — Too config-heavy
- ❌ `oclif` — Overengineered for current scope

### Config Strategy

**Configuration Locations:**
1. **Primary:** `~/.md2slides/config.json` (user home, portable, version tracking)
2. **Secondary:** `package.json` field (`md2slides` key) for project-level overrides
3. **Per-Installation:** Version metadata stored in config for auditing

**Config Schema:**
```json
{
  "version": "1.0.0",
  "lastCheck": "2026-04-22T10:00:00Z",
  "installations": {
    ".copilot/skills/presentation-skill": {
      "installedVersion": "1.0.0",
      "installedAt": "2026-04-22T09:00:00Z",
      "source": "npm"
    }
  },
  "preferences": {
    "checkUpdates": true,
    "autoBackup": true,
    "logLevel": "info"
  }
}
```

**Rationale:**
- Home directory config survives reinstalls
- Per-installation tracking enables safe updates
- No global npm config pollution

### Command Specifications

**v1 Core Commands (5 required + 1 future):**

#### 1. `md2slides init [--version <v>] [--force]`
- Downloads skill from GitHub releases
- Extracts to `.copilot/skills/presentation-skill/`
- Validates all required files present
- Stores version + timestamp in config
- Exit code 0 (success) or 1 (failure)

**Validations:**
- Network connectivity
- Download integrity (SHA256)
- Required files: `skill/contract.md`, `templates/reveal-base.html`, `templates/theme.css`, `examples/`
- Detects existing install (asks before overwrite unless `--force`)

#### 2. `md2slides update [--version <v>] [--backup=<path>] [--rollback]`
- Checks latest available version from GitHub
- Compares against installed version
- Creates backup of current install
- Downloads new version
- Validates new install
- Restores backup automatically on failure

**Atomicity:** Backup-before-update ensures no data loss

#### 3. `md2slides doctor [--fix] [--verbose] [--json]`
- Validates installation exists
- Validates file structure (tree depth, required files)
- Checks file permissions (readable)
- Checks installed version against config
- Reports health status
- With `--fix`: Attempts repairs (re-download if corrupted)

**Output Example:**
```
✅ Installation found at .copilot/skills/presentation-skill
✅ Version: 1.0.0 (up to date)
✅ All required files present (15/15)
✅ File permissions OK
✅ Config synchronized
Health: GOOD
```

#### 4. `md2slides --version / -v`
- Shows installed version
- With `--check-update`: Also checks if newer version available

**Output:** `md2slides/1.0.0 (installed: 1.0.0, latest: 1.0.0)`

#### 5. `md2slides generate <file.md> [--output <path>] [--validate-only]` (BONUS)
- Runs local markdown → HTML using bundled generator
- Useful for testing without GitHub Copilot
- Deferred to Phase 2 (after core CLI stabilizes)

#### 6. `md2slides serve [--port 3000] [--watch] [--no-open]` (BONUS)
- Starts local dev server
- Watches markdown changes, regenerates HTML
- Opens browser preview automatically
- Deferred to Phase 2

### Project Structure

```
bin/
  cli.js                    # Entry point (shebang + require)

src/
  index.js                  # Parse args, load commands
  commands/
    init.js                 # Install skill
    update.js               # Update skill
    doctor.js               # Validate installation
  lib/
    installer.js            # Download, extract, copy
    paths.js                # Cross-platform paths
    validator.js            # File integrity checks
    logger.js               # Logging utilities
    github-api.js           # GitHub releases API wrapper

tests/
  unit/
    commands.test.js        # Command behavior
    installer.test.js       # Download + extract
    paths.test.js           # Path resolution edge cases
    validator.test.js       # Validation rules
  integration/
    e2e.test.js             # Full workflow

package.json
  "bin": { "md2slides": "./bin/cli.js" }
  "dependencies": { "commander": "^12.0.0" }
  "devDependencies": { "jest": "^29.0.0" }
```

### Error Handling

**Log Levels:**
- `error` — Fatal issues (exit code 1)
- `warn` — Recoverable issues (proceed)
- `info` — Normal progress (default)
- `debug` — Verbose troubleshooting (--debug flag)

**Flags:**
- `--quiet` — Suppress all output except errors
- `--verbose` / `--debug` — Show detailed logs

**Error Pattern:**
```javascript
try {
  await installer.download();
} catch (err) {
  if (err.code === 'ENOTFOUND') {
    logger.error('Network error: Could not reach GitHub. Check your internet connection.');
  } else if (err.code === 'EACCES') {
    logger.error(`Permission denied: Cannot write to ${installDir}.`);
  } else {
    logger.error(`Unexpected error: ${err.message}`);
    if (process.env.DEBUG) logger.debug(err.stack);
  }
  process.exit(1);
}
```

### Platform Compatibility

**Cross-Platform Path Handling (src/lib/paths.js):**
- Use `path.join()` (not string concatenation)
- Windows long path support (`\\?\C:\...` prefix for >260 chars)
- Path validation before writes
- No hardcoded forward slashes

**Download Verification:**
- Verify SHA256 hash after download (GitHub provides)
- Save hash in config for offline validation
- Fail-fast if hash mismatch detected

### Version Pinning

**Strategy:**
- Repo uses semantic versioning (v1.0.0, v1.0.1, etc.)
- Default: Install latest release tag from GitHub
- Optional: Pin to specific version via `--version 1.0.0`
- Config file stores installed version for auditing

**Version Checking Logic:**
1. Query GitHub releases API for latest tag
2. Compare against installed version in config
3. If newer, prompt user: "Update available (1.0.0 → 1.0.1). Run 'md2slides update'?"
4. Store installed version in `~/.md2slides/config.json`

### Testing Strategy

**Layered approach:**
- **Unit tests** for command logic and error handling (Jest/Vitest in `cli/test/`)
- **Integration tests** for file I/O and GitHub API interactions (real temp directories)
- **Validation harness** to ensure all commands functional after install
- **Error matrices** documenting fatal vs. warning failures

**Test Coverage:**
| Command | Unit | Integration | E2E | Manual |
|---------|------|-------------|-----|--------|
| `init` | ✓ | ✓ | ✓ | ✓ (permissions) |
| `update` | ✓ | ✓ | ✓ | ✓ (network) |
| `doctor` | ✓ | ✓ | — | — |
| `--version` | ✓ | — | — | — |
| `generate` | ✓ | ✓ | ✓ | ✓ (visual) |
| `serve` | ✓ | ✓ | ✓ | ✓ (browser) |

**Mock Strategy:**
- **GitHub API:** Use `nock` to intercept HTTP calls; mock releases endpoint + raw.githubusercontent
- **File System:** Real temp directories (not memfs) to ensure write permission realism
- **npm Registry:** Mock via nock for version checks

**Exit Codes:**
| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Generic error (validation, permissions) |
| 2 | Network error |
| 3 | File system error (disk full, permission) |
| 4 | Invalid input (file not found, malformed YAML) |
| 5 | Installation error (skill not found, corrupted) |

**Validation Harness (Post-Install):**
```bash
npm run validate:cli
```
Automatically runs:
1. `md2slides --version` — CLI callable
2. `md2slides doctor` — installation healthy
3. `md2slides generate --validate-only <example.md>` — generation works
4. Report: `✓ CLI is ready` or list failures

### Packaging Approach

**Rationale (Basher):**
- Keep root package private and name-neutral for now
- Add root npm scripts that verify checked-in example
- Delegate to `tests/validate-example.mjs` when Livingston's harness present
- Makes repository runnable from root today without premature package naming
- Docs describe one stable root workflow; packaging harness drops in later without changes

**Impact:**
- Contributors have one clear layout to build into
- Public path from GitHub to Copilot ecosystem concrete before code lands
- Baseline repo health (license, gitignore, contributing) ready before Phase 3

### Implementation Roadmap

#### Phase 1: Core CLI (v1.0)
- ✅ `commander` setup + package.json bin
- ✅ `init` command (download, extract, validate)
- ✅ `update` command (version check, backup, replace)
- ✅ `doctor` command (validation + health reporting)
- ✅ `--version` flag
- ✅ Cross-platform path handling
- ✅ Error handling + logging
- ✅ Config file (user home)
- ✅ Tests (happy path + failure modes)

#### Phase 2: Enhancements (v1.1+)
- `generate` command
- `serve` command
- Version update notifications
- Telemetry (opt-in, privacy-first)

#### Phase 3: Marketplace
- Publish to npm
- Submit to GitHub Marketplace (requires CLI)
- Register with Copilot Skills Registry

### Success Criteria (v1.0)

- ✅ CLI installs skill to correct location on Windows/macOS/Linux
- ✅ Update command safely replaces with rollback
- ✅ Doctor command detects corruption, reports actionable errors
- ✅ All commands exit with correct status codes
- ✅ Error messages user-friendly (not stack traces)
- ✅ Installation <30 seconds on typical network
- ✅ No external runtime dependencies for generated skills
- ✅ Config file survives CLI updates
- ✅ >80% automated test coverage
- ✅ All tests pass on Windows/macOS/Linux

### Open Questions

1. **Dependency Management:** Node.js minimum version (12? 16? 18+)?
2. **Packaging:** Standalone executable (pkg/nexe) or npm-only in v1?
3. **Auth:** Support private GitHub repos in future?
4. **Auto-update:** Check for updates on every run or only on-demand?
5. **Telemetry:** Collect install count/version usage (opt-in, privacy-first)?

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Network failure during download | Installation incomplete | Retry logic + clear error + restore backup |
| Disk full during extraction | Partial files written | Check free space before download + clean temp |
| Version mismatch after update | Silently broken skill | Config tracks version + doctor validates |
| PowerShell execution policy | Windows users can't run scripts | Use npm CLI instead of .ps1 |
| Path length >260 chars (Windows) | Extraction fails | Use long path prefix (`\\?\`) for Windows |

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

Full research: .squad/decisions/inbox/danny-installation-ux.md

---

### 10. NPM Publish Prep Applied (Basher, 2026-04-21)

**Status:** ✅ Implemented
**Decision:** Apply npm-publish prep edits to package.json per npm-publish-guidance.md

**Package Name Choice:** `md-to-slides` (unscoped)
- ✅ Verified available on npm registry (404 response confirms not taken)
- Chose unscoped over scoped for: cleaner name, better discoverability, no overhead for public utility package
- Can migrate to scoped (@elbruno/md-to-slides) later if needed

**Edits Applied:**
1. ✅ Removed `"private": true` line — publishing unblocked
2. ✅ Added `"files"` allowlist (9 entries):
   - `skill/`, `templates/`, `examples/`, `scripts/`, `docs/`
   - `install.sh`, `install.ps1`, `README.md`, `LICENSE`
3. ✅ Added `"prepublishOnly": "npm test"` — prevents publishing broken builds
4. ✅ Added `"engines": {"node": ">=18"}` — reflects modern Node.js usage in codebase

**Verification:**
- **npm pack --dry-run:** ✅ 27 files, 619 kB packed, 848.6 kB unpacked
  - Includes: All skill files, templates, examples, docs, install scripts
  - Excludes: .squad/, tests/, .github/, node_modules/, package-lock.json
- **npm test:** ✅ All 11 checks passed
- **Largest file:** docs/screenshots/minimal-talk-preview.png (547.6 kB, 64% of tarball — acceptable for visual docs)

**Team Conventions Established:**
For future npm-publishable packages:
1. Prefer unscoped names when available (smaller, better discoverability)
2. Use `files` array allowlist (not .npmignore) — more secure, clearer
3. Always add `prepublishOnly: "npm test"` — safety hook prevents broken publishes
4. Dry-run with `npm pack --dry-run` before first publish
5. Set explicit `engines` constraints matching actual usage

**Publishing Instructions for Bruno:**
```bash
npm login                 # First time only
npm pack --dry-run       # Verify contents
npm publish              # Publish to npm registry
git tag v1.0.0           # Tag release
git push --tags          # Push tags to GitHub
npm view md-to-slides    # Verify published package
```

**Notes:**
- No `--access public` flag needed (unscoped packages default to public)
- prepublishOnly hook will auto-run `npm test` before publish
- Version 1.0.0 already set in package.json
- Package ready to ship immediately
