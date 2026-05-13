import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distPublic = path.join(root, 'dist', 'public');
const deployDir = path.join(root, 'deploy', 'hostgator', 'public_html');

if (!existsSync(distPublic)) {
  console.error('Build not found: run "pnpm vite build" first.');
  process.exit(1);
}

rmSync(path.join(root, 'deploy', 'hostgator'), { recursive: true, force: true });
mkdirSync(deployDir, { recursive: true });
cpSync(distPublic, deployDir, { recursive: true });

const readme = `# Upload para HostGator\n\n1. Compacte o conteúdo desta pasta public_html\n2. Envie para public_html do domínio rayzer.fun\n3. Confira se .htaccess foi enviado\n`;
writeFileSync(path.join(root, 'deploy', 'hostgator', 'README_UPLOAD.txt'), readme, 'utf8');

console.log('HostGator deploy package ready at deploy/hostgator/public_html');
