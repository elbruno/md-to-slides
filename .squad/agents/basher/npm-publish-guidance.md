# Decision: NPM Publishing Strategy for md-to-slides

**Date:** 2026-04-21  
**Agent:** Basher (Integration Engineer)  
**Status:** Recommended to Bruno

## Context

Bruno requested a step-by-step guide for publishing md-to-slides to npm. Current package.json has:
- `"private": true` — blocks publishing
- No `files` array — would publish everything
- Unscoped name `md-to-slides` — may be taken on npm

## Recommendations

### 1. Scoped Package Name
**Recommend:** `@elbruno/md-to-slides`

**Rationale:**
- Unscoped `md-to-slides` may already be taken on npm
- Scoped names under `@elbruno/` guarantee availability
- Matches GitHub username for brand consistency
- Can always be unscoped later if desired

### 2. Files Allowlist (Not .npmignore)
**Recommend:** Add `files` array to package.json

```json
"files": [
  "skill/",
  "templates/",
  "examples/",
  "scripts/",
  "docs/",
  "README.md",
  "LICENSE",
  "install.sh",
  "install.ps1"
]
```

**Rationale:**
- **Allowlist > Denylist:** Explicit inclusion is safer than explicit exclusion
- Prevents accidental publishing of `.squad/`, `tests/`, `.github/`, or future sensitive files
- Self-documenting: clearly shows what the package contains
- Industry best practice for npm packages

**Excludes:**
- `.squad/` (internal team state)
- `tests/` (not needed for skill consumers)
- `node_modules/` (auto-excluded by npm)
- `.github/` (CI/CD, not part of the skill)
- `.git/`, `.gitignore`, etc. (auto-excluded)

### 3. Pre-Publish Safety Script
**Recommend:** Add to package.json scripts:

```json
"prepublishOnly": "npm test"
```

**Rationale:**
- Automatically runs tests before `npm publish`
- Prevents publishing broken builds
- Zero-overhead safety net (no manual step)

### 4. Dry-Run Workflow
**Mandate:** Always run `npm pack --dry-run` before first publish

**Rationale:**
- Shows exact tarball contents and size
- Catches accidental inclusions before they go live
- One-time cost with massive risk reduction

## Project Convention

Going forward, any npm-publishable packages in this organization should:
1. Use scoped names under `@elbruno/` (or org scope if applicable)
2. Use `files` array allowlist (never rely solely on .npmignore)
3. Include `prepublishOnly: "npm test"` in scripts
4. Dry-run with `npm pack --dry-run` before first publish

## Implementation

Bruno must manually edit package.json to:
1. Remove `"private": true`
2. Change `"name"` to `"@elbruno/md-to-slides"` (or check availability of unscoped name first)
3. Add `"files"` array as shown above
4. Add `"prepublishOnly"` script

Then follow the full publishing guide provided.

---

**Next Steps:**
- Bruno reviews and implements package.json changes
- Bruno follows npm publish guide
- After successful publish, document in team decisions.md
