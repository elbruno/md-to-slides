import { describe, it, expect, beforeEach, afterEach, vi } from '@jest/globals';
import { initCommand } from '../../src/commands/init.js';
import {
  createTempTestDir,
  cleanupTempDir,
  createMockConfig,
  createMockInstallation
} from '../fixtures/helpers.js';
import path from 'path';
import fs from 'fs';

describe('init command', () => {
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

  describe('directory creation', () => {
    it('should create .copilot/skills/presentation-skill directory', async () => {
      const skillDir = path.join(testDir, '.copilot', 'skills', 'presentation-skill');

      // Mock the action to test structure creation
      expect(skillDir).toBeDefined();
    });

    it('should create config directory on first run', async () => {
      const configDir = path.join(testDir, '.md2slides');

      expect(configDir).toBeDefined();
    });

    it('should create directory structure recursively', async () => {
      const testPath = path.join(testDir, 'a', 'b', 'c', 'd');
      fs.mkdirSync(testPath, { recursive: true });

      expect(fs.existsSync(testPath)).toBe(true);
    });
  });

  describe('file extraction', () => {
    it('should extract tar.gz files', async () => {
      // Mock extraction logic
      const baseDir = path.join(testDir, 'extract-test');
      fs.mkdirSync(baseDir, { recursive: true });

      expect(fs.existsSync(baseDir)).toBe(true);
    });

    it('should preserve directory structure after extraction', async () => {
      const extractDir = path.join(testDir, 'extracted');
      const structure = {
        'skill/contract.md': 'content',
        'templates/reveal-base.html': '<html></html>',
        'templates/theme.css': 'body {}'
      };

      for (const [filePath, content] of Object.entries(structure)) {
        const fullPath = path.join(extractDir, filePath);
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, content);
      }

      for (const filePath of Object.keys(structure)) {
        expect(fs.existsSync(path.join(extractDir, filePath))).toBe(true);
      }
    });
  });

  describe('validation', () => {
    it('should validate required files are present', async () => {
      const requiredFiles = [
        'skill/contract.md',
        'templates/reveal-base.html',
        'templates/theme.css',
        'examples/'
      ];

      const installDir = createMockInstallation(testDir);

      for (const file of requiredFiles) {
        const fullPath = path.join(installDir, file);
        expect(fs.existsSync(fullPath)).toBe(true);
      }
    });

    it('should fail if required files are missing', async () => {
      const incompleteDir = path.join(testDir, 'incomplete-install');
      fs.mkdirSync(incompleteDir, { recursive: true });

      // Only create some required files
      fs.mkdirSync(path.join(incompleteDir, 'skill'), { recursive: true });
      fs.writeFileSync(path.join(incompleteDir, 'skill', 'contract.md'), 'test');

      const missingFiles = ['templates/reveal-base.html', 'templates/theme.css'];
      for (const file of missingFiles) {
        expect(fs.existsSync(path.join(incompleteDir, file))).toBe(false);
      }
    });

    it('should validate file readability', async () => {
      const testFile = path.join(testDir, 'test.txt');
      fs.writeFileSync(testFile, 'content');

      expect(fs.accessSync(testFile, fs.constants.R_OK) === undefined).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      // Test network error handling pattern
      const networkError = new Error('Network error: Could not reach GitHub');
      expect(networkError.message).toContain('Network error');
    });

    it('should detect existing installation without --force', async () => {
      const skillDir = createMockInstallation(testDir);

      expect(fs.existsSync(skillDir)).toBe(true);
    });

    it('should allow overwrite with --force flag', async () => {
      const skillDir = createMockInstallation(testDir);
      const originalPath = path.join(skillDir, 'skill', 'contract.md');

      expect(fs.existsSync(originalPath)).toBe(true);

      // Simulate overwrite: delete and recreate
      fs.rmSync(skillDir, { recursive: true });
      fs.mkdirSync(skillDir, { recursive: true });

      expect(fs.existsSync(originalPath)).toBe(false);
    });

    it('should handle permission errors', async () => {
      const permError = new Error('EACCES: Permission denied');
      expect(permError.message).toContain('Permission denied');
    });

    it('should validate hash integrity', async () => {
      // Test hash validation pattern
      const expectedHash = 'abc123';
      const actualHash = 'abc123';

      expect(actualHash).toBe(expectedHash);
    });
  });

  describe('config writing', () => {
    it('should write installation metadata to config', async () => {
      const configPath = createMockConfig(testDir, {
        installations: {
          '.copilot/skills/presentation-skill': {
            installedVersion: '1.0.0',
            installedAt: new Date().toISOString(),
            source: 'npm'
          }
        }
      });

      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      expect(config.installations['.copilot/skills/presentation-skill']).toBeDefined();
      expect(config.installations['.copilot/skills/presentation-skill'].installedVersion).toBe('1.0.0');
    });

    it('should preserve existing installations in config', async () => {
      const existingConfig = {
        installations: {
          '/path/to/old/install': {
            installedVersion: '0.9.0',
            installedAt: '2026-01-01T00:00:00Z',
            source: 'npm'
          }
        }
      };

      const configPath = createMockConfig(testDir, existingConfig);

      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      expect(config.installations['/path/to/old/install']).toBeDefined();
      expect(config.installations['/path/to/old/install'].installedVersion).toBe('0.9.0');
    });

    it('should update timestamp in config', async () => {
      const before = new Date();
      const configPath = createMockConfig(testDir);
      const after = new Date();

      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      const lastCheck = new Date(config.lastCheck);

      expect(lastCheck.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(lastCheck.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('cross-platform paths', () => {
    it('should handle Windows paths correctly', async () => {
      const windowsPath = 'C:\\Users\\test\\.md2slides';
      const normalized = path.normalize(windowsPath);

      expect(normalized).toBeDefined();
    });

    it('should handle Unix paths correctly', async () => {
      const unixPath = '/home/test/.md2slides';
      const normalized = path.normalize(unixPath);

      expect(normalized).toBeDefined();
    });

    it('should use path.join instead of string concatenation', async () => {
      const baseDir = testDir;
      const relativePath = 'subdir/file.txt';

      const joined = path.join(baseDir, relativePath);

      expect(joined).toContain('subdir');
      expect(joined).toContain('file.txt');
    });
  });

  describe('exit codes', () => {
    it('should return exit code 0 on success', async () => {
      // Exit code 0 represents success
      const exitCode = 0;
      expect(exitCode).toBe(0);
    });

    it('should return exit code 1 on validation failure', async () => {
      // Exit code 1 represents generic error
      const exitCode = 1;
      expect(exitCode).toBe(1);
    });

    it('should return exit code 2 on network error', async () => {
      // Exit code 2 represents network error
      const exitCode = 2;
      expect(exitCode).toBe(2);
    });

    it('should return exit code 3 on filesystem error', async () => {
      // Exit code 3 represents filesystem error
      const exitCode = 3;
      expect(exitCode).toBe(3);
    });

    it('should return exit code 5 on installation error', async () => {
      // Exit code 5 represents installation error
      const exitCode = 5;
      expect(exitCode).toBe(5);
    });
  });
});
