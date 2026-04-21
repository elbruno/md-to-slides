import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import https from 'https';
import { createReadStream } from 'fs';
import { createWriteStream } from 'fs';
import { createGunzip } from 'zlib';
import { extract } from 'tar';
import { logger } from './logger.js';
import { getSkillDir } from './paths.js';
import { validateSkillDirectory } from './validator.js';
import { updateInstallation } from './config.js';

export async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(destPath);

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: Failed to download`));
        return;
      }

      res.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      reject(err);
    });
  });
}

export async function extractTarGz(tarPath, destDir) {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(tarPath)
      .pipe(createGunzip())
      .pipe(extract({ cwd: destDir }));

    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

export async function createBackup(sourceDir) {
  const backupDir = `${sourceDir}.backup.${Date.now()}`;

  try {
    if (!(await directoryExists(sourceDir))) {
      return null;
    }

    await fs.mkdir(path.dirname(backupDir), { recursive: true });
    await fs.cp(sourceDir, backupDir, { recursive: true });

    logger.debug(`Created backup at ${backupDir}`);
    return backupDir;
  } catch (err) {
    logger.warn(`Failed to create backup: ${err.message}`);
    return null;
  }
}

export async function restoreBackup(backupDir, targetDir) {
  try {
    if (await directoryExists(targetDir)) {
      await fs.rm(targetDir, { recursive: true, force: true });
    }

    await fs.cp(backupDir, targetDir, { recursive: true });
    logger.success(`Restored from backup: ${targetDir}`);
  } catch (err) {
    logger.error(`Failed to restore backup: ${err.message}`);
    throw err;
  }
}

export async function directoryExists(dir) {
  try {
    const stat = await fs.stat(dir);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

export async function installSkill(version, options = {}) {
  const { force = false, downloadUrl } = options;
  const skillDir = getSkillDir();

  try {
    logger.info(`Installing skill to ${skillDir}...`);

    const exists = await directoryExists(skillDir);
    if (exists && !force) {
      throw new Error(
        `Skill already installed at ${skillDir}. Use --force to overwrite.`
      );
    }

    const backupDir = exists ? await createBackup(skillDir) : null;

    const tempDir = path.join(os.tmpdir(), `md2slides-${Date.now()}`);
    const tempTarPath = path.join(tempDir, 'skill.tar.gz');

    try {
      await fs.mkdir(tempDir, { recursive: true });

      logger.info('Downloading skill...');
      await downloadFile(downloadUrl, tempTarPath);

      logger.info('Extracting files...');
      const extractDir = path.join(tempDir, 'extract');
      await fs.mkdir(extractDir, { recursive: true });
      await extractTarGz(tempTarPath, extractDir);

      logger.info('Validating installation...');
      const validation = await validateSkillDirectory(extractDir);

      if (validation.filesMissing.length > 0) {
        throw new Error(
          `Invalid skill package. Missing: ${validation.filesMissing.join(', ')}`
        );
      }

      if (await directoryExists(skillDir)) {
        await fs.rm(skillDir, { recursive: true, force: true });
      }

      await fs.mkdir(path.dirname(skillDir), { recursive: true });
      await fs.cp(extractDir, skillDir, { recursive: true });

      await updateInstallation(skillDir, version);

      logger.success(`Skill installed successfully (v${version})`);
      return { success: true, skillDir };
    } catch (err) {
      if (backupDir) {
        logger.warn('Installation failed, restoring from backup...');
        await restoreBackup(backupDir, skillDir);
      }
      throw err;
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  } catch (err) {
    logger.error(err.message);
    throw err;
  }
}
