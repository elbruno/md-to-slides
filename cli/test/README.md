# md2slides CLI Test Suite

Comprehensive testing for the md2slides CLI tool, including unit tests, integration tests, E2E scenarios, and post-install validation.

## Test Structure

```
cli/test/
├── unit/              # Unit tests for individual commands
│   ├── init.test.js
│   ├── update.test.js
│   ├── doctor.test.js
│   └── version.test.js
├── integration/       # Integration tests with real temp directories
│   └── workflows.test.js
├── e2e/              # End-to-end scenarios
│   └── scenarios.test.js
├── fixtures/         # Test fixtures and helpers
│   ├── github-api.js
│   └── helpers.js
├── validate.js       # Post-install validation harness
└── setup.js          # Jest setup and global test utilities
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### E2E Tests Only
```bash
npm run test:e2e
```

### Watch Mode
```bash
npm run test:watch
```

### Post-Install Validation
```bash
npm run validate
```

## Test Coverage

Target: **>80% code coverage** for all commands.

### Coverage Report
Tests generate a coverage report in `coverage/` directory. Open `coverage/lcov-report/index.html` in a browser to view detailed coverage.

## Test Specifications

### Unit Tests (`cli/test/unit/`)

#### init.test.js
- **Directory creation:** Creates `.copilot/skills/presentation-skill/` structure
- **File extraction:** Extracts tar.gz with correct permissions
- **Validation:** Checks for required files (contract.md, templates, examples)
- **Error handling:** Network errors, permission denied, hash mismatches
- **Config writing:** Stores metadata, handles multiple installations
- **Cross-platform paths:** Windows and Unix path compatibility

Exit codes tested: 0 (success), 1 (validation error), 2 (network), 3 (filesystem), 5 (installation)

#### update.test.js
- **Version checking:** Fetches from GitHub API, compares versions
- **API calls:** GitHub releases endpoint, error handling, retries
- **Atomic updates:** Backup before update, restore on failure
- **Config writes:** Updates version, preserves other installations
- **Rollback:** Supports --rollback flag, lists backups
- **Error scenarios:** Network failures, hash mismatches, disk space errors

#### doctor.test.js
- **File existence checks:** Verifies installation structure
- **Config validation:** Checks JSON validity, required fields
- **Installation verification:** Version sync, timestamp validation
- **Health reporting:** Outputs GOOD/WARNING/CRITICAL status
- **Offline handling:** Works without GitHub API
- **--fix flag:** Attempts repairs (re-download, permission fixes)
- **--verbose and --json flags:** Output formatting options

#### version.test.js
- **Version parsing:** Semantic versioning, v-prefix handling
- **Display formatting:** `md2slides/VERSION` format
- **--check-update flag:** Compares with latest, suggests upgrade
- **Program flags:** --version, -v short form
- **Error handling:** Missing config, corrupted config, invalid format

### Integration Tests (`cli/test/integration/`)

#### workflows.test.js
- **Full workflow:** init → update → doctor sequence
- **Version checking:** Installed vs. latest comparison
- **Atomic operations:** Backup before update, restore on failure
- **Cross-platform paths:** Windows and Unix directory operations
- **Error recovery:** Network failures, corrupted files, partial backups
- **Temp directory isolation:** Each test starts clean, no pollution
- **Config persistence:** Updates survive across commands

### E2E Scenarios (`cli/test/e2e/`)

#### scenarios.test.js
- **Fresh install:** md2slides init on clean machine
- **Update flow:** v1.0.0 → v1.0.1 upgrade
- **Doctor after failure:** Detects missing files, corrupted config
- **Offline mode:** Works without GitHub API after install
- **Multiple installations:** Tracks per-installation metadata
- **Error recovery:** Interrupted downloads, permission errors, disk full
- **Cross-platform:** Windows and Unix path handling

## Test Fixtures

### github-api.js
Mock GitHub API responses for testing without network calls:
- `mockGitHubRelease` - Release v1.0.0
- `mockGitHubReleaseV101` - Release v1.0.1
- `mockConfig` - Sample config.json
- `mockInstallationStructure` - Directory structure
- `requiredInstallationFiles` - Files that must exist
- `mockErrorResponses` - Common error scenarios

### helpers.js
Test utilities for isolation and setup:
- `createTempTestDir()` - Creates isolated temp directory
- `cleanupTempDir()` - Removes temp directory
- `createMockInstallation()` - Creates complete installation
- `createMockConfig()` - Creates config with custom values
- `readMockConfig()` - Reads config from test directory
- `captureOutput()` - Captures console output

## Configuration

### jest.config.js
- **Test environment:** Node.js
- **Transform:** None (ES modules)
- **Coverage threshold:** 80% for branches/functions/lines/statements
- **Test timeout:** 10 seconds (30 seconds for E2E)
- **Setup file:** `test/setup.js` - Global mocks and utilities

### setup.js
- Sets test environment variables
- Initializes global test utilities
- Mocks node-fetch if unavailable

## Best Practices

### Test Isolation
- Each test gets a fresh temp directory (via `createTempTestDir()`)
- All temp directories cleaned up after each test
- No test pollution or shared state

### Real Filesystem
- Tests use Node's real `fs` module, not memfs
- Ensures realistic permission and disk behavior
- Tests run against actual directory operations

### Mock GitHub API
- No real network calls (use fixtures)
- Tests can run offline
- Reproducible results

### Error Testing
- Tests validate exact error messages
- Tests verify exit codes (0, 1, 2, 3, 4, 5)
- Tests cover both happy path and failure modes

### Cross-Platform
- Tests use `path.join()`, not string concatenation
- Windows and Unix paths tested
- Symlink tests handle systems that don't support them

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Generic error (validation, permissions) |
| 2 | Network error |
| 3 | File system error (disk full, permission) |
| 4 | Invalid input (file not found, malformed YAML) |
| 5 | Installation error (skill not found, corrupted) |

## Coverage Goals

```
Statements   : >80%
Branches     : >80%
Functions    : >80%
Lines        : >80%
```

Current coverage tracked in `coverage/` directory.

## Debugging Tests

### Run single test file
```bash
jest cli/test/unit/init.test.js
```

### Run tests matching pattern
```bash
jest --testNamePattern="version parsing"
```

### Run with verbose output
```bash
jest --verbose
```

### Run with debug logging
```bash
DEBUG=* npm test
```

## Adding New Tests

1. Create test file in appropriate directory (`unit/`, `integration/`, or `e2e/`)
2. Use `.test.js` extension
3. Use Jest `describe()` and `it()` blocks
4. Import helpers from `../fixtures/helpers.js`
5. Use `beforeEach()`/`afterEach()` for setup/teardown
6. Clean up temp directories in `afterEach()`

Example:
```javascript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createTempTestDir, cleanupTempDir } from '../fixtures/helpers.js';

describe('new feature', () => {
  let testDir;

  beforeEach(() => {
    testDir = createTempTestDir();
  });

  afterEach(() => {
    cleanupTempDir(testDir);
  });

  it('should do something', () => {
    // Test implementation
  });
});
```

## CI/CD Integration

Tests can run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm test

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

## Troubleshooting

### Tests hang
- Check for infinite loops in test code
- Verify `cleanupTempDir()` is called in `afterEach()`
- Check for unresolved promises

### Permission errors
- Ensure write access to `node_modules/` and `/tmp/`
- Check for leftover temp directories from failed tests

### Path issues
- Use `path.join()`, not string concatenation
- Use `path.normalize()` for cross-platform consistency
- Test on both Windows and Unix systems

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Node.js fs module](https://nodejs.org/api/fs.html)
- [Semantic Versioning](https://semver.org/)
- [GitHub API](https://docs.github.com/rest)
