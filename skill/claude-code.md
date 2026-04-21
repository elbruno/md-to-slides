# Use this skill in Claude Code

Try this:

```text
Read `skill/contract.md`, then turn `examples/minimal-talk/input.md` into `examples/minimal-talk/slides.html`. Keep the output self-contained.
```

Use Claude Code with this workflow:

1. Point Claude Code at `skill/contract.md` first.
2. Give it a repo path to the source file, usually `input.md`.
3. Tell it to write `slides.html` beside that source file.
4. Review the generated HTML in a browser.

## Prompt patterns

### Generate from an existing source file

```text
Read `skill/contract.md`.
Use `examples/minimal-talk/input.md` as the source.
Generate `examples/minimal-talk/slides.html` beside it.
Preserve slide order, code blocks, and `??? notes`.
Keep the result self-contained and editable.
```

### Start from a brief, then generate the deck

```text
Read `skill/contract.md`.
Create `examples/my-talk/input.md` from this brief: [paste brief].
Then generate `examples/my-talk/slides.html` beside it.
Use the repo templates only as implementation guidance.
Do not require a build step or client-specific features.
```

## Rules to keep explicit

- `input.md` is the default source name.
- `slides.html` is the required v1 output.
- Source and output stay in the same folder.
- If you revise the deck, update `input.md` first and regenerate `slides.html`.
