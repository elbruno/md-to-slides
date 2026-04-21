# Squad Decisions

## Active Decisions

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

### 12. Root Package CLI Shim via bin/ (Basher, 2026-04-22)

**Status:** ✅ Proposed
**Decision:** Expose `md2slides` from the published root `md-to-slides` package by adding a root-level `bin` shim that delegates to the existing CLI implementation under `cli/src/`.

**Rationale:**
- Reuses existing CLI instead of creating a second implementation
- Keeps root package focused on skill assets, docs, and packaging metadata
- Limits publish risk by shipping only needed CLI runtime files and dependencies

**Packaging Impact:**
- Root package publishes `bin/`, `cli/src/`, and `cli/package.json`
- Root package owns runtime dependencies required by delegated CLI
- CLI version/config metadata resolves from invoking package

**Note:** `md2slides` binary available via npm resolution for root package. Local invoke: `npx md2slides ...` recommended unless environment exposes npm bins on PATH.

---

### 13. README Installation Hierarchy (Basher, Linus, 2026-04-22)

**Status:** ✅ Implemented
**Decision:** Keep `npm install md-to-slides` as primary first-run path in `README.md`. Move portable skill-folder installers, one-liners, and manual clone flows under `Installation (Advanced)` as optional setup.

**Rationale:**
- New users on GitHub see published package first (decision #11 alignment)
- Portable `.copilot/skills/` setup remains supported but not dominant
- npm is simplest consumption path for existing projects
- Advanced workflows preserved in dedicated docs without cluttering README

**Result:**
- `README.md` — npm-first quick start (2-step: install + init)
- `docs/install-options.md` — portable, script, archive, and manual paths (future reference)
- `docs/architecture-overview.md` — technical architecture details moved from README
- `docs/repository-structure.md` — repository layout reference
- `docs/testing.md` — root validation and CLI workspace testing
- `docs/automation.md` — GitHub Actions detail moved from README

---

### 14. Screenshot & Visual Defaults (Linus, 2026-04-22)

**Status:** ✅ Implemented
**Decision:** 
1. Support choosing representative preview slide per example (not always slide 1)
2. Center title-slide content by default; keep content-slide headings left-aligned

**Rationale:**
- Title slides are intentionally asymmetric; look awkward as static thumbnails
- Slide 2 of `minimal-talk` better represents the visual style when static
- Title-slide centering improves balance without affecting content slides
- Low-risk CSS change improves all generated decks and README screenshots

**Changes Applied:**
- `minimal-talk` captures slide 2 for preview (not slide 1)
- `.title-slide` CSS centered in `templates/theme.css`
- `npm test` ✅ All tests pass
- `npm run screenshots` ✅ All previews regenerated successfully

---

### 15. README Getting Started Duplicate Removed (Linus, 2026-04-22)

**Status:** ✅ Completed
**Decision:** Remove duplicate `npm install md-to-slides` command from README Getting Started step 2 code block.

**Problem:**
- Step 1: "Run `npm install md-to-slides`"
- Step 2 code block incorrectly showed the install again before `npx md2slides init`
- Created confusion about the two-step workflow

**Solution:**
- Step 2 now shows only: `npx md2slides init`
- Maintains npm-first onboarding pattern
- Preserves existing wording and flow
- Keeps README concise

**Verification:** ✅ Pushed to origin/main; GitHub README verified (2026-04-22)

---

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

---

### 11. Post-Publish Documentation Alignment (Basher & Linus, 2026-04-22)

**Status:** ✅ Merged from inbox (deduplicated)  
**Decision:** Now that `md-to-slides@1.0.0` is published on npm, repository docs should align with published-package-first narrative while preserving GitHub-source install guidance.

**Key Points:**
- npm registry is now the source of truth for package availability and current version
- Repository docs previously mixed pre-publish narrative with repo-download install commands
- The mismatch made the repo appear unreleased even though package is live

**Required Actions (Completed by Linus):**
1. ✅ Rewrite `docs/publishing.md` from future-state guidance to current distribution/status guidance
2. ✅ Update `README.md` to mention the published npm package explicitly and clarify when to use npm vs. repo install scripts
3. ✅ Update `docs/quickstart.md` so it no longer points to stale pre-release messaging
4. ✅ Reconcile install-script messaging (`install.sh`, `install.ps1`) with the chosen canonical install path
5. ✅ Update `skill/README.md` to reflect locked npm package name in shipped package

**Decision Details:**
- Repository documentation treats `npm install md-to-slides` as the **default** way to consume the package in an existing project
- Direct GitHub install instructions remain for users who specifically want to materialize `.copilot/skills/presentation-skill/` (portable skill-folder setups)
- npm is the simplest install path for users who want the contract, templates, examples, and docs inside an existing repo
- Local development workflow still starts from the repository root and remains documented separately
- Publishing docs now describe a post-release maintenance state, not a pre-release one

**Files Updated:**
- `README.md` — added npm install guidance as primary path
- `docs/publishing.md` — reframed from pre-release to post-release state
- `docs/quickstart.md` — updated to reflect published package
- `skill/README.md` — ship with locked npm package name
- `install.sh`, `install.ps1` — updated install guidance

**Status:** All docs now tell the same post-publish story; inbox entries deduplicated and merged into this single decision.

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
- Decisions merged from `.squad/decisions/inbox/` weekly; inbox files deduplicated and archived
- Archived decisions (1-6) moved to decisions-archive.md for audit trail and performance

### Archive Information

**Most Recent Archive:** 2026-04-22 (Decisions 1-6 from 2026-04-21)
- Reason: Consolidated foundational architecture decisions
- Location: `.squad/decisions-archive.md`
- Decisions 7-15 retained as active decisions (implementation, CLI, npm publish, docs alignment, visuals)

**Latest Merge:** 2026-04-21T16:58:08Z
- Merged 8 inbox items: basher-cli-package-fix, basher-push-readme-fix, basher-readme-getting-started, linus-install-doc-split, linus-onboarding-fix, linus-readme-fix, linus-screenshot-fix, livingston-title-alignment
- Consolidated into decisions 12-15 (deduplicated related items)
- Inbox now empty
