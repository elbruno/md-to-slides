import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create a temporary test directory with optional file structure
 * @param {Object} fileStructure - Object mapping relative paths to file contents
 * @returns {string} Path to temp directory
 */
export function createTempTestDir(fileStructure = {}) {
  const tempDir = path.join(
    os.tmpdir(),
    'md2slides-test-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
  );

  fs.mkdirSync(tempDir, { recursive: true });

  for (const [filePath, content] of Object.entries(fileStructure)) {
    const fullPath = path.join(tempDir, filePath);
    const dir = path.dirname(fullPath);

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content);
  }

  return tempDir;
}

/**
 * Clean up temporary test directory
 * @param {string} tempDir - Path to temp directory
 */
export function cleanupTempDir(tempDir) {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

/**
 * Get the fixtures directory path
 * @returns {string} Path to fixtures directory
 */
export function getFixturesDir() {
  return path.join(__dirname, '..', 'fixtures');
}

/**
 * Read a fixture file
 * @param {string} filename - Fixture filename
 * @returns {string} File contents
 */
export function readFixture(filename) {
  return fs.readFileSync(path.join(getFixturesDir(), filename), 'utf-8');
}

/**
 * Create mock GitHub API responses using fetch mocking
 * @param {Object} mocks - Object mapping URLs to responses
 */
export function mockGitHubAPI(mocks) {
  global.mockFetchResponses = mocks;
}

/**
 * Get mock config directory for testing
 * @param {string} testDir - Test directory path
 * @returns {string} Path to config directory
 */
export function getConfigDir(testDir) {
  return path.join(testDir, '.md2slides');
}

/**
 * Get installation directory for testing
 * @param {string} testDir - Test directory path
 * @returns {string} Path to installation directory
 */
export function getInstallDir(testDir) {
  return path.join(testDir, '.copilot', 'skills', 'presentation-skill');
}

/**
 * Create mock installation structure
 * @param {string} baseDir - Installation base directory
 * @returns {string} Installation directory path
 */
export function createMockInstallation(baseDir) {
  const installDir = getInstallDir(baseDir);
  const structure = {
    'skill/contract.md': '# Contract',
    'templates/reveal-base.html': '<html></html>',
    'templates/theme.css': 'body {}',
    'examples/minimal-talk/input.md': '# Example',
    'examples/minimal-talk/slides.html': '<html></html>',
    'package.json': JSON.stringify({ version: '1.0.0' }, null, 2),
    'README.md': '# Installation'
  };

  for (const [filePath, content] of Object.entries(structure)) {
    const fullPath = path.join(installDir, filePath);
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content);
  }

  return installDir;
}

/**
 * Create mock config file
 * @param {string} baseDir - Config base directory
 * @param {Object} config - Config object
 */
export function createMockConfig(baseDir, config = {}) {
  const configDir = getConfigDir(baseDir);
  fs.mkdirSync(configDir, { recursive: true });

  const defaultConfig = {
    version: '1.0.0',
    lastCheck: new Date().toISOString(),
    installations: {},
    preferences: {
      checkUpdates: true,
      autoBackup: true,
      logLevel: 'info'
    }
  };

  const finalConfig = { ...defaultConfig, ...config };
  const configPath = path.join(configDir, 'config.json');

  fs.writeFileSync(configPath, JSON.stringify(finalConfig, null, 2));

  return configPath;
}

/**
 * Read config file
 * @param {string} baseDir - Config base directory
 * @returns {Object} Parsed config object
 */
export function readMockConfig(baseDir) {
  const configPath = path.join(getConfigDir(baseDir), 'config.json');

  if (!fs.existsSync(configPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

/**
 * Capture console output during test
 * @param {Function} fn - Function to execute
 * @returns {Object} { stdout, stderr, exitCode }
 */
export async function captureOutput(fn) {
  const oldLog = console.log;
  const oldError = console.error;
  const oldWarn = console.warn;
  const logs = [];
  const errors = [];
  const warnings = [];

  console.log = (...args) => logs.push(args.join(' '));
  console.error = (...args) => errors.push(args.join(' '));
  console.warn = (...args) => warnings.push(args.join(' '));

  try {
    await fn();
  } finally {
    console.log = oldLog;
    console.error = oldError;
    console.warn = oldWarn;
  }

  return {
    stdout: logs.join('\n'),
    stderr: errors.join('\n'),
    warnings: warnings.join('\n')
  };
}
