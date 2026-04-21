import chalk from 'chalk';

export class Logger {
  constructor(options = {}) {
    this.quiet = options.quiet || false;
    this.verbose = options.verbose || false;
    this.debug = options.debug || false;
  }

  error(message) {
    console.error(chalk.red(`✖ ${message}`));
  }

  warn(message) {
    if (!this.quiet) {
      console.error(chalk.yellow(`⚠ ${message}`));
    }
  }

  info(message) {
    if (!this.quiet) {
      console.log(chalk.blue(`ℹ ${message}`));
    }
  }

  success(message) {
    if (!this.quiet) {
      console.log(chalk.green(`✓ ${message}`));
    }
  }

  debug(message) {
    if (this.debug || this.verbose) {
      console.log(chalk.gray(`[DEBUG] ${message}`));
    }
  }

  table(data) {
    if (!this.quiet) {
      console.log(data);
    }
  }
}

export const logger = new Logger();
