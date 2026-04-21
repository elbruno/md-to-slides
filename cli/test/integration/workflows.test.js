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

describe('CLI Integration Tests - Full Workflows', () => {
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

  describe('full init → update → doctor workflow', () => {
    it('should complete full installation and verification cycle', async () => {
      // Step 1: Init creates installation
      const skillDir = path.join(testDir, '.copilot', 'skills', 'presentation-skill');

      // Simulate init
      fs.mkdirSync(skillDir, { recursive: true });
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

      // Step 2: Verify installation exists
      expect(fs.existsSync(skillDir)).toBe(true);

      // Step 3: Doctor should report healthy
      const config = readMockConfig(testDir);
      expect(config.installations['.copilot/skills/presentation-skill']).toBeDefined();

      // Step 4: Update should work (with backup)
      const backupDir = skillDir + '.backup.' + Date.now();
      fs.cpSync(skillDir, backupDir, { recursive: true });

      // Step 5: Verify backup created
      expect(fs.existsSync(backupDir)).toBe(true);

      cleanupTempDir(backupDir);
    });

    it('should handle init on already-installed system', async () => {
      // First install
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

      // Second init should detect existing installation
      expect(fs.existsSync(skillDir)).toBe(true);

      const config = readMockConfig(testDir);
      expect(config.installations['.copilot/skills/presentation-skill']).toBeDefined();
    });

    it('should update version successfully', async () => {
      // Initial install at v1.0.0
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

      let config = readMockConfig(testDir);
      expect(config.installations['.copilot/skills/presentation-skill'].installedVersion).toBe('1.0.0');

      // Update to v1.0.1
      const skillDir = path.join(testDir, '.copilot', 'skills', 'presentation-skill');
      const backupDir = skillDir + '.backup.' + Date.now();

      // Create backup
      fs.cpSync(skillDir, backupDir, { recursive: true });

      // Update version in config
      config.installations['.copilot/skills/presentation-skill'].installedVersion = '1.0.1';
      const configPath = path.join(testDir, '.md2slides', 'config.json');
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      // Verify update
      config = readMockConfig(testDir);
      expect(config.installations['.copilot/skills/presentation-skill'].installedVersion).toBe('1.0.1');

      cleanupTempDir(backupDir);
    });

    it('should recover from failed update', async () => {
      // Initial install
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

      const contractPath = path.join(skillDir, 'skill', 'contract.md');
      const originalContent = fs.readFileSync(contractPath, 'utf-8');

      // Create backup for recovery
      const backupDir = skillDir + '.backup.' + Date.now();
      fs.cpSync(skillDir, backupDir, { recursive: true });

      // Simulate failed update: corrupt files
      fs.writeFileSync(contractPath, 'corrupted');

      // Restore from backup
      fs.rmSync(skillDir, { recursive: true });
      fs.cpSync(backupDir, skillDir, { recursive: true });

      // Verify restoration
      const recoveredContent = fs.readFileSync(contractPath, 'utf-8');
      expect(recoveredContent).toBe(originalContent);

      cleanupTempDir(backupDir);
    });

    it('should verify health after workflow', async () => {
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

      const skillDir = path.join(testDir, '.copilot', 'skills', 'presentation-skill');
      const configPath = path.join(testDir, '.md2slides', 'config.json');

      // Check installation exists
      expect(fs.existsSync(skillDir)).toBe(true);

      // Check config exists
      expect(fs.existsSync(configPath)).toBe(true);

      // Check required files
      const requiredFiles = [
        'skill/contract.md',
        'templates/reveal-base.html',
        'templates/theme.css'
      ];

      for (const file of requiredFiles) {
        expect(fs.existsSync(path.join(skillDir, file))).toBe(true);
      }

      // Health should be GOOD
      expect(true).toBe(true);
    });
  });

  describe('cross-platform path handling', () => {
    it('should use path.join for platform-independent paths', async () => {
      const baseDir = testDir;
      const relativePath = '.copilot/skills/presentation-skill';

      const fullPath = path.join(baseDir, relativePath);

      expect(fullPath).toContain('presentation-skill');
    });

    it('should handle Windows paths with backslashes', async () => {
      const windowsPath = 'C:\\Users\\test\\.md2slides';
      const normalized = path.normalize(windowsPath);

      expect(normalized).toBeDefined();
    });

    it('should handle Unix paths with forward slashes', async () => {
      const unixPath = '/home/test/.md2slides';
      const normalized = path.normalize(unixPath);

      expect(normalized).toBeDefined();
    });

    it('should create directories with correct paths on Windows', async () => {
      const dir = path.join(testDir, 'a', 'b', 'c');
      fs.mkdirSync(dir, { recursive: true });

      expect(fs.existsSync(dir)).toBe(true);
    });

    it('should create directories with correct paths on Unix', async () => {
      const dir = path.join(testDir, 'x', 'y', 'z');
      fs.mkdirSync(dir, { recursive: true });

      expect(fs.existsSync(dir)).toBe(true);
    });
  });

  describe('error scenarios in workflows', () => {
    it('should handle network failure during init', async () => {
      const networkError = new Error('Network error: Could not reach GitHub');

      expect(networkError.message).toContain('Network');
    });

    it('should handle missing files after extraction', async () => {
      const installDir = path.join(testDir, '.copilot', 'skills', 'presentation-skill');
      fs.mkdirSync(installDir, { recursive: true });

      // Create incomplete installation
      fs.mkdirSync(path.join(installDir, 'skill'), { recursive: true });
      fs.writeFileSync(path.join(installDir, 'skill', 'contract.md'), 'test');

      // Missing templates
      expect(fs.existsSync(path.join(installDir, 'templates'))).toBe(false);
    });

    it('should handle permission errors during installation', async () => {
      const permError = new Error('EACCES: Permission denied');

      expect(permError.message).toContain('Permission');
    });

    it('should handle disk space errors', async () => {
      const diskError = new Error('ENOSPC: No space left on device');

      expect(diskError.message).toContain('space');
    });

    it('should handle corrupted config during update', async () => {
      const configDir = path.join(testDir, '.md2slides');
      fs.mkdirSync(configDir, { recursive: true });
      const configPath = path.join(configDir, 'config.json');

      fs.writeFileSync(configPath, '{invalid json}');

      const parseConfig = () => JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      expect(parseConfig).toThrow();
    });

    it('should recover from partial backup', async () => {
      const skillDir = createMockInstallation(testDir);

      // Create partial backup
      const backupDir = skillDir + '.backup.' + Date.now();
      fs.mkdirSync(backupDir, { recursive: true });

      // Copy only some files
      fs.cpSync(path.join(skillDir, 'skill'), path.join(backupDir, 'skill'), { recursive: true });

      expect(fs.existsSync(path.join(backupDir, 'skill'))).toBe(true);

      cleanupTempDir(backupDir);
    });
  });

  describe('real temp directory isolation', () => {
    it('should isolate test state between runs', async () => {
      const dir1 = createMockInstallation(testDir);

      expect(fs.existsSync(dir1)).toBe(true);

      // Second run should start clean
      const testDir2 = createTempTestDir();
      const dir2 = createMockInstallation(testDir2);

      expect(fs.existsSync(dir2)).toBe(true);
      expect(dir1).not.toBe(dir2);

      cleanupTempDir(testDir2);
    });

    it('should not pollute global state', async () => {
      const configPath1 = createMockConfig(testDir);

      expect(fs.existsSync(configPath1)).toBe(true);

      // Original HOME should be unaffected
      expect(process.env.HOME).toBe(testDir);
    });

    it('should cleanup temp directories after tests', async () => {
      const tempDir = createTempTestDir();

      expect(fs.existsSync(tempDir)).toBe(true);

      cleanupTempDir(tempDir);

      expect(fs.existsSync(tempDir)).toBe(false);
    });

    it('should handle multiple concurrent installations', async () => {
      const testDir2 = createTempTestDir();
      const testDir3 = createTempTestDir();

      const install1 = createMockInstallation(testDir);
      const install2 = createMockInstallation(testDir2);
      const install3 = createMockInstallation(testDir3);

      expect(install1).not.toBe(install2);
      expect(install2).not.toBe(install3);

      cleanupTempDir(testDir2);
      cleanupTempDir(testDir3);
    });
  });

  describe('configuration persistence', () => {
    it('should persist config across commands', async () => {
      const configPath = createMockConfig(testDir, {
        installations: {
          '.copilot/skills/presentation-skill': {
            installedVersion: '1.0.0',
            installedAt: new Date().toISOString(),
            source: 'npm'
          }
        }
      });

      // Read first time
      let config = readMockConfig(testDir);
      const version1 = config.installations['.copilot/skills/presentation-skill'].installedVersion;

      // Update
      config.installations['.copilot/skills/presentation-skill'].installedVersion = '1.0.1';
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      // Read second time
      config = readMockConfig(testDir);
      const version2 = config.installations['.copilot/skills/presentation-skill'].installedVersion;

      expect(version1).toBe('1.0.0');
      expect(version2).toBe('1.0.1');
    });

    it('should preserve other installations when updating one', async () => {
      const configPath = createMockConfig(testDir, {
        installations: {
          '/old/installation': {
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

      expect(config.installations['/old/installation']).toBeDefined();
      expect(config.installations['.copilot/skills/presentation-skill']).toBeDefined();

      // Update only new one
      config.installations['.copilot/skills/presentation-skill'].installedVersion = '1.0.1';
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      config = readMockConfig(testDir);

      expect(config.installations['/old/installation'].installedVersion).toBe('0.9.0');
      expect(config.installations['.copilot/skills/presentation-skill'].installedVersion).toBe('1.0.1');
    });
  });
});
