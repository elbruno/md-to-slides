# Alternative install options

The default install path for `md-to-slides` is still:

```bash
npm install md-to-slides
```

For a local dependency install, run the packaged CLI with:

```bash
npx md2slides init
```

If you install the package globally, or your environment already exposes local npm bins on `PATH`, that same step can be:

```bash
md2slides init
```

Use the options on this page only if you specifically want a portable `.copilot/skills/presentation-skill/` folder without going through the packaged CLI, or you want a source-based install flow.

## When to use these options

- **Use npm** when you want the published package inside an existing project.
- **Use a portable skill-folder install** when you want the skill materialized under `.copilot/skills/presentation-skill/`.
- **Use a local clone/install** when you are contributing to this repo or want to inspect the source before copying files.

## Portable skill folder install

These options copy the same core assets into `.copilot/skills/presentation-skill/`:

- top-level skill guidance files such as `SKILL.md` and `contract.md`
- `templates/` — HTML and CSS deck primitives
- `examples/` — optional but useful reference decks

## GitHub-hosted installer scripts

Use these when you want the repo-maintained installer to populate `.copilot/skills/presentation-skill/` for you.

### macOS/Linux/WSL

```bash
curl -sL https://raw.githubusercontent.com/elbruno/md-to-slides/main/install.sh | bash
```

### Windows (PowerShell)

```powershell
powershell -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/elbruno/md-to-slides/main/install.ps1' -OutFile 'install.ps1'; & './install.ps1'; Remove-Item 'install.ps1'"
```

## Run the installer from a local clone

Use this if you want the same installer logic, but from a checked-out copy of the repository.

1. Clone the repository:

   ```bash
   git clone https://github.com/elbruno/md-to-slides.git
   cd md-to-slides
   ```

2. Run the platform installer from the repository root:

   ```bash
   # macOS/Linux/WSL
   ./install.sh

   # Windows (PowerShell)
   powershell -ExecutionPolicy Bypass -File install.ps1
   ```

## Archive/manual install

Use this when you want a one-liner or do not want to keep a clone after copying the files.

### One-liner archive install

```bash
# macOS/Linux/WSL
curl -sL https://github.com/elbruno/md-to-slides/archive/main.tar.gz | tar xz --strip-components=1 --wildcards "*/skill" "*/templates" "*/examples" && mkdir -p .copilot/skills/presentation-skill && mv skill/* templates examples .copilot/skills/presentation-skill/ && rmdir skill

# Windows (PowerShell)
Invoke-WebRequest -Uri "https://github.com/elbruno/md-to-slides/archive/main.zip" -OutFile main.zip; Expand-Archive main.zip -DestinationPath .; New-Item -ItemType Directory -Force .copilot/skills/presentation-skill; Move-Item md-to-slides-main/skill/*,md-to-slides-main/templates,md-to-slides-main/examples .copilot/skills/presentation-skill/ -Force; Remove-Item main.zip,md-to-slides-main -Recurse
```

### Manual copy from a local clone

1. Clone the repository:

   ```bash
   git clone https://github.com/elbruno/md-to-slides.git
   ```

2. Copy the portable skill files into your workspace:

   ```bash
   mkdir -p .copilot/skills/presentation-skill
   cp -r md-to-slides/skill/* .copilot/skills/presentation-skill/
   cp -r md-to-slides/templates .copilot/skills/presentation-skill/
   cp -r md-to-slides/examples .copilot/skills/presentation-skill/
   ```

   Windows (PowerShell):

   ```powershell
   New-Item -ItemType Directory -Force .copilot\skills\presentation-skill | Out-Null
   Copy-Item md-to-slides\skill\* .copilot\skills\presentation-skill -Recurse -Force
   Copy-Item md-to-slides\templates .copilot\skills\presentation-skill -Recurse -Force
   Copy-Item md-to-slides\examples .copilot\skills\presentation-skill -Recurse -Force
   ```

3. Reference the installed files from GitHub Copilot or Claude Code when generating presentations.

## After installation

No matter which alternative path you use, the working files are the same:

- `.copilot/skills/presentation-skill/contract.md`
- `.copilot/skills/presentation-skill/templates/reveal-base.html`
- `.copilot/skills/presentation-skill/templates/theme.css`
- `.copilot/skills/presentation-skill/examples/`

If you do not need that portable folder structure, go back to the simpler npm-first workflow in the main [README](../README.md).
