# Screenshots Directory

This directory contains preview images of example decks for the README and documentation.

## Generating Screenshots

To capture screenshots of all example decks:

```bash
npm run screenshots
```

This runs `scripts/capture-screenshots.js` which:
- Uses Puppeteer to render each `examples/*/slides.html` in a headless browser
- Captures the first slide at 1920x1080 resolution
- Saves as `{example-name}-preview.png`

## Current Screenshots

- `minimal-talk-preview.png` - Minimal Talk example deck
- Additional screenshots will be added as new example decks are created

## Screenshot Specifications

- **Resolution**: 1920x1080 (Full HD)
- **Format**: PNG
- **Content**: First slide only
- **Usage**: README preview section, documentation

## Manual Capture

If the script fails, you can manually capture screenshots:
1. Open `examples/{example}/slides.html` in a browser
2. Press F11 for fullscreen (optional)
3. Use browser dev tools to set viewport to 1920x1080
4. Take a screenshot of the first slide
5. Save as `{example-name}-preview.png` in this directory
