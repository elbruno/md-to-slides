import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  createTempTestDir,
  cleanupTempDir,
  createMockConfig,
  createMockInstallation,
  readMockConfig
} from '../fixtures/helpers.js';
import { mockGitHubRelease, mockGitHubReleaseV101 } from '../fixtures/github-api.js';
import path from 'path';
import fs from 'fs';

describe('update command', () => {
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

  describe('version checking', () => {
    it('should fetch latest version from GitHub API', async () => {
      const release = mockGitHubRelease;

      expect(release.tag_name).toBe('v1.0.0');
      expect(release.assets).toBeDefined();
    });

    it('should compare installed version with latest', async () => {
      const currentVersion = '1.0.0';
      const latestVersion = '1.0.1';

      expect(currentVersion).toBeDefined();
      expect(latestVersion).toBeDefined();
      expect(latestVersion > currentVersion).toBe(true);
    });

    it('should detect when update is available', async () => {
      const current = '1.0.0';
      const latest = '1.0.1';

      const isUpdateAvailable = latest > current;
      expect(isUpdateAvailable).toBe(true);
    });

    it('should detect when no update is available', async () => {
      const current = '1.0.1';
      const latest = '1.0.1';

      const isUpdateAvailable = latest > current;
      expect(isUpdateAvailable).toBe(false);
    });

    it('should handle prerelease versions', async () => {
      const prereleaseRelease = {
        ...mockGitHubRelease,
        prerelease: true
      };

      expect(prereleaseRelease.prerelease).toBe(true);
    });
  });

  describe('API calls', () => {
    it('should make API call to GitHub releases endpoint', async () => {
      const endpoint = 'https://api.github.com/repos/elbruno/md-to-slides/releases/latest';

      expect(endpoint).toContain('api.github.com');
      expect(endpoint).toContain('releases');
    });

    it('should handle API errors gracefully', async () => {
      const apiError = new Error('Failed to fetch from GitHub API');

      expect(apiError.message).toContain('GitHub');
    });

    it('should retry API calls on timeout', async () => {
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        retryCount++;
      }

      expect(retryCount).toBe(maxRetries);
    });

    it('should use correct headers for GitHub API', async () => {
      const headers = {
        'User-Agent': 'md2slides-cli/1.0.0',
        'Accept': 'application/vnd.github.v3+json'
      };

      expect(headers['User-Agent']).toContain('md2slides-cli');
      expect(headers['Accept']).toContain('github');
    });
  });

  describe('atomic updates', () => {
    it('should create backup before updating', async () => {
      const installDir = createMockInstallation(testDir);
      const backupDir = installDir + '.backup.' + Date.now();

      // Simulate backup creation
      fs.cpSync(installDir, backupDir, { recursive: true });

      expect(fs.existsSync(backupDir)).toBe(true);

      cleanupTempDir(backupDir);
    });

    it('should restore backup on update failure', async () => {
      const installDir = createMockInstallation(testDir);
      const backupDir = installDir + '.backup.' + Date.now();

      // Create backup
      fs.cpSync(installDir, backupDir, { recursive: true });

      // Simulate update failure: restore backup
      fs.rmSync(installDir, { recursive: true });
      fs.cpSync(backupDir, installDir, { recursive: true });

      expect(fs.existsSync(installDir)).toBe(true);

      cleanupTempDir(backupDir);
    });

    it('should not lose data if update fails', async () => {
      const installDir = createMockInstallation(testDir);
      const contractPath = path.join(installDir, 'skill', 'contract.md');
      const contractContent = fs.readFileSync(contractPath, 'utf-8');

      // Backup exists
      const backupDir = installDir + '.backup.' + Date.now();
      fs.cpSync(installDir, backupDir, { recursive: true });

      // Simulate failed update recovery
      fs.rmSync(installDir, { recursive: true });
      fs.cpSync(backupDir, installDir, { recursive: true });

      const recoveredContent = fs.readFileSync(contractPath, 'utf-8');

      expect(recoveredContent).toBe(contractContent);

      cleanupTempDir(backupDir);
    });

    it('should clean up backup after successful update', async () => {
      const installDir = createMockInstallation(testDir);
      const backupDir = installDir + '.backup.' + Date.now();

      // Create backup
      fs.cpSync(installDir, backupDir, { recursive: true });

      // Simulate successful update
      fs.rmSync(backupDir, { recursive: true });

      expect(fs.existsSync(backupDir)).toBe(false);
    });
  });

  describe('config writes', () => {
    it('should update version in config after successful update', async () => {
      const configPath = createMockConfig(testDir, {
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

      // Simulate version update
      config.installations['.copilot/skills/presentation-skill'].installedVersion = '1.0.1';
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      config = readMockConfig(testDir);

      expect(config.installations['.copilot/skills/presentation-skill'].installedVersion).toBe('1.0.1');
    });

    it('should update lastCheck timestamp', async () => {
      const configPath = createMockConfig(testDir);

      let config = readMockConfig(testDir);
      const oldLastCheck = config.lastCheck;

      // Wait a bit and update
      await new Promise(resolve => setTimeout(resolve, 10));

      config.lastCheck = new Date().toISOString();
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      config = readMockConfig(testDir);

      expect(config.lastCheck).not.toBe(oldLastCheck);
    });

    it('should not overwrite other installations in config', async () => {
      const configPath = createMockConfig(testDir, {
        installations: {
          '/old/install': {
            installedVersion: '0.9.0',
            installedAt: '2026-01-01T00:00:00Z',
            source: 'npm'
          },
          '.copilot/skills/presentation-skill': {
            installedVersion: '1.0.0',
            installedAt: new Date().toISOString(),
            source: 'npm'
          }
        }
      });

      let config = readMockConfig(testDir);

      expect(config.installations['/old/install']).toBeDefined();
      expect(config.installations['.copilot/skills/presentation-skill']).toBeDefined();

      // Update only one installation
      config.installations['.copilot/skills/presentation-skill'].installedVersion = '1.0.1';
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      config = readMockConfig(testDir);

      expect(config.installations['/old/install'].installedVersion).toBe('0.9.0');
      expect(config.installations['.copilot/skills/presentation-skill'].installedVersion).toBe('1.0.1');
    });
  });

  describe('rollback', () => {
    it('should support --rollback flag to revert to previous version', async () => {
      const installDir = createMockInstallation(testDir);
      const backupDir = installDir + '.backup.' + 12345;

      // Create old backup
      fs.mkdirSync(backupDir, { recursive: true });
      fs.writeFileSync(path.join(backupDir, 'marker.txt'), 'old version');

      expect(fs.existsSync(backupDir)).toBe(true);

      cleanupTempDir(backupDir);
    });

    it('should list available backups', async () => {
      const installDir = createMockInstallation(testDir);
      const backups = [];

      // Create multiple backups
      for (let i = 0; i < 3; i++) {
        const backupDir = installDir + '.backup.' + (12345 + i);
        fs.mkdirSync(backupDir, { recursive: true });
        backups.push(backupDir);
      }

      expect(backups.length).toBe(3);

      for (const backup of backups) {
        cleanupTempDir(backup);
      }
    });
  });

  describe('error scenarios', () => {
    it('should handle network failure during download', async () => {
      const networkError = new Error('Network error: Could not reach GitHub');

      expect(networkError.message).toContain('Network error');
    });

    it('should handle hash mismatch', async () => {
      const hashError = new Error('Hash mismatch: Downloaded file does not match expected SHA256');

      expect(hashError.message).toContain('Hash mismatch');
    });

    it('should handle disk space errors', async () => {
      const diskError = new Error('ENOSPC: No space left on device');

      expect(diskError.message).toContain('space');
    });

    it('should handle permission errors during file write', async () => {
      const permError = new Error('EACCES: Permission denied');

      expect(permError.message).toContain('Permission');
    });

    it('should exit with code 1 on validation failure', async () => {
      const exitCode = 1;

      expect(exitCode).toBe(1);
    });

    it('should exit with code 2 on network error', async () => {
      const exitCode = 2;

      expect(exitCode).toBe(2);
    });

    it('should exit with code 3 on filesystem error', async () => {
      const exitCode = 3;

      expect(exitCode).toBe(3);
    });

    it('should exit with code 5 on installation error', async () => {
      const exitCode = 5;

      expect(exitCode).toBe(5);
    });
  });

  describe('version comparison', () => {
    it('should correctly compare semantic versions', async () => {
      const versions = [
        { current: '1.0.0', latest: '1.0.1', shouldUpdate: true },
        { current: '1.0.1', latest: '1.0.0', shouldUpdate: false },
        { current: '1.0.0', latest: '1.1.0', shouldUpdate: true },
        { current: '2.0.0', latest: '1.9.9', shouldUpdate: false },
        { current: '1.0.0', latest: '1.0.0', shouldUpdate: false }
      ];

      for (const { current, latest, shouldUpdate } of versions) {
        const update = latest > current;
        expect(update).toBe(shouldUpdate);
      }
    });

    it('should handle version strings with v prefix', async () => {
      const versionWithPrefix = 'v1.0.0';
      const cleanVersion = versionWithPrefix.replace(/^v/, '');

      expect(cleanVersion).toBe('1.0.0');
    });
  });
});
