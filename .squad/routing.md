# Work Routing

How to decide who handles what.

## Routing Table

| Work Type | Route To | Examples |
|-----------|----------|----------|
| Skill architecture | Rusty | Define skill contract, prompt structure, portability across GitHub Copilot and Claude Code |
| HTML slide system | Linus | Build deck template, theme primitives, speaker notes, slide sections |
| Integration & packaging | Basher | Repo layout, sample inputs, examples, publishing readiness, tooling glue |
| Testing | Livingston | Acceptance criteria, regression scenarios, rendering checks, edge cases |
| Code review | Danny | Review changes, guard scope, reject weak designs, keep work cohesive |
| Scope & priorities | Danny | Roadmap, trade-offs, milestone order, repo naming and publish strategy |
| Session logging | Scribe | Automatic — never needs routing |

## Issue Routing

| Label | Action | Who |
|-------|--------|-----|
| `squad` | Triage: analyze issue, assign `squad:{member}` label | Danny |
| `squad:danny` | Own leadership, architecture, and review items | Danny |
| `squad:rusty` | Own skill design and prompt contract items | Rusty |
| `squad:linus` | Own deck generation, theme, and layout items | Linus |
| `squad:basher` | Own packaging, examples, and integration items | Basher |
| `squad:livingston` | Own test strategy and validation items | Livingston |

### How Issue Assignment Works

1. When a GitHub issue gets the `squad` label, the **Lead** triages it — analyzing content, assigning the right `squad:{member}` label, and commenting with triage notes.
2. When a `squad:{member}` label is applied, that member picks up the issue in their next session.
3. Members can reassign by removing their label and adding another member's label.
4. The `squad` label is the "inbox" — untriaged issues waiting for Lead review.

## Rules

1. **Eager by default** — spawn all agents who could usefully start work, including anticipatory downstream work.
2. **Scribe always runs** after substantial work, always as `mode: "background"`. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn an agent for "what port does the server run on?"
4. **When two agents could handle it**, pick the one whose domain is the primary concern.
5. **"Team, ..." → fan-out.** Spawn all relevant agents in parallel as `mode: "background"`.
6. **Anticipate downstream work.** If a feature is being built, spawn the tester to write test cases from requirements simultaneously.
7. **Issue-labeled work** — when a `squad:{member}` label is applied to an issue, route to that member. The Lead handles all `squad` (base label) triage.
8. **Cross-client behavior is explicit.** Any change that affects GitHub Copilot and Claude Code behavior must be reviewed by Rusty and Danny.
9. **Deck UX ships with validation.** Any slide-generation change should route Livingston in parallel.
