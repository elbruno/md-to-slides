import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultCliRoot = path.join(__dirname, '..', '..');

export function getConfigDir() {
  return path.join(os.homedir(), '.md2slides');
}

export function getConfigPath() {
  return path.join(getConfigDir(), 'config.json');
}

export function getSkillDir(repoRoot = process.cwd()) {
  return path.join(repoRoot, '.copilot', 'skills', 'presentation-skill');
}

export function getCLIRoot() {
  return process.env.MD2SLIDES_PACKAGE_ROOT || defaultCliRoot;
}

export function getPackageJsonPath() {
  return path.join(getCLIRoot(), 'package.json');
}
