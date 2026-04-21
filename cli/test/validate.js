#!/usr/bin/env node

/**
 * Post-Install Validation Harness for md2slides CLI
 *
 * Runs after npm install to verify:
 * - bin entry maps correctly
 * - dependencies are installed
 * - basic CLI works
 *
 * Exit codes:
 * 0 - All validations passed
 * 1 - Validation failed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const cliPath = path.join(__dirname, '..', 'src', 'index.js');

let passCount = 0;
let failCount = 0;

function log(message) {
  console.log(`  ${message}`);
}

function success(message) {
  console.log(`  ✓ ${message}`);
  passCount++;
}

function error(message) {
  console.error(`  ✖ ${message}`);
  failCount++;
}

function section(title) {
  console.log(`\n${title}`);
  console.log('─'.repeat(title.length));
}

function validateBinEntry() {
  section('1. Checking bin entry mapping');

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    if (!packageJson.bin || !packageJson.bin.md2slides) {
      error('bin.md2slides entry not found in package.json');
      return;
    }

    success(`bin.md2slides points to: ${packageJson.bin.md2slides}`);

    if (!fs.existsSync(cliPath)) {
      error(`CLI file not found at ${cliPath}`);
      return;
    }

    success(`CLI file exists at ${cliPath}`);

    // Check shebang
    const firstLine = fs.readFileSync(cliPath, 'utf-8').split('\n')[0];
    if (firstLine.includes('env node')) {
      success(`Shebang is correct: ${firstLine}`);
    } else {
      error(`Shebang missing or incorrect: ${firstLine}`);
    }
  } catch (err) {
    error(`Failed to validate bin entry: ${err.message}`);
  }
}

function validateDependencies() {
  section('2. Checking dependencies installed');

  const requiredDeps = ['commander', 'chalk', 'ora'];

  for (const dep of requiredDeps) {
    const depPath = path.join(__dirname, '..', 'node_modules', dep);

    if (!fs.existsSync(depPath)) {
      error(`Dependency not found: ${dep}`);
    } else {
      success(`Dependency installed: ${dep}`);
    }
  }
}

function validateCLIHelp() {
  section('3. Testing basic CLI functionality');

  try {
    // Test --help flag
    const output = execSync(`node ${cliPath} --help`, { encoding: 'utf-8' });

    if (output.includes('md2slides')) {
      success('`md2slides --help` works');
    } else {
      error('`md2slides --help` output unexpected');
    }

    if (output.includes('Commands:') || output.includes('Options:')) {
      success('Help output includes command info');
    } else {
      error('Help output missing command info');
    }
  } catch (err) {
    error(`Failed to run CLI --help: ${err.message}`);
  }
}

function validateCLIVersion() {
  section('4. Testing version command');

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const output = execSync(`node ${cliPath} --version`, { encoding: 'utf-8' });

    if (output.includes(packageJson.version)) {
      success('Version output contains version number');
    } else {
      error('Version output missing or unexpected');
    }
  } catch (err) {
    error(`Failed to run CLI --version: ${err.message}`);
  }
}

function validateCLIUsage() {
  section('5. Testing CLI without arguments');

  try {
    const output = execSync(`node ${cliPath}`, { encoding: 'utf-8', stdio: 'pipe' });

    if (output.includes('md2slides') || output.includes('Commands:')) {
      success('CLI displays help when run without arguments');
      success('CLI runs without crashing');
    }
  } catch (err) {
    const combinedOutput = `${err.stdout || ''}${err.stderr || ''}`;

    if (combinedOutput.includes('md2slides') || combinedOutput.includes('Commands:')) {
      success('CLI displays help when run without arguments');
      success('CLI runs without crashing');
    } else {
      error(`CLI crashed: ${err.message}`);
    }
  }
}

function validateDirectoryStructure() {
  section('6. Checking directory structure');

  const requiredDirs = [
    'src',
    'src/commands',
    'src/lib'
  ];

  for (const dir of requiredDirs) {
    const fullPath = path.join(__dirname, '..', dir);

    if (fs.existsSync(fullPath)) {
      success(`Directory exists: ${dir}`);
    } else {
      error(`Directory missing: ${dir}`);
    }
  }
}

function validateCommands() {
  section('7. Checking command modules');

  const commands = [
    'init',
    'update',
    'doctor',
    'version',
    'generate',
    'serve'
  ];

  for (const cmd of commands) {
    const cmdPath = path.join(__dirname, '..', 'src', 'commands', `${cmd}.js`);

    if (fs.existsSync(cmdPath)) {
      success(`Command module exists: ${cmd}`);
    } else {
      error(`Command module missing: ${cmd}`);
    }
  }
}

function validateLibraries() {
  section('8. Checking library modules');

  const libs = [
    'logger',
    'paths',
    'validator',
    'installer',
    'github-api',
    'config'
  ];

  for (const lib of libs) {
    const libPath = path.join(__dirname, '..', 'src', 'lib', `${lib}.js`);

    if (fs.existsSync(libPath)) {
      success(`Library module exists: ${lib}`);
    } else {
      error(`Library module missing: ${lib}`);
    }
  }
}

function validatePackageJson() {
  section('9. Validating package.json');

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    const requiredFields = ['name', 'version', 'description', 'bin', 'dependencies'];

    for (const field of requiredFields) {
      if (packageJson[field]) {
        success(`package.json has: ${field}`);
      } else {
        error(`package.json missing: ${field}`);
      }
    }

    if (packageJson.engines && packageJson.engines.node) {
      success(`Node version requirement: ${packageJson.engines.node}`);
    } else {
      error('Node version requirement not specified');
    }
  } catch (err) {
    error(`Failed to parse package.json: ${err.message}`);
  }
}

function summary() {
  console.log('\n' + '='.repeat(50));
  console.log(`Summary: ${passCount} passed, ${failCount} failed`);
  console.log('='.repeat(50));

  if (failCount === 0) {
    console.log('\n✓ CLI is ready for development!\n');
    return 0;
  } else {
    console.log(`\n✖ ${failCount} validation(s) failed. Please fix before proceeding.\n`);
    return 1;
  }
}

// Main execution
console.log('\n╔═══════════════════════════════════════════════╗');
console.log('║   md2slides CLI Post-Install Validation      ║');
console.log('╚═══════════════════════════════════════════════╝');

validateBinEntry();
validateDependencies();
validateDirectoryStructure();
validateCommands();
validateLibraries();
validatePackageJson();
validateCLIHelp();
validateCLIVersion();
validateCLIUsage();

const exitCode = summary();
process.exit(exitCode);
