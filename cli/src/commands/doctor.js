import { Command } from 'commander';
import { logger } from '../lib/logger.js';
import { getSkillDir, getConfigPath } from '../lib/paths.js';
import { validateSkillDirectory, validateConfigFile, canReadFile } from '../lib/validator.js';
import { getInstalledVersion, readConfig, initializeConfig } from '../lib/config.js';
import { getLatestRelease, compareVersions } from '../lib/github-api.js';
import chalk from 'chalk';

export const doctorCommand = new Command()
  .name('doctor')
  .description('Diagnose setup and installation health')
  .option('-v, --verbose', 'Show detailed diagnostics')
  .option('--json', 'Output results as JSON')
  .action(async (options) => {
    try {
      const skillDir = getSkillDir();
      const configPath = getConfigPath();
      const results = {
        checks: {},
        status: 'good',
        errors: [],
        warnings: [],
        details: []
      };

      logger.info('Running health checks...');
      logger.info('');

      // Check 1: Installation directory exists
      const dirValidation = await validateSkillDirectory(skillDir);
      results.checks.installationExists = dirValidation.exists;
      if (!dirValidation.exists) {
        results.status = 'error';
        results.errors.push(`Installation not found at ${skillDir}`);
        logger.error(`Installation directory does not exist`);
      } else {
        logger.success(`Installation found at ${skillDir}`);
      }

      // Check 2: Required files
      if (dirValidation.exists) {
        results.checks.requiredFilesCount = dirValidation.filesPresent.length;
        if (dirValidation.filesMissing.length > 0) {
          results.status = 'warning';
          results.warnings.push(
            `Missing files: ${dirValidation.filesMissing.join(', ')}`
          );
          logger.warn(`Missing ${dirValidation.filesMissing.length} required files`);
        } else {
          logger.success(`All required files present (${dirValidation.filesPresent.length})`);
        }
      }

      // Check 3: Config file
      try {
        const config = await initializeConfig();
        const configValidation = await validateConfigFile(configPath);
        results.checks.configValid = configValidation.valid;

        if (!configValidation.valid) {
          results.status = 'warning';
          results.warnings.push(configValidation.error);
          logger.warn(`Config file issue: ${configValidation.error}`);
        } else {
          logger.success(`Config file valid`);
        }
      } catch (err) {
        logger.warn(`Config initialization issue`);
        results.checks.configValid = false;
      }

      // Check 4: Installed version
      const installedVersion = await getInstalledVersion(skillDir);
      results.checks.installedVersion = installedVersion || 'unknown';
      if (installedVersion) {
        logger.success(`Installed version: v${installedVersion}`);
      } else {
        logger.warn(`Version information not available`);
      }

      // Check 5: Latest version (with offline fallback)
      try {
        const latest = await getLatestRelease();
        results.checks.latestVersion = latest.version;
        if (installedVersion) {
          const cmp = compareVersions(installedVersion, latest.version);
          if (cmp < 0) {
            results.warnings.push(
              `Update available: v${installedVersion} → v${latest.version}`
            );
            logger.warn(`Update available: v${installedVersion} → v${latest.version}`);
          } else {
            logger.success(`Up to date`);
          }
        }
      } catch (err) {
        results.checks.latestVersion = 'unknown (offline)';
        logger.warn(`Could not check for updates (no internet connection)`);
      }

      // Summary
      logger.info('');
      logger.info('─'.repeat(50));

      if (results.status === 'error') {
        logger.error(`Status: ${results.status.toUpperCase()}`);
        logger.info('');
        logger.info('To fix:');
        logger.info('  1. Run: md2slides init');
        logger.info('  2. Verify network connection');
      } else if (results.status === 'warning') {
        logger.warn(`Status: ${results.status.toUpperCase()}`);
        if (results.warnings.length > 0) {
          logger.info('');
          logger.info('Warnings:');
          results.warnings.forEach(w => logger.info(`  • ${w}`));
        }
      } else {
        logger.success(`Status: ${results.status.toUpperCase()}`);
      }

      logger.info('');

      if (options.json) {
        console.log(JSON.stringify(results, null, 2));
      }
    } catch (err) {
      logger.error(`Diagnostic failed: ${err.message}`);
      process.exit(1);
    }
  });
