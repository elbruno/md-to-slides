import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultPackageRoot = path.join(__dirname, '..', '..');

function readPackageVersion(packageJsonPath) {
  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version || null;
  } catch {
    return null;
  }
}

export function getRuntimePackageRoot() {
  return process.env.MD2SLIDES_PACKAGE_ROOT || defaultPackageRoot;
}

export function getRuntimePackageVersion() {
  return (
    process.env.MD2SLIDES_PACKAGE_VERSION ||
    readPackageVersion(path.join(getRuntimePackageRoot(), 'package.json')) ||
    readPackageVersion(path.join(defaultPackageRoot, 'package.json')) ||
    '0.0.0'
  );
}
