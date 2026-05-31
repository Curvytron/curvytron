import { readFileSync, writeFileSync, mkdirSync, globSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const out = join(root, 'bin', 'curvytron.cjs');

mkdirSync(join(root, 'bin'), { recursive: true });

// Load order (carried over from the original Gulp server recipe)
const patterns = [
    'src/server/dependencies.js',
    'src/shared/**/*.js',
    'src/server/*/**/*.js',
    'src/server/launcher.js',
];

const seen = new Set();
const files = [];

for (const pattern of patterns) {
    if (pattern.includes('*')) {
        const matches = globSync(pattern, { cwd: root }).sort();
        for (const f of matches) {
            if (!seen.has(f)) { seen.add(f); files.push(f); }
        }
    } else {
        if (!seen.has(pattern)) { seen.add(pattern); files.push(pattern); }
    }
}

const content = files.map(f => readFileSync(join(root, f), 'utf8')).join('\n');
writeFileSync(out, content);
console.log(`Server built → ${out} (${files.length} files)`);
