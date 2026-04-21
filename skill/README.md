# Portable presentation skill package

Try this:

```text
Read `skill/contract.md`, then turn `examples/minimal-talk/input.md` into `examples/minimal-talk/slides.html`.
```

This folder holds the portable contract for the presentation skill. The contract stays repo-first and tool-neutral: one Markdown source in, one self-contained `slides.html` deck out.

---

## What is in the package

| Artifact | Purpose | Ships as portable content |
| --- | --- | --- |
| `skill/contract.md` | Defines the v1 input and output contract. | Yes |
| `skill/claude-code.md` | Shows the Claude Code prompt pattern for the contract. | Yes |
| `.copilot/skills/presentation-skill/SKILL.md` | Wires the same workflow into GitHub Copilot skill format. | Copilot-only wrapper |

The contract matters more than the wrapper. If the repo name or skill name changes later, the authoring flow should still stay the same.

## How the package maps to this repo

| Repo path | Role in the workflow |
| --- | --- |
| `skill/` | Source of truth for the portable authoring contract and client guidance. |
| `.copilot/skills/presentation-skill/` | GitHub Copilot entry point that applies the contract. |
| `templates/` | HTML and CSS primitives the generator can borrow from while still producing a self-contained deck. |
| `examples/` | Real `input.md` and `slides.html` pairs that prove the contract works. |
| `README.md` and `docs/` | Repository docs, publishing guidance, and folder rules. |
| `.squad/` | Team coordination only. Do not treat it as part of the shipped package. |

## End-to-end workflow

1. Start with `input.md` or another Markdown file that follows `skill/contract.md`.
2. Keep that source file in the repo so the deck definition stays versioned.
3. Generate `slides.html` in the same folder as the source file.
4. Open `slides.html` in a browser and review the result.
5. If you want changes, edit `input.md` first, then regenerate `slides.html`.

## What a user should never have to guess

- The default source name is `input.md`.
- The default output name is `slides.html`.
- Both files live side by side.
- The output is a single file with no required build step.
- Notes, code blocks, and slide order must survive generation.

## Related files

- Claude Code usage: `skill/claude-code.md`
- GitHub Copilot skill: `.copilot/skills/presentation-skill/SKILL.md`
- Contract reference: `skill/contract.md`
