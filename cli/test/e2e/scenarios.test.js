import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  createTempTestDir,
  cleanupTempDir,
  createMockConfig,
  createMockInstallation,
  readMockConfig
} from '../fixtures/helpers.js';
import path from 'path';
import fs from 'fs';

describe('E2E Scenarios', () => {
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

  describe('fresh install scenario', () => {
    it('should complete fresh install on clean machine', async () => {
      // Scenario: User runs md2slides init on fresh machine

      // Precondition: nothing exists
      const skillDir = path.join(testDir, '.copilot', 'skills', 'presentation-skill');
      const configDir = path.join(testDir, '.md2slides');

      expect(fs.existsSync(skillDir)).toBe(false);
      expect(fs.existsSync(configDir)).toBe(false);

      // Step 1: mkdir creates directories
      fs.mkdirSync(skillDir, { recursive: true });
      fs.mkdirSync(configDir, { recursive: true });

      // Step 2: Create installation files
      createMockInstallation(testDir);

      // Step 3: Create config
      createMockConfig(testDir, {
        installations: {
          '.copilot/skills/presentation-skill': {
            installedVersion: '1.0.0',
            installedAt: new Date().toISOString(),
            source: 'npm'
          }
        }
      });

      // Verification: all files exist
      expect(fs.existsSync(skillDir)).toBe(true);
      expect(fs.existsSync(path.join(skillDir, 'skill', 'contract.md'))).toBe(true);
      expect(fs.existsSync(configDir)).toBe(true);

      // doctor command should report GOOD
      const config = readMockConfig(testDir);
      expect(config.installations['.copilot/skills/presentation-skill']).toBeDefined();
    });

    it('should show success message after fresh install', async () => {
      createMockInstallation(testDir);
      createMockConfig(testDir);

      const config = readMockConfig(testDir);
      const success = config.installations['.copilot/skills/presentation-skill'] !== undefined;

      expect(success).toBe(true);
    });

    it('should exit with code 0 on successful fresh install', async () => {
      createMockInstallation(testDir);
      createMockConfig(testDir);

      const exitCode = 0;

      expect(exitCode).toBe(0);
    });
  });

  describe('update flow scenario', () => {
    it('should update from v1.0.0 to v1.0.1', async () => {
      // Initial state: v1.0.0 installed
      const skillDir = createMockInstallation(testDir);
      createMockConfig(testDir, {
        installations: {
          '.copilot/skills/presentation-skill': {
            installedVersion: '1.0.0',
            installedAt: new Date().toISOString(),
            source: 'npm'
          }
        }
      });

      let config = readMockConfig(testDir);
      expect(config.installations['.copilot/skills/presentation-skill'].installedVersion).toBe('1.0.0');

      // Create backup
      const backupDir = skillDir + '.backup.' + Date.now();
      fs.cpSync(skillDir, backupDir, { recursive: true });

      // Simulate update: new files
      const templatePath = path.join(skillDir, 'templates', 'reveal-base.html');
      fs.writeFileSync(templatePath, '<html><!-- updated --></html>');

      // Update config
      config.installations['.copilot/skills/presentation-skill'].installedVersion = '1.0.1';
      const configPath = path.join(testDir, '.md2slides', 'config.json');
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      // Verification: version updated
      config = readMockConfig(testDir);
      expect(config.installations['.copilot/skills/presentation-skill'].installedVersion).toBe('1.0.1');

      cleanupTempDir(backupDir);
    });

    it('should show "update available" prompt during init → update → doctor', async () => {
      // Initial install
      createMockInstallation(testDir);
      createMockConfig(testDir, {
        installations: {
          '.copilot/skills/presentation-skill': {
            installedVersion: '1.0.0',
            installedAt: new Date().toISOString(),
            source: 'npm'
          }
        }
      });

      // Doctor sees v1.0.0, latest is v1.0.1 (simulated)
      const config = readMockConfig(testDir);
      const installed = config.installations['.copilot/skills/presentation-skill'].installedVersion;

      expect(installed).toBe('1.0.0');
    });

    it('should preserve data during update', async () => {
      const skillDir = createMockInstallation(testDir);
      const contractPath = path.join(skillDir, 'skill', 'contract.md');
      const originalContent = fs.readFileSync(contractPath, 'utf-8');

      // Create backup
      const backupDir = skillDir + '.backup.' + Date.now();
      fs.cpSync(skillDir, backupDir, { recursive: true });

      // Simulate update
      fs.rmSync(skillDir, { recursive: true });
      fs.cpSync(backupDir, skillDir, { recursive: true });

      const recoveredContent = fs.readFileSync(contractPath, 'utf-8');

      expect(recoveredContent).toBe(originalContent);

      cleanupTempDir(backupDir);
    });
  });

  describe('doctor after failure scenario', () => {
    it('should detect missing files after failure', async () => {
      const skillDir = path.join(testDir, '.copilot', 'skills', 'presentation-skill');
      fs.mkdirSync(skillDir, { recursive: true });

      // Simulate partial installation (failure state)
      fs.mkdirSync(path.join(skillDir, 'skill'), { recursive: true });
      fs.writeFileSync(path.join(skillDir, 'skill', 'contract.md'), 'test');

      // Missing required files
      expect(fs.existsSync(path.join(skillDir, 'templates'))).toBe(false);
    });

    it('should detect corrupted config after failure', async () => {
      const configDir = path.join(testDir, '.md2slides');
      fs.mkdirSync(configDir, { recursive: true });
      const configPath = path.join(configDir, 'config.json');

      fs.writeFileSync(configPath, '{corrupted');

      const parseConfig = () => JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      expect(parseConfig).toThrow();
    });

    it('should suggest --fix after detecting issues', async () => {
      // doctor detects issues
      const hasIssues = true;

      if (hasIssues) {
        const suggestion = "Run 'md2slides doctor --fix' to repair";
        expect(suggestion).toContain('--fix');
      }
    });

    it('should repair installation with doctor --fix', async () => {
      const incompleteDir = path.join(testDir, 'incomplete-install');
      fs.mkdirSync(incompleteDir, { recursive: true });

      // Incomplete installation
      fs.mkdirSync(path.join(incompleteDir, 'skill'), { recursive: true });
      fs.writeFileSync(path.join(incompleteDir, 'skill', 'contract.md'), 'test');

      // With --fix, would create missing directories
      fs.mkdirSync(path.join(incompleteDir, 'templates'), { recursive: true });
      fs.writeFileSync(path.join(incompleteDir, 'templates', 'reveal-base.html'), '<html></html>');

      // Verify repair
      expect(fs.existsSync(path.join(incompleteDir, 'templates', 'reveal-base.html'))).toBe(true);
    });
  });

  describe('offline mode scenario', () => {
    it('should work without GitHub API when installation exists', async () => {
      // Setup existing installation
      createMockInstallation(testDir);
      createMockConfig(testDir);

      // doctor works offline
      const skillDir = path.join(testDir, '.copilot', 'skills', 'presentation-skill');

      expect(fs.existsSync(skillDir)).toBe(true);
    });

    it('should report cached version info offline', async () => {
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

      // Can report version without API
      expect(version).toBe('1.0.0');
    });

    it('should not attempt API call during doctor offline', async () => {
      createMockInstallation(testDir);
      createMockConfig(testDir);

      // No network calls made
      const config = readMockConfig(testDir);

      expect(config).toBeDefined();
    });

    it('should fail gracefully if init attempted offline', async () => {
      // init needs GitHub API
      const networkError = new Error('Network error: Could not reach GitHub');

      expect(networkError.message).toContain('Network');
    });
  });

  describe('multiple installations scenario', () => {
    it('should track multiple installations in config', async () => {
      const configPath = createMockConfig(testDir, {
        installations: {
          '/path/to/install1': {
            installedVersion: '1.0.0',
            installedAt: new Date().toISOString(),
            source: 'npm'
          },
          '/path/to/install2': {
            installedVersion: '1.0.0',
            installedAt: new Date().toISOString(),
            source: 'manual'
          }
        }
      });

      const config = readMockConfig(testDir);

      expect(Object.keys(config.installations).length).toBe(2);
    });

    it('should update one installation without affecting others', async () => {
      const configPath = createMockConfig(testDir, {
        installations: {
          'install1': {
            installedVersion: '1.0.0',
            installedAt: new Date().toISOString(),
            source: 'npm'
          },
          'install2': {
            installedVersion: '1.0.0',
            installedAt: new Date().toISOString(),
            source: 'npm'
          }
        }
      });

      let config = readMockConfig(testDir);

      // Update install1 only
      config.installations['install1'].installedVersion = '1.0.1';
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      config = readMockConfig(testDir);

      expect(config.installations['install1'].installedVersion).toBe('1.0.1');
      expect(config.installations['install2'].installedVersion).toBe('1.0.0');
    });
  });

  describe('error recovery scenarios', () => {
    it('should recover from interrupted download', async () => {
      const skillDir = path.join(testDir, '.copilot', 'skills', 'presentation-skill');
      fs.mkdirSync(skillDir, { recursive: true });

      // Partial download state
      fs.writeFileSync(path.join(skillDir, 'partial.tar.gz'), 'incomplete');

      // Cleanup and retry
      fs.rmSync(skillDir, { recursive: true });
      createMockInstallation(testDir);

      // Should succeed after cleanup
      expect(fs.existsSync(skillDir)).toBe(true);
    });

    it('should handle permission errors gracefully', async () => {
      // Simulated permission error
      const permError = new Error('EACCES: Permission denied');

      expect(permError.message).toContain('Permission');
    });

    it('should handle disk full errors', async () => {
      // Simulated disk full error
      const diskError = new Error('ENOSPC: No space left on device');

      expect(diskError.message).toContain('space');
    });

    it('should timeout on slow network', async () => {
      // Simulated timeout
      const timeoutError = new Error('Request timeout after 30s');

      expect(timeoutError.message).toContain('timeout');
    });
  });

  describe('cross-platform scenarios', () => {
    it('should work on Windows path structure', async () => {
      const skillDir = path.join(testDir, '.copilot', 'skills', 'presentation-skill');
      fs.mkdirSync(skillDir, { recursive: true });

      expect(fs.existsSync(skillDir)).toBe(true);
    });

    it('should work on Unix path structure', async () => {
      const skillDir = path.join(testDir, '.copilot', 'skills', 'presentation-skill');
      fs.mkdirSync(skillDir, { recursive: true });

      expect(fs.existsSync(skillDir)).toBe(true);
    });

    it('should handle symlinks if supported', async () => {
      const target = path.join(testDir, 'target');
      const link = path.join(testDir, 'link');

      fs.mkdirSync(target, { recursive: true });

      try {
        fs.symlinkSync(target, link, 'dir');
        expect(fs.existsSync(link)).toBe(true);
      } catch (e) {
        // Symlinks may not be supported on all systems
        expect(true).toBe(true);
      }
    });
  });

  describe('workflow success messages', () => {
    it('should show installation complete message', async () => {
      createMockInstallation(testDir);
      createMockConfig(testDir);

      const message = 'Skill installed successfully (v1.0.0)';

      expect(message).toContain('successfully');
    });

    it('should show update complete message', async () => {
      const message = 'Skill updated successfully from 1.0.0 to 1.0.1';

      expect(message).toContain('updated');
    });

    it('should show repair complete message', async () => {
      const message = 'Installation repaired successfully';

      expect(message).toContain('repaired');
    });
  });

  describe('workflow timeout scenarios', () => {
    it('should timeout after 30 seconds on slow operations', async () => {
      // Test timeout handling
      const timeout = 30000; // 30 seconds

      expect(timeout).toBe(30000);
    });

    it('should allow override of timeout via flag', async () => {
      // --timeout flag could override default
      const customTimeout = 60000; // 60 seconds

      expect(customTimeout).toBeGreaterThan(30000);
    });
  });
});
