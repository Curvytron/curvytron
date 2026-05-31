import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = join(root, 'src/client/views/index.html');
const dest = join(root, 'web/index.html');

mkdirSync(join(root, 'web'), { recursive: true });
writeFileSync(dest, readFileSync(src, 'utf8'));
console.log('HTML copied → web/index.html');
