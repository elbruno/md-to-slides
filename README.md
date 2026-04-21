# md-to-slides

A skill for GitHub Copilot and Claude Code that turns Markdown presentation outlines into self-contained HTML decks.

[![npm package](https://img.shields.io/npm/v/md-to-slides?style=flat-square)](https://www.npmjs.com/package/md-to-slides)
[![npm downloads](https://img.shields.io/npm/dm/md-to-slides?style=flat-square)](https://www.npmjs.com/package/md-to-slides)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/elbruno/md-to-slides?style=flat-square)](https://github.com/elbruno/md-to-slides)

## Getting Started

The package now ships the `md2slides` CLI alongside the skill assets.

- Install the cli tool (only need to do this once)

```bash
npm install md-to-slides
```

- From your project root, install the skill

```bash
md2slides init
```

If you want direct-file usage, portable skill installs, or other setup variants, use the docs linked below instead of the main onboarding path.

## Learn the workflow

- [docs/quickstart.md](docs/quickstart.md) — npm-first quickstart and current CLI status
- [docs/install-options.md](docs/install-options.md) — portable skill-folder, script, archive, and clone-based installs
- [docs/architecture-overview.md](docs/architecture-overview.md) — contract, templates, examples, and portability model
- [docs/repository-structure.md](docs/repository-structure.md) — repository layout and folder ownership
- [docs/testing.md](docs/testing.md) — root validation flow, fixtures, and release checks
- [docs/automation.md](docs/automation.md) — GitHub Actions and screenshot automation
- [docs/publishing.md](docs/publishing.md) — publishing and package status

## Quick Example

```text
Use the presentation skill to create a 5-slide deck about adopting TypeScript.
Title: "Why TypeScript?" Audience: JavaScript developers. Tone: practical.
```

The workflow produces a single `slides.html` file you can open in any browser.

## Visual Examples

| Minimal Talk | Technical Talk |
| --- | --- |
| [![Minimal Talk Preview](docs/screenshots/minimal-talk-preview.png)](examples/minimal-talk/slides.html)<br>Clean starter deck. [Open →](examples/minimal-talk/slides.html) | [![Technical Talk Preview](docs/screenshots/technical-talk-preview.png)](examples/technical-talk/slides.html)<br>Code-heavy engineering presentation. [Open →](examples/technical-talk/slides.html) |

| Executive Pitch | Workshop Tutorial |
| --- | --- |
| [![Executive Pitch Preview](docs/screenshots/executive-pitch-preview.png)](examples/executive-pitch/slides.html)<br>Concise business-facing narrative. [Open →](examples/executive-pitch/slides.html) | [![Workshop Tutorial Preview](docs/screenshots/workshop-preview.png)](examples/workshop-tutorial/slides.html)<br>Hands-on teaching flow with guided steps. [Open →](examples/workshop-tutorial/slides.html) |

## Contributing

Contributions welcome. Start with [docs/repository-structure.md](docs/repository-structure.md) and [docs/testing.md](docs/testing.md).

## License

MIT License. See [LICENSE](LICENSE) for full text.

Copyright (c) Bruno Capuano & Contributors
