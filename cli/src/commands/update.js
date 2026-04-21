import { Command } from 'commander';
import { logger } from '../lib/logger.js';
import { getLatestRelease, compareVersions, getDownloadUrl } from '../lib/github-api.js';
import { installSkill } from '../lib/installer.js';
import { getSkillDir } from '../lib/paths.js';
import { getInstalledVersion, readConfig, initializeConfig } from '../lib/config.js';

export const updateCommand = new Command()
  .name('update')
  .description('Update the installed skill to a specific or latest version')
  .option('-v, --version <version>', 'Target version (default: latest)')
  .option('--no-backup', 'Skip creating backup before update')
  .action(async (options) => {
    try {
      const config = await initializeConfig();
      const skillDir = getSkillDir();
      const currentVersion = await getInstalledVersion(skillDir);

      if (!currentVersion) {
        logger.warn('No previous installation found.');
        logger.info('Run "md2slides init" to install the skill.');
        return;
      }

      let targetVersion;
      let downloadUrl;

      if (options.version) {
        targetVersion = options.version;
        downloadUrl = getDownloadUrl(`v${targetVersion}`);
        logger.info(`Targeting version: ${targetVersion}`);
      } else {
        logger.info('Checking for updates...');
        const release = await getLatestRelease();
        targetVersion = release.version;
        downloadUrl = release.downloadUrl;

        const comparison = compareVersions(currentVersion, targetVersion);
        if (comparison >= 0) {
          logger.success(`Already up to date (v${currentVersion})`);
          return;
        }

        logger.info(`Update available: ${currentVersion} → ${targetVersion}`);
      }

      logger.info(`Updating skill from v${currentVersion} to v${targetVersion}...`);

      await installSkill(targetVersion, {
        force: true,
        downloadUrl,
        backup: options.backup !== false
      });

      logger.success('Skill updated successfully!');
      logger.info(`New version: ${targetVersion}`);
    } catch (err) {
      process.exit(1);
    }
  });
