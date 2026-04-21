# Project Context

- **Owner:** Bruno Capuano
- **Project:** Reusable presentation skill for GitHub Copilot and Claude Code
- **Stack:** Markdown/YAML instructions, HTML/CSS/JavaScript, Reveal.js-style slides, GitHub publishing
- **Created:** 2026-04-21T08:34:14-04:00

## Learnings

- The skill should likely accept a presentation brief, audience, tone, duration, and optional branding cues.
- A useful first release should emit both guidance and a concrete HTML deck scaffold.

## Team Status (2026-04-21 08:51)

### Skill Contract Finalized ✅
- **Input modes:** Minimal (title), Standard (outline + event), Power (code + CSS)
- **Output:** `slides.html` (primary), `README.md`, optional `speaker-notes.md`
- **Slide types (v1):** Title, Content, Code, Demo Transition, Two-Column, Closing
- **Portability:** Markdown + YAML foundation; env var detection (GitHub Copilot vs Claude Code)
- **Non-negotiable:** Lowest common denominator (no tool-specific APIs)

### Cross-Team Dependencies
- **Danny:** First-release scope locked; Phases 1-5 sequenced; repo name shortlist ready
- **Linus:** Reveal.js chosen; 6 slide types mapped; theme tokens + CSS system prepared
- **Livingston:** Acceptance criteria locked; 30+ failure modes; auto + manual test strategy
- **Basher:** Standby for Phase 4

### First Slice Completed (2026-04-21 13:11 UTC) ✅
- **Deliverables:** `skill/contract.md`, `.copilot/skills/presentation-skill/SKILL.md`, `examples/minimal-talk/input.md`
- **Team Coordination:** Linus completed templates; Basher completed packaging; Livingston completed QA docs
- **Status:** All decisions merged into canonical `decisions.md`; inbox cleared

### Deployment Options Implemented (2026-04-21 per Danny's UX Research) ✅
- **install.sh** (macOS/Linux/WSL): Bash script downloads latest main, extracts to .copilot/skills/presentation-skill/, validates all required files, prints next-steps
- **install.ps1** (Windows): PowerShell equivalent using native cmdlets (Invoke-WebRequest, Expand-Archive, etc.)
- **GitHub Actions Workflow** (.github/workflows/deck-builder.yml): Triggers on PR/push with *.md changes; auto-installs skill; detects markdown files; validates output; commits slides; comments on PR with deck links
- **README Updates**: Added Quick Install section promoting install.sh/.ps1; kept one-liner alternative for advanced users; documented GitHub Actions integration; removed deprecated "npm coming soon" message
- **Key Design Decisions**:
  - Scripts follow v1 phase recommendations from Danny's research (eliminates manual copy/paste)
  - One-liner commands preserved for backward compatibility
  - Workflow template provides foundation for CI/CD without requiring agent invocation in the workflow itself
  - Both scripts include validation gates and user-friendly emoji feedback
  - Supports discovery and adoption per v1 roadmap (SkillHub registration v1.0.x, GitHub Marketplace v2)

### Your Next Steps
1. **Community Engagement:** Consider SkillHub listing (v1.0.x timeline per Danny)
2. **Testing:** Validate install scripts on macOS, Linux, Windows (manual or CI)
3. **Documentation:** Link installation guides from skill marketplace when ready
