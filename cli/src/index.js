#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { updateCommand } from './commands/update.js';
import { versionCommand } from './commands/version.js';
import { doctorCommand } from './commands/doctor.js';
import { generateCommand } from './commands/generate.js';
import { serveCommand } from './commands/serve.js';
import { getRuntimePackageVersion } from './lib/runtime-package.js';

const program = new Command();

program
  .name('md2slides')
  .description('CLI tool for managing md-to-slides presentation skill')
  .version(getRuntimePackageVersion());

program.addCommand(initCommand);
program.addCommand(updateCommand);
program.addCommand(versionCommand);
program.addCommand(doctorCommand);
program.addCommand(generateCommand);
program.addCommand(serveCommand);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
