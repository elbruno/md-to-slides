import fs from 'fs/promises';
import path from 'path';
import { logger } from './logger.js';
import { getConfigDir } from './paths.js';
import { getRuntimePackageVersion } from './runtime-package.js';

const CONFIG_VERSION = getRuntimePackageVersion();

export async function initializeConfig() {
  const configDir = getConfigDir();
  const configPath = path.join(configDir, 'config.json');

  try {
    await fs.access(configPath);
    return await readConfig();
  } catch {
    const defaultConfig = {
      version: CONFIG_VERSION,
      lastCheck: new Date().toISOString(),
      installations: {},
      preferences: {
        checkUpdates: true,
        autoBackup: true,
        logLevel: 'info'
      }
    };

    try {
      await fs.mkdir(configDir, { recursive: true });
      await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
      return defaultConfig;
    } catch (err) {
      logger.error(`Failed to create config directory: ${err.message}`);
      throw err;
    }
  }
}

export async function readConfig() {
  const configPath = path.join(getConfigDir(), 'config.json');

  try {
    const content = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    logger.error(`Failed to read config: ${err.message}`);
    throw err;
  }
}

export async function writeConfig(config) {
  const configPath = path.join(getConfigDir(), 'config.json');

  try {
    await fs.mkdir(path.dirname(configPath), { recursive: true });
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  } catch (err) {
    logger.error(`Failed to write config: ${err.message}`);
    throw err;
  }
}

export async function updateInstallation(skillDir, version, source = 'npm') {
  const config = await readConfig();

  if (!config.installations) {
    config.installations = {};
  }

  config.installations[skillDir] = {
    installedVersion: version,
    installedAt: new Date().toISOString(),
    source
  };

  config.lastCheck = new Date().toISOString();

  await writeConfig(config);
}

export async function getInstalledVersion(skillDir) {
  try {
    const config = await readConfig();
    const installation = config.installations?.[skillDir];
    return installation?.installedVersion || null;
  } catch {
    return null;
  }
}
