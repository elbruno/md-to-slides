# Project Context

- **Owner:** Bruno Capuano
- **Project:** Reusable presentation skill for GitHub Copilot and Claude Code
- **Stack:** Markdown/YAML instructions, HTML/CSS/JavaScript, Reveal.js-style slides, GitHub publishing
- **Created:** 2026-04-21T08:34:14-04:00

## Learnings

- The first milestone is a focused skill that outputs a polished HTML deck from a talk brief.
- Reference repos show two useful patterns: a real Reveal.js deck and session packaging that always includes `slides.html`.
- **CLI Architecture (2026-04-22):**
  - **Framework:** `commander.js` v12+ chosen over oclif (lightweight, proven, no vendor lock-in)
  - **Commands:** Modular structure (init, update, doctor, --version) in separate files; shared libs for paths/validation
  - **Config:** Home directory (~/.md2slides/config.json) for persistence; per-installation version tracking
  - **Cross-Platform:** Centralized path logic with Windows long-path support; uses `path.join()` not string concat
  - **Error Handling:** Three-level logging (error/warn/info), user-friendly messages, atomic updates with rollback
  - **Version Pinning:** Git tags from GitHub API; default latest; optional specific version; config stores installed version
  - **Key Pattern:** Backup-before-update ensures no data loss; doctor command detects corruption
  - **Future Enhancements:** Deferred to Phase 2 (generate, serve commands)
- **npm Publishing & 2FA (2026-04-21):**
  - npm@latest uses browser-based OAuth flow for login (more secure, but requires manual browser interaction)
  - 2FA required for publish on accounts with security policies; legacy .npmrc tokens may not have publish bypass
  - Dry-run validation passes but actual publish blocked until 2FA verified
  - Two paths to resolve: (1) Complete browser 2FA via `npm login`, or (2) Create automation token with 2FA bypass
  - Package ready: 7.0 kB tarball, 15 files, clean structure; version 1.2.0 not yet on registry
- **npm Publish Prep Applied (2026-04-21 15:56:34 UTC):**
  - ✅ Package name `md-to-slides` verified available on npm registry (unscoped, cleaner, better discoverability)
  - ✅ Removed `"private": true` flag — publishing unblocked
  - ✅ Added `files` allowlist (9 entries: skill/, templates/, examples/, scripts/, docs/, install scripts, README, LICENSE)
  - ✅ Added `prepublishOnly: "npm test"` safety hook
  - ✅ Added `engines: {node: ">=18"}` floor constraint
  - ✅ Verified: npm pack --dry-run (27 files, 619 kB, zero file leakage), npm test (11/11 passed)
  - **Status:** Package ready for Bruno to run `npm publish` immediately

## Team Status (2026-04-21 08:51)

### Squad Spawned & Planning Complete ✅
- **Scope Locked:** First release focused on skill contract, HTML generation, basic theming, speaker notes
- **5 Phases Sequenced:** Contract → Primitives → Generator → Packaging → Acceptance
- **Team Assignments:** Rusty (Phase 1+3), Linus (Phase 2), Basher (Phase 4), Livingston (Phase 5)
- **Repo Name Shortlist:** `copilot-presentation-skill` (recommended) or `slide-architect`

### Decisions Finalized
1. ✅ First-Release Scope (Danny) — 5 phases, clear ownership, dependencies mapped
2. ✅ Skill Contract (Rusty) — Input modes, output format, portability strategy
3. ✅ Deck Primitives (Linus) — Reveal.js, 6 slide types, theme system
4. ✅ Acceptance Criteria (Livingston) — Criteria, failure modes, test strategy

### Handoff Checklist Status
- [x] Danny: Locked scope, created first-release decision, phase plan
- [x] Rusty: Defined skill contract, portability strategy, examples matrix
- [x] Linus: Extracted deck architecture, theme tokens, slide primitives
- [x] Livingston: Defined acceptance criteria, test strategy, failure modes
- [x] Danny: Design review complete — implementation interfaces locked

### Design Review Complete (2026-04-21)
- ✅ Minimal repo structure defined (flat, 4 top-level dirs)
- ✅ File ownership assigned: Rusty (skill/), Linus (templates/), Basher (docs/, examples/, README)
- ✅ v1 contract: YAML front matter + Markdown slides → self-contained HTML
- ✅ No severe blockers — work may proceed
- ✅ Repository name: `copilot-presentation-skill` (clear scope)
- **Next:** Rusty creates `skill/SKILL.md` + 3 example inputs
