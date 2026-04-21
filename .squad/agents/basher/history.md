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
