# md2slides CLI

Global npm CLI tool for the md-to-slides presentation skill.

## Installation

Install globally with npm:

```bash
npm install -g md2slides
```

## Usage

```bash
md2slides --help
md2slides init --name my-presentation
md2slides generate input.md --output slides.html
md2slides serve slides.html --port 3000
md2slides doctor
md2slides version
md2slides update
```

## Development

To test locally before publishing:

```bash
cd cli
npm install
npm link
md2slides --help
npm unlink md2slides  # to remove local link
```

## Publishing to npm

1. Ensure version in `package.json` is updated
2. Test locally with `npm link`
3. Publish:

```bash
npm publish --access public
```

## Cross-Platform Support

The CLI uses platform-agnostic modules (commander, chalk, ora) and Node.js built-ins for maximum compatibility across Windows, macOS, and Linux.
