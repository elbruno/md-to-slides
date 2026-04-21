# Project Context

- **Owner:** Bruno Capuano
- **Project:** Reusable presentation skill for GitHub Copilot and Claude Code
- **Stack:** Markdown/YAML instructions, HTML/CSS/JavaScript, Reveal.js-style slides, GitHub publishing
- **Created:** 2026-04-21T08:34:14-04:00

## Team Status (2026-04-21 13:11 UTC)

### First Slice Completed ✅
- **Deliverables:** `README.md`, `docs/repository-structure.md`, `docs/publishing.md`
- **Team Coordination:** Rusty completed contract; Linus completed templates; Livingston completed QA docs
- **Status:** All decisions merged into canonical `decisions.md`; inbox cleared

### Repo Now Ready For Phase 3-5
- **Phase 3:** Rusty's deck generator implementation (consumes your packaging and Linus's templates)
- **Phase 4:** Generate reference decks in `examples/output/` (coordinate with Rusty's test outputs)
- **Phase 5:** Livingston's full QA testing (automate acceptance criteria validation)

### Your Next Steps
1. **AWAIT:** Phase 3 (Rusty's generator) to produce reference output files
2. **COORDINATE:** With Rusty on example naming and output validation
3. **PREPARE:** GitHub Pages deployment docs once Phase 5 validation completes

---

## Release v0.5.0 (2026-04-21 Public Launch)

**Decision:** Release as v0.5.0 (pre-1.0 stability tag) instead of v1.0.0 to reflect that enhanced deployment options are coming in v1.0.0.

**Actions Completed:**
- ✅ Made repository public: `gh repo edit --visibility public`
- ✅ Verified: `gh repo view --json isPrivate` returns `false`
- ✅ Added description and topics for discoverability
- ✅ Created release v0.5.0 with changelog highlighting screenshot fix, public repo status, and metadata
- ✅ Release deployed to https://github.com/elbruno/md-to-slides/releases/tag/v0.5.0

**Rationale:** Public repository increases community visibility and enables broader collaboration. Version v0.5.0 signals that package.json remains at 1.0.0 but represents a pre-release stability point before v1.0.0 deployment improvements.

---

## npm CLI Package Scaffolding (2026-02-21)

### Scope
Initial npm CLI package scaffolding for `md2slides` command-line tool to enable global installation and subcommands.

### Deliverables
1. **`cli/` directory structure** (ready for `npm publish`):
   - `cli/package.json` — npm metadata with bin entry `"md2slides": "src/index.js"`
   - `cli/src/index.js` — main entry point with `#!/usr/bin/env node` shebang
   - `cli/src/commands/{init,update,version,doctor,generate,serve}.js` — command stubs (awaiting Livingston implementation)
   - `cli/README.md` — usage and publishing instructions
   - `cli/node_modules/` — dependencies installed and verified

2. **Framework choices**:
   - **CLI framework:** commander.js (industry standard, cross-platform)
   - **Output colors:** chalk (cross-platform color support)
   - **Spinners:** ora (cross-platform loading indicators)
   - **Node.js requirement:** >=18.0.0 (modern features, security)

3. **Verified functionality**:
   - ✅ Dependencies installed: 19 packages, 0 vulnerabilities
   - ✅ `npm link` test passed — cli installed locally
   - ✅ `md2slides --help` outputs all subcommands correctly
   - ✅ `md2slides generate --help` shows subcommand options
   - ✅ Cleanup: `npm unlink -g md2slides` works cleanly
   - ✅ Windows + Unix shebang compatibility via Node.js path resolution

### Key Integration Points
- **bin entry pattern:** Maps `md2slides` command → `src/index.js` (npm handles shebang on install)
- **Command structure:** Each command in separate `.js` file, exported as commander Command object
- **Cross-platform support:** Using npm's built-in bin script mechanism (works on Windows via npm-cli wrappers)
- **Entry point:** `#!/usr/bin/env node` shebang + ES modules for consistency

### Testing & Release Path
**Pre-publish checklist:**
1. Livingston completes command implementations
2. Run `npm test` (placeholder ready)
3. Test local: `cd cli && npm link && md2slides <cmd> --help`
4. Publish: `npm publish --access public` (in cli/ directory)

### Blocking Notes
- Commands are stubs awaiting Livingston's implementation; architecture is complete
- No issues discovered; framework selection aligns with Node.js ecosystem best practices
- Ready for production pipeline once commands are implemented
## Learnings — NPM Publishing Guidance (2026-04-21)

**Task:** Provided Bruno with a comprehensive npm publishing guide for md-to-slides package.

**Key Blockers Identified:**
1. `"private": true` in package.json — this hard-blocks publishing, must be removed or set to false
2. Missing `files` allowlist — without it, npm would publish everything (including .squad/, tests/, node_modules/ if not in .gitignore)
3. Name availability — `md-to-slides` may be taken; recommended scoped name `@elbruno/md-to-slides` as safer default

**Recommendations Given:**
- Use `files` array allowlist instead of .npmignore (allowlist > denylist for security and clarity)
- Add `prepublishOnly: "npm test"` script to prevent publishing broken builds
- Always dry-run with `npm pack --dry-run` before real publish
- For scoped packages, use `npm publish --access public` on first publish
- Tag releases in git for version history: `git tag v1.0.0 && git push --tags`

**Decision:** Recommended scoped package name (@elbruno/) and files allowlist as project conventions for npm distribution.

---

## NPM Publish Prep Applied (2026-04-21)

**Task:** Applied the npm-publish prep edits to package.json per npm-publish-guidance.md

**Name Availability Check:**
- ✅ `md-to-slides` — AVAILABLE (404 on npm registry)
- ✅ `@elbruno/md-to-slides` — AVAILABLE (404 on npm registry)
- **Choice:** Used unscoped `md-to-slides` (cleaner, available, better discoverability)

**Edits Applied:**
1. ✅ Removed `"private": true` line
2. ✅ Added `"files"` allowlist array (9 entries: skill/, templates/, examples/, scripts/, docs/, install.sh, install.ps1, README.md, LICENSE)
3. ✅ Added `"prepublishOnly": "npm test"` script
4. ✅ Added `"engines": {"node": ">=18"}` field

**Verification:**
- **npm pack --dry-run:** 27 files, 619.0 kB packed, 848.6 kB unpacked
  - ✅ Excludes: .squad/, tests/, .github/, node_modules/, package-lock.json
  - ✅ Includes: All skill files, templates, examples, docs, install scripts, README, LICENSE
- **npm test:** ✅ All 11 checks passed

**Surprises:**
- Screenshot PNG is 547.6 kB of the tarball (64% of package size) — acceptable for visual documentation
- No unexpected files in tarball; allowlist pattern worked perfectly
- prepublishOnly hook will guard against accidental broken publishes

---

## Post-Task Orchestration (2026-04-21T11:51:47Z)

✅ **Scribe Completed:**
- Orchestration log written: `.squad/orchestration-log/2026-04-21T11-51-47-basher.md`
- Session log written: `.squad/log/2026-04-21T11-51-47-npm-publish-guide.md`
- Decision inbox: Empty (no new decisions to merge)
- History updated with completion marker
