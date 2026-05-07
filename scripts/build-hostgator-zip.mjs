import { existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const packageDir = path.join(root, 'deploy', 'hostgator', 'public_html');
const zipFile = path.join(root, 'deploy', 'hostgator', 'rayzer-fun-public_html.zip');

if (!existsSync(packageDir)) {
  console.error('Deploy folder not found: run "pnpm run deploy:hostgator" first.');
  process.exit(1);
}

rmSync(zipFile, { force: true });

const result = spawnSync('zip', ['-r', zipFile, '.'], {
  cwd: packageDir,
  stdio: 'inherit',
});

if (result.status !== 0) {
  console.error('Unable to create zip file. Ensure "zip" is installed.');
  process.exit(result.status ?? 1);
}

console.log(`Zip ready: ${zipFile}`);
