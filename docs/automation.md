# Automation & Workflows

## GitHub Actions

The main README no longer carries workflow detail. This page is the place for automation and CI notes.

### Deck Builder workflow

The repository includes `.github/workflows/deck-builder.yml`.

That workflow:

- triggers on Markdown changes in pushes and pull requests
- checks out the repository
- sets up Node.js
- installs the portable skill files into `.copilot/skills/presentation-skill/`
- detects Markdown files that may need deck generation
- validates any generated `slides.html` files it finds
- can commit generated decks on pushes to `main`
- can comment on pull requests with deck links

It is a template for automation around agent-driven deck generation, not a replacement for the skill contract itself.

### Squad state sync

The repository also includes `.github/workflows/auto-sync.yml`.

It:

- runs every 6 hours
- checks for uncommitted changes in `.squad/`
- commits and pushes if needed
- skips silently if nothing changed

## Screenshot generation

Preview screenshots for README and documentation are generated with Puppeteer.

### Running Locally
```bash
npm run screenshots
```

This captures the configured preview slide for each example deck at 1920x1080 resolution and saves to `docs/screenshots/`.

### When to Regenerate
- After adding new example decks
- After updating example deck content or styling
- Before publishing README updates

## Benefits

**GitHub Actions:**
- Keeps deck automation details out of the main onboarding path
- Makes CI behavior discoverable in one place
- Separates agent workflow guidance from install guidance

**Screenshot automation:**
- Consistent preview quality
- Easy to update when examples change
- Automated via npm scripts

**Squad state sync:**
- No lost work from forgotten commits
- Automatic backup of session state
- Clean commit history with `[skip ci]` flag
