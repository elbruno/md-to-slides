# Squad Team

> Presentation skill for GitHub Copilot and Claude Code

## Coordinator

| Name | Role | Notes |
|------|------|-------|
| Squad | Coordinator | Routes work, enforces handoffs, reviewer gates, and cross-agent planning. |

## Members

| Name | Role | Charter | Status |
|------|------|---------|--------|
| Danny | Lead | `.squad/agents/danny/charter.md` | ✅ Active |
| Rusty | Skill Architect | `.squad/agents/rusty/charter.md` | ✅ Active |
| Linus | Presentation Engineer | `.squad/agents/linus/charter.md` | ✅ Active |
| Basher | Integration Engineer | `.squad/agents/basher/charter.md` | ✅ Active |
| Livingston | Tester | `.squad/agents/livingston/charter.md` | ✅ Active |
| Scribe | Session Logger | `.squad/agents/scribe/charter.md` | 📋 Silent |
| Ralph | Work Monitor | — | 🔄 Monitor |

## Coding Agent

<!-- copilot-auto-assign: false -->

| Name | Role | Charter | Status |
|------|------|---------|--------|
| @copilot | Coding Agent | — | 🤖 Coding Agent |

### Capabilities

**🟢 Good fit — auto-route when enabled:**
- Small skill packaging updates
- README and docs refinements
- Boilerplate examples and scaffolding
- Test additions around stable output contracts

**🟡 Needs review — route to @copilot but flag for squad review:**
- Medium prompt/skill updates with explicit acceptance criteria
- Refactors to HTML templates with existing regression coverage

**🔴 Not suitable — route to squad member instead:**
- Architecture decisions for the skill contract
- Cross-client behavior differences between GitHub Copilot and Claude Code
- Visual system changes affecting deck UX or accessibility

## Project Context

- **Owner:** Bruno Capuano
- **Stack:** GitHub Copilot and Claude Code skill instructions, Markdown/YAML, HTML/CSS/JavaScript, Reveal.js-style slide rendering, GitHub publishing
- **Description:** Build a reusable skill that turns presentation goals, outlines, notes, and demo structure into polished HTML slide decks.
- **Created:** 2026-04-21T08:34:14-04:00
