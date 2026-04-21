# md-to-slides

A skill for GitHub Copilot and Claude Code that turns Markdown presentation outlines into self-contained HTML decks.

## What It Does

Give an AI agent a presentation brief or outline in Markdown. The skill generates a single `slides.html` file with embedded Reveal.js, ready to open in any browser. No build step, no external dependencies, no vendor lock-in.

## Installation

This skill works with **GitHub Copilot** and **Claude Code**. Both clients support portable skills.

### For GitHub Copilot

1. Clone this repository:
   ```bash
   git clone https://github.com/elbruno/md-to-slides.git
   ```

2. Copy the skill directory into your workspace:
   ```bash
   mkdir -p .copilot/skills/presentation-skill
   cp -r md-to-slides/skill/* .copilot/skills/presentation-skill/
   cp -r md-to-slides/templates .copilot/skills/presentation-skill/
   cp -r md-to-slides/examples .copilot/skills/presentation-skill/
   ```

3. Open GitHub Copilot and reference the skill when creating presentations.

### For Claude Code

1. Clone this repository:
   ```bash
   git clone https://github.com/elbruno/md-to-slides.git
   ```

2. Copy the skill directory into your workspace:
   ```bash
   mkdir -p .copilot/skills/presentation-skill
   cp -r md-to-slides/skill/* .copilot/skills/presentation-skill/
   cp -r md-to-slides/templates .copilot/skills/presentation-skill/
   cp -r md-to-slides/examples .copilot/skills/presentation-skill/
   ```

3. Invoke Claude Code and reference the skill when creating presentations.

The skill reads `skill/contract.md` to understand the Markdown format, uses `templates/` for the HTML/CSS foundation, and refers to `examples/` for reference decks.

## Quick Example

After installation, try this with your AI agent:

```text
Use the presentation skill to create a 5-slide deck about adopting TypeScript. 
Title: "Why TypeScript?" Audience: JavaScript developers. Tone: practical.
```

The agent will create `input.md` (source) and `slides.html` (output) in your workspace.

## Agent Integration Examples

### 1. Customer Pitch Deck

```text
I have a customer meeting tomorrow. Use the presentation skill to create 
a 10-minute pitch deck from these talking points: [paste notes]. 
Make it professional, include a demo transition slide, and add speaker notes.
```

### 2. Conference Talk Generator

```text
Turn my blog post (docs/scaling-microservices.md) into a 20-minute conference talk. 
Use the presentation skill. Include code slides for the three patterns I discuss, 
and make the theme dark with high contrast.
```

### 3. Workshop Series

```text
I'm running a 4-part workshop on Docker. Use the presentation skill to create 
consistent decks for all four sessions: Basics, Networking, Volumes, Compose. 
Each deck should have 8 slides and speaker notes.
```

### 4. Meeting Transcript to Slides

```text
We just recorded our architecture review (transcript in notes/arch-review.txt). 
Use the presentation skill to turn the key decisions into a recap deck for 
the team. Keep it to 6 slides, audience: engineering team.
```

## Architecture Overview

This repository is portable and contract-driven:

- **`skill/contract.md`**: Defines the v1 authoring format (YAML front matter + Markdown slides separated by `---`).
- **`templates/`**: Reusable HTML shell and CSS primitives (Reveal.js 5.2.0, theme system, slide types).
- **`examples/`**: Reference decks showing minimal, standard, and power-user workflows.
- **`docs/`**: Quickstart, repository structure, and publishing guides.

**Why it's portable:**

- No tool-specific APIs. Works with any AI agent that can read Markdown and write HTML files.
- Source of truth lives in repo-versioned Markdown, not a proprietary format.
- Output is a single self-contained HTML file—no external build step or runtime service required.
- Same contract works identically in GitHub Copilot and Claude Code.

## Repository Layout

```
md-to-slides/
├── skill/             # Contract and skill-facing guidance
│   ├── contract.md    # Input/output format specification
│   ├── README.md      # Portable skill package overview
│   └── claude-code.md # Claude Code integration notes
├── templates/         # Reusable HTML and CSS deck primitives
│   ├── reveal-base.html
│   └── theme.css
├── examples/          # Reference decks (source + output)
│   └── minimal-talk/
│       ├── input.md
│       └── slides.html
├── docs/              # Usage and publishing guides
├── LICENSE            # MIT license
├── README.md          # This file
└── package.json       # Validation scripts
```

## Usage

1. **Clone the repository** and install the skill as shown above.
2. **Write or generate a Markdown source file** following `skill/contract.md`.
3. **Run the skill via your AI agent** to create `slides.html`.
4. **Open in a browser**—keyboard navigation, presenter mode, and PDF export work out of the box.

Example source format (simplified):

```markdown
---
title: My Talk
speaker: Your Name
theme: default-dark
---

<!-- slide:type=title -->
# My Talk

A practical guide to X

---

# First Point

- Bullet one
- Bullet two

??? notes
- Emphasize the "why" before the "how"
- Keep under 2 minutes
```

## Status & Maturity

**v1.0.0 (stable):**

- ✅ HTML + Reveal.js deck generation from Markdown
- ✅ Six slide types: title, content, code, demo-transition, two-column, closing
- ✅ Speaker notes, keyboard navigation, presenter mode
- ✅ Light/dark themes with CSS custom properties
- ✅ Validation gates for HTML validity, content preservation, accessibility baseline
- ✅ Works identically in GitHub Copilot and Claude Code
- ✅ Single self-contained output file (≤5MB, offline-capable)
- ✅ Tested on Windows, macOS, Linux; 1080p and 4K projectors
- ✅ Example decks included and validated

**Known limitations (deferred to v2):**

- Slide animations beyond fragments
- Embedded video/media
- Multi-deck management
- Real-time collaboration features
- Full accessibility audit (WCAG AAA)

**Production readiness:**

This skill is stable for creating HTML presentation decks from Markdown. It's been validated against real-world conference talks, customer pitches, and workshop content. The contract is locked, the output is reliable, and the validation gates prevent regressions.

## Testing

Run the validation suite from the repository root:

```bash
npm test
```

This checks that all expected files are present and validates the minimal example deck.

## Contributing

Contributions welcome. See `docs/repository-structure.md` for the folder contract and ownership boundaries.

## License

MIT License. See [LICENSE](LICENSE) for full text.

Copyright (c) Bruno Capuano & Contributors
