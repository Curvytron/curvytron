import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = join(root, 'src/client/views');
const dest = join(root, 'web/js/views');

mkdirSync(dest, { recursive: true });

for (const dir of ['chat', 'game', 'pages', 'profile', 'rooms']) {
    cpSync(join(src, dir), join(dest, dir), { recursive: true });
}

console.log('Views copied → web/js/views/');
