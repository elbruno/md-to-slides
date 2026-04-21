#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const packageRoot = path.join(__dirname, '..');
const packageJsonPath = path.join(packageRoot, 'package.json');
const cliEntrypoint = pathToFileURL(
  path.join(packageRoot, 'cli', 'src', 'index.js')
).href;

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

process.env.MD2SLIDES_PACKAGE_ROOT ??= packageRoot;
process.env.MD2SLIDES_PACKAGE_VERSION ??= packageJson.version;

import(cliEntrypoint).catch((error) => {
  console.error(error?.stack ?? error?.message ?? error);
  process.exit(1);
});
