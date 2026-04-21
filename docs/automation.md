# Automation & Workflows

## Screenshot Generation

Preview screenshots for README and documentation are auto-generated using Puppeteer.

### Running Locally
```bash
npm run screenshots
```

This captures the first slide of each example deck at 1920x1080 resolution and saves to `docs/screenshots/`.

### When to Regenerate
- After adding new example decks
- After updating example deck content or styling
- Before publishing README updates

## Auto-sync Workflow

The repository includes a GitHub Actions workflow (`.github/workflows/auto-sync.yml`) that automatically syncs squad state.

### What It Does
- Runs every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)
- Checks for uncommitted changes in `.squad/` directory
- Auto-commits and pushes if changes exist
- Skips silently if no changes

### Purpose
Keeps team decisions, session logs, and squad workspace state backed up to GitHub without manual intervention.

### Manual Trigger
The workflow can also be triggered manually via GitHub Actions UI using the "workflow_dispatch" event.

## Benefits

**Screenshot Automation:**
- Consistent preview quality
- Easy to update when examples change
- Automated via npm scripts

**Squad State Sync:**
- No lost work from forgotten commits
- Automatic backup of session state
- Clean commit history with `[skip ci]` flag
