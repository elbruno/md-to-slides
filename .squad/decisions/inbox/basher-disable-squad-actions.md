# Decision: remove squad automation workflows from active GitHub Actions

- **Date:** 2026-04-22
- **Owner:** Basher
- **Context:** Bruno asked to cut GitHub Actions minute usage because squad workflows are barely used and were consuming the monthly budget.

## Decision

Keep only `.github/workflows/deck-builder.yml` active in this repository and remove the squad automation workflows from `.github/workflows/`.

Removed workflows:

- `auto-sync.yml`
- `squad-heartbeat.yml`
- `squad-issue-assign.yml`
- `squad-triage.yml`
- `sync-squad-labels.yml`

## Why

- The removed workflows exist to support `.squad/` issue routing, label sync, heartbeat polling, and state backup rather than the repo's normal markdown-to-deck user flow.
- Several of them run on schedules or label activity, which burns minutes even when nobody is relying on squad automation.
- A simple repo state is easier to understand: one workflow remains, and it maps directly to the product's deck-generation story.

## Follow-up

- If squad automation becomes necessary again, reintroduce it intentionally behind a separate opt-in package or template rather than keeping it always-on in the main repo.
