# md2slides v1.0.0 — The Presentation Skill, Now in Your Terminal

**The easiest way to manage and generate Markdown-to-HTML presentation decks—no build step, no setup required.**

---

## ✨ What's New

md2slides v1.0.0 brings the power of the md-to-slides presentation skill to npm as a global CLI. Whether you're building decks for customer pitches, conference talks, or team workshops, md2slides handles setup, updates, and generation—leaving you free to focus on content.

### Core Commands

- **`init`** — Bootstrap a new presentation project in seconds with starter templates and skill integration
- **`generate`** — Transform Markdown outlines into self-contained HTML slides with Reveal.js
- **`serve`** — Preview decks locally with live browser serving
- **`doctor`** — Diagnose environment and skill installation issues
- **`update`** — Keep your presentation skill in sync with the latest features
- **`version`** — Check CLI and installed skill versions

### Under the Hood

- ✅ **Cross-platform** — Windows, macOS, Linux with zero platform-specific dependencies
- ✅ **GitHub API integration** — Auto-detect and fetch the latest skill from GitHub
- ✅ **Single HTML output** — Deck is self-contained, offline-ready, and projector-tested
- ✅ **Six slide types** — Title, content, code, demo-transition, two-column, and closing
- ✅ **Speaker notes & presenter mode** — Built into Reveal.js
- ✅ **Light/dark themes** — Toggle themes with CSS custom properties
- ✅ **Validated output** — HTML validity, content preservation, and accessibility baseline checks

---

## 🚀 Getting Started

### Install

```bash
npm install -g md2slides
```

### Quick Setup

```bash
# Create a new presentation project
md2slides init --name my-awesome-talk

# Generate slides from Markdown
md2slides generate input.md --output slides.html

# Preview in your browser
md2slides serve slides.html --port 3000

# Check your setup
md2slides doctor
```

---

## 📋 What's Next

We're building toward a full presentation ecosystem:

- **Tier 1 (Current)** — Node.js CLI with GitHub integration and local preview
- **Tier 2 (Roadmap)** — .NET CLI for C# developers and enterprise environments
- **Tier 3 (Future)** — Go CLI for DevOps and infrastructure teams
- **Enhanced generation** — Prompt optimization for AI-powered deck generation
- **Batch operations** — Multi-deck builds for course materials and documentation sites

---

## 🔗 Resources

- 📚 **[GitHub Repository](https://github.com/elbruno/md-to-slides)** — Source, examples, and templates
- 📖 **[Skill Documentation](https://github.com/elbruno/md-to-slides/tree/main/skill)** — Contract, format guide, AI integration
- 🐛 **[Issues & Feedback](https://github.com/elbruno/md-to-slides/issues)** — Report bugs, request features
- ✨ **[Example Decks](https://github.com/elbruno/md-to-slides/tree/main/examples)** — Reference presentations

---

## 🙏 Thanks

This release is the result of community feedback and collaborative design. Thanks to everyone who tested early versions, shared use cases, and helped shape the feature set. Special thanks to the GitHub Copilot and Claude Code teams for creating the portable skills platform that made this possible.

---

**Ready to present?** Start with `md2slides init` and turn your next outline into a polished deck.

**Made with ❤️ by [Bruno Capuano](https://github.com/elbruno) and contributors**
