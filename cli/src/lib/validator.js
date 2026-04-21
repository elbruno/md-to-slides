import fs from 'fs/promises';
import path from 'path';
import { logger } from './logger.js';

const REQUIRED_FILES = [
  'skill/contract.md',
  'templates/reveal-base.html',
  'templates/theme.css'
];

const REQUIRED_DIRS = [
  'examples'
];

export async function validateSkillDirectory(skillDir) {
  const results = {
    exists: false,
    filesPresent: [],
    filesMissing: [],
    errors: []
  };

  try {
    await fs.access(skillDir);
    results.exists = true;
  } catch {
    results.errors.push(`Installation directory not found: ${skillDir}`);
    return results;
  }

  for (const file of REQUIRED_FILES) {
    const filePath = path.join(skillDir, file);
    try {
      await fs.access(filePath);
      results.filesPresent.push(file);
    } catch {
      results.filesMissing.push(file);
    }
  }

  for (const dir of REQUIRED_DIRS) {
    const dirPath = path.join(skillDir, dir);
    try {
      const stat = await fs.stat(dirPath);
      if (stat.isDirectory()) {
        results.filesPresent.push(dir);
      } else {
        results.filesMissing.push(dir);
      }
    } catch {
      results.filesMissing.push(dir);
    }
  }

  if (results.filesMissing.length > 0) {
    results.errors.push(
      `Missing required files: ${results.filesMissing.join(', ')}`
    );
  }

  return results;
}

export async function validateConfigFile(configPath) {
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    JSON.parse(content);
    return { valid: true, error: null };
  } catch (err) {
    return {
      valid: false,
      error: `Config file invalid: ${err.message}`
    };
  }
}

export async function canReadFile(filePath) {
  try {
    await fs.access(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}
