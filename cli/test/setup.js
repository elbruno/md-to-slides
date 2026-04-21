import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DEBUG = '0'; // Suppress debug output during tests

// Global test utilities
global.__dirname = __dirname;
global.__filename = __filename;

// Store original console methods for debugging in tests
global.originalConsole = { ...console };

// Test helper: get temp test directory
export function getTempTestDir() {
  return path.join(os.tmpdir(), 'md2slides-test-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9));
}
