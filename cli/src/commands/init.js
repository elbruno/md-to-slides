import { Command } from 'commander';
import { logger } from '../lib/logger.js';
import { getLatestRelease, getDownloadUrl } from '../lib/github-api.js';
import { installSkill } from '../lib/installer.js';
import { getSkillDir } from '../lib/paths.js';
import { initializeConfig } from '../lib/config.js';

export const initCommand = new Command()
  .name('init')
  .description('Initialize the presentation skill in current repository')
  .option('-v, --version <version>', 'Specific version to install (default: latest)')
  .option('-f, --force', 'Overwrite existing installation')
  .action(async (options) => {
    try {
      await initializeConfig();

      let version;
      let downloadUrl;

      if (options.version) {
        version = options.version;
        downloadUrl = getDownloadUrl(`v${version}`);
        logger.info(`Using specified version: ${version}`);
      } else {
        logger.info('Fetching latest release...');
        const release = await getLatestRelease();
        version = release.version;
        downloadUrl = release.downloadUrl;
        logger.info(`Latest version: ${version}`);
      }

      await installSkill(version, {
        force: options.force,
        downloadUrl
      });

      const skillDir = getSkillDir();
      logger.info('');
      logger.success('Skill initialized successfully!');
      logger.info('');
      logger.info(`Next steps:`);
      logger.info(`  1. Create a markdown file with your presentation outline`);
      logger.info(`  2. Run: md2slides generate <file.md>`);
      logger.info(`  3. Open the generated slides.html in your browser`);
      logger.info('');
      logger.info(`Skill location: ${skillDir}`);
      logger.info(`Run 'md2slides doctor' to verify installation`);
    } catch (err) {
      process.exit(1);
    }
  });
