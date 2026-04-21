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

---

## Doc Audit After npm Publish (2026-04-21)

**Task:** Audited repo documentation after npm package publication to identify install/publish messaging that still reflects pre-publish status.

**Registry confirmation:**
- ✅ `md-to-slides@1.0.0` is published on npm
- ✅ npm metadata points back to `https://github.com/elbruno/md-to-slides`

**Key findings:**
1. `README.md` still leads with curl/PowerShell repo-download install flows and never mentions the published npm package.
2. `docs/publishing.md` is fully outdated: it says the repo is "close to a reviewable source release," says naming is undecided, and frames publish status as future work.
3. `docs/quickstart.md` points readers to `docs/publishing.md` for things that "still need to be locked before public distribution," which is no longer true.
4. `install.sh` and `install.ps1` still download the GitHub main branch rather than consuming the published package, so README install guidance is now split between package reality and repo-download scripts.
5. The install scripts validate `SKILL.md`, while current repo-facing docs describe `skill/README.md`; that inconsistency should be reconciled when install docs are updated.

**Recommended handoff:**
- Update public docs to make npm install/distribution status explicit.
- Reframe repo download scripts as source/manual install paths unless team chooses to keep GitHub-source install as the primary user path.
- Merge a docs decision so README, quickstart, and publishing guidance all tell the same post-publish story.

## Cross-Team Update (2026-04-22T16:05:10Z)

**Task:** Scribe merged docs-audit findings into post-publish docs coordination (Decision #11).

**Outcome:**
- Doc audit recommendations handed to Linus; docs updated per your guidance
- Inbox decision (basher-doc-audit.md) merged into consolidated Decision #11
- Your recommendation to align public docs fulfilled: all files now reference npm-first path
- GitHub-source install guidance preserved for portable skill-folder setups

**Status:** Doc alignment complete; team coordination successful.

## README Getting Started Install Hierarchy (2026-04-21)

**Task:** Reworked the public README install story so new users land on the published npm package instead of the older portable-skill installer flow.

**What changed:**
- Kept `npm install md-to-slides` as the primary Getting Started path.
- Replaced the inline portable installer block in Getting Started with a short optional pointer to `Installation (Advanced)`.
- Moved GitHub-hosted installers, one-liners, and manual portable skill-folder clone instructions under an explicit optional advanced section.

**Result:** The GitHub README now reads npm-first for new users while preserving portable skill-folder and local-repo setup guidance for advanced/manual workflows.

## README Duplicate Install Line Fix & Push (2026-04-22T16:30Z)

**Task:** Bruno reported local README was correct but origin/main still served old version with duplicate `npm install md-to-slides` line. Push local commits to update the remote.

**Verification:**
- Local HEAD: `b508d36` (2 commits ahead of origin/main at `9e230e6`)
- Critical fix in `a2616da`: "docs: remove duplicate npm install from README Getting Started"
- Push executed: `git push origin main` → Success (9e230e6..b508d36)
- **origin/main now at:** `b508d36`
- **GitHub README verified:** Shows only `npx md2slides init` in Getting Started step 2—no duplicate line

**Result:** Fix is now live on GitHub. All users pulling from `origin/main` receive the corrected onboarding flow.

## npm Badge Row for README (2026-04-22)

**Task:** Add npm package badges to README near the top for visual status, version, downloads, and link to package page.

**Badges added (README line 5-8):**
1. **Version badge** → links to npm package page
2. **Downloads badge** (monthly) → links to npm package page
3. **License badge** → links to LICENSE file
4. **GitHub stars badge** → links to GitHub repo

**Design decision:** Compact flat-square style, all with direct links to relevant pages. Placed right after description (before Getting Started) to maximize early visibility without cluttering top.

**Verification:**
- ✅ All npm test checks pass (11/11)
- ✅ README renders cleanly with badges above Getting Started
- ✅ Links point to correct endpoints (npmjs.com package page, repo, LICENSE)
- ✅ No build or test regressions

- ✅ Links point to correct endpoints (npmjs.com package page, repo, LICENSE)
- ✅ No build or test regressions

**Result:** README now signals project maturity and package status at a glance. New users see version, popularity metrics, and license immediately.

## Cross-Team Badge Decision Merged (2026-04-22T17:03:26Z)

**Scribe orchestration completed:**
- Badge decision merged from inbox to canonical `decisions.md` (Decision #16)
- Orchestration log written: `.squad/orchestration-log/2026-04-22T17-03-26Z-basher-badges.md`
- Session log written: `.squad/log/2026-04-22T17-03-26Z-badge-update.md`
- Git: `.squad/` changes staged and committed
- Status: All workflows complete; team memory synchronized

