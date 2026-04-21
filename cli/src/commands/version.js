import { Command } from 'commander';
import { logger } from '../lib/logger.js';
import { getInstalledVersion } from '../lib/config.js';
import { getSkillDir } from '../lib/paths.js';
import { getRuntimePackageVersion } from '../lib/runtime-package.js';

export const versionCommand = new Command()
  .name('version')
  .description('Show version information')
  .option('--check-updates', 'Check if updates are available')
  .action(async (options) => {
    try {
      const cliVersion = getRuntimePackageVersion();

      const skillDir = getSkillDir();
      let skillVersion = await getInstalledVersion(skillDir);

      if (!skillVersion) {
        skillVersion = 'not installed';
      }

      logger.info(`md2slides CLI v${cliVersion}`);

      if (skillVersion === 'not installed') {
        logger.warn(`Skill: ${skillVersion}`);
        logger.info('Run "md2slides init" to install the skill.');
      } else {
        logger.info(`Skill v${skillVersion}`);

        if (options.checkUpdates) {
          try {
            const { getLatestRelease, compareVersions } = await import(
              '../lib/github-api.js'
            );
            const latest = await getLatestRelease();
            const cmp = compareVersions(skillVersion, latest.version);

            if (cmp < 0) {
              logger.warn(
                `Update available: v${skillVersion} → v${latest.version}`
              );
              logger.info(
                'Run "md2slides update" to install the latest version.'
              );
            } else {
              logger.success(`Skill is up to date`);
            }
          } catch (err) {
            logger.debug(`Could not check for updates: ${err.message}`);
          }
        }
      }
    } catch (err) {
      logger.error(`Failed to read version: ${err.message}`);
      process.exit(1);
    }
  });
