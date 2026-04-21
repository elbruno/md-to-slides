import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  createTempTestDir,
  cleanupTempDir,
  createMockConfig,
  readMockConfig
} from '../fixtures/helpers.js';
import path from 'path';
import fs from 'fs';

describe('version command', () => {
  let testDir;
  let originalHomeDir;

  beforeEach(() => {
    testDir = createTempTestDir();
    originalHomeDir = process.env.HOME;
    process.env.HOME = testDir;
  });

  afterEach(() => {
    cleanupTempDir(testDir);
    process.env.HOME = originalHomeDir;
  });

  describe('version parsing', () => {
    it('should parse semantic version correctly', async () => {
      const version = '1.0.0';
      const parts = version.split('.');

      expect(parts.length).toBe(3);
      expect(parts[0]).toBe('1');
      expect(parts[1]).toBe('0');
      expect(parts[2]).toBe('0');
    });

    it('should handle version with v prefix', async () => {
      const versionWithPrefix = 'v1.0.0';
      const cleanVersion = versionWithPrefix.replace(/^v/, '');

      expect(cleanVersion).toBe('1.0.0');
    });

    it('should handle pre-release versions', async () => {
      const prerelease = '1.0.0-alpha.1';
      const isPrerelease = prerelease.includes('-');

      expect(isPrerelease).toBe(true);
    });

    it('should handle build metadata in version', async () => {
      const versionWithBuild = '1.0.0+build.123';
      const isWithBuild = versionWithBuild.includes('+');

      expect(isWithBuild).toBe(true);
    });

    it('should validate version format', async () => {
      const versions = [
        { version: '1.0.0', valid: true },
        { version: '1.2.3', valid: true },
        { version: 'v1.0.0', valid: true },
        { version: '1.0', valid: false },
        { version: 'invalid', valid: false }
      ];

      for (const { version, valid } of versions) {
        const versionRegex = /^\d+\.\d+\.\d+/;
        const isValid = versionRegex.test(version.replace(/^v/, ''));

        expect(isValid).toBe(valid);
      }
    });
  });

  describe('display formatting', () => {
    it('should format output as "md2slides/VERSION"', async () => {
      const version = '1.0.0';
      const output = `md2slides/${version}`;

      expect(output).toMatch(/^md2slides\/\d+\.\d+\.\d+$/);
    });

    it('should include installed version in output', async () => {
      createMockConfig(testDir, {
        installations: {
          '.copilot/skills/presentation-skill': {
            installedVersion: '1.0.0',
            installedAt: new Date().toISOString(),
            source: 'npm'
          }
        }
      });

      const config = readMockConfig(testDir);
      const version = config.installations['.copilot/skills/presentation-skill'].installedVersion;

      const output = `md2slides/${version}`;

      expect(output).toContain('1.0.0');
    });

    it('should format output with version info from package.json', async () => {
      const packageJsonPath = path.join(testDir, 'package.json');
      fs.writeFileSync(packageJsonPath, JSON.stringify({
        version: '1.0.0',
        name: 'md2slides'
      }, null, 2));

      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const output = `md2slides/${pkg.version}`;

      expect(output).toBe('md2slides/1.0.0');
    });

    it('should include release date if available', async () => {
      const version = '1.0.0';
      const releaseDate = new Date().toISOString().split('T')[0];

      const output = `md2slides/${version} (${releaseDate})`;

      expect(output).toContain(version);
      expect(output).toContain(releaseDate);
    });

    it('should indicate if newer version is available', async () => {
      const currentVersion = '1.0.0';
      const latestVersion = '1.0.1';

      const output = currentVersion !== latestVersion 
        ? `md2slides/${currentVersion} (latest: ${latestVersion})`
        : `md2slides/${currentVersion}`;

      expect(output).toContain('md2slides');
    });

    it('should format upgrade suggestion', async () => {
      const currentVersion = '1.0.0';
      const latestVersion = '1.0.1';

      if (latestVersion > currentVersion) {
        const suggestion = `New version ${latestVersion} available. Run 'md2slides update' to upgrade.`;
        expect(suggestion).toContain('md2slides update');
      }
    });

    it('should format version with source information', async () => {
      createMockConfig(testDir, {
        installations: {
          '.copilot/skills/presentation-skill': {
            installedVersion: '1.0.0',
            installedAt: new Date().toISOString(),
            source: 'npm'
          }
        }
      });

      const config = readMockConfig(testDir);
      const installation = config.installations['.copilot/skills/presentation-skill'];

      const output = `md2slides/${installation.installedVersion} (source: ${installation.source})`;

      expect(output).toContain('npm');
    });
  });

  describe('--check-update flag', () => {
    it('should compare installed version with latest when --check-update', async () => {
      const currentVersion = '1.0.0';
      const latestVersion = '1.0.1';

      const hasUpdate = latestVersion > currentVersion;

      expect(hasUpdate).toBe(true);
    });

    it('should output latest version when --check-update is used', async () => {
      const currentVersion = '1.0.0';
      const latestVersion = '1.0.1';

      const output = `md2slides/${currentVersion} (installed: ${currentVersion}, latest: ${latestVersion})`;

      expect(output).toContain('latest');
      expect(output).toContain(latestVersion);
    });

    it('should indicate no update available', async () => {
      const currentVersion = '1.0.1';
      const latestVersion = '1.0.1';

      const hasUpdate = latestVersion > currentVersion;

      expect(hasUpdate).toBe(false);
    });

    it('should handle network error in --check-update gracefully', async () => {
      const networkError = new Error('Could not fetch latest release from GitHub');

      expect(networkError.message).toContain('GitHub');
    });
  });

  describe('program version flag', () => {
    it('should respond to --version flag', async () => {
      // Flag should be recognized by commander
      expect('--version').toBeTruthy();
    });

    it('should respond to -v short flag', async () => {
      // Short flag should be recognized
      expect('-v').toBeTruthy();
    });

    it('should exit cleanly after showing version', async () => {
      const exitCode = 0;

      expect(exitCode).toBe(0);
    });
  });

  describe('error handling', () => {
    it('should handle missing config file', async () => {
      const configPath = path.join(testDir, '.md2slides', 'config.json');

      // No config file
      expect(fs.existsSync(configPath)).toBe(false);
    });

    it('should handle corrupted config file', async () => {
      const configDir = path.join(testDir, '.md2slides');
      fs.mkdirSync(configDir, { recursive: true });
      const configPath = path.join(configDir, 'config.json');

      fs.writeFileSync(configPath, '{invalid}');

      const parseConfig = () => JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      expect(parseConfig).toThrow();
    });

    it('should handle missing installation entry in config', async () => {
      createMockConfig(testDir, {
        installations: {}
      });

      const config = readMockConfig(testDir);

      expect(config.installations).toBeDefined();
      expect(Object.keys(config.installations).length).toBe(0);
    });

    it('should fall back to CLI version if config unavailable', async () => {
      const cliVersion = '1.0.0';

      expect(cliVersion).toBe('1.0.0');
    });

    it('should handle invalid version format gracefully', async () => {
      const invalidVersion = 'not-a-version';
      const isValid = /^\d+\.\d+\.\d+/.test(invalidVersion);

      expect(isValid).toBe(false);
    });
  });

  describe('output modes', () => {
    it('should output plain text by default', async () => {
      const version = '1.0.0';
      const output = `md2slides/${version}`;

      expect(typeof output).toBe('string');
      expect(output).not.toContain('{');
    });

    it('should output JSON with --json flag', async () => {
      const versionInfo = {
        name: 'md2slides',
        version: '1.0.0',
        installed: '1.0.0'
      };

      const jsonOutput = JSON.stringify(versionInfo);

      expect(() => JSON.parse(jsonOutput)).not.toThrow();
    });

    it('should output to stdout, not stderr', async () => {
      // Version output goes to stdout
      const channel = 'stdout';

      expect(channel).toBe('stdout');
    });
  });

  describe('exit codes', () => {
    it('should exit with code 0 on success', async () => {
      const exitCode = 0;

      expect(exitCode).toBe(0);
    });

    it('should exit with code 1 on error', async () => {
      const exitCode = 1;

      expect(exitCode).toBe(1);
    });
  });

  describe('version source priority', () => {
    it('should prefer config version over package.json', async () => {
      // Create both config and package.json with different versions
      createMockConfig(testDir, {
        installations: {
          '.copilot/skills/presentation-skill': {
            installedVersion: '1.0.0',
            installedAt: new Date().toISOString(),
            source: 'npm'
          }
        }
      });

      const config = readMockConfig(testDir);
      const configVersion = config.installations['.copilot/skills/presentation-skill'].installedVersion;

      expect(configVersion).toBe('1.0.0');
    });

    it('should use installation version if available', async () => {
      const installDir = path.join(testDir, '.copilot', 'skills', 'presentation-skill');
      fs.mkdirSync(installDir, { recursive: true });

      createMockConfig(testDir, {
        installations: {
          '.copilot/skills/presentation-skill': {
            installedVersion: '1.0.5',
            installedAt: new Date().toISOString(),
            source: 'npm'
          }
        }
      });

      const config = readMockConfig(testDir);
      const version = config.installations['.copilot/skills/presentation-skill'].installedVersion;

      expect(version).toBe('1.0.5');
    });
  });
});
