import { readFileSync, writeFileSync, mkdirSync, globSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const minifyOutput = process.argv.includes('--minify');
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const out = join(root, 'web', 'js', 'curvytron.js');

mkdirSync(join(root, 'web', 'js'), { recursive: true });

// First-party load order (carried over from the original Gulp client recipe).
// AbstractController and BonusManager are listed first because other files extend them.
// vendor.js is excluded — it is bundled separately by Vite into dependencies.js.
const patterns = [
    'src/shared/**/*.js',
    'src/client/controller/AbstractController.js',
    'src/client/manager/BonusManager.js',
    'src/client/*/**/*.js',
    'src/client/*.js',
    '!src/client/stressTest.js',
    '!src/client/vendor.js',
];

const seen = new Set();
const files = [];

for (const pattern of patterns) {
    if (pattern.startsWith('!')) {
        seen.add(pattern.slice(1));
        continue;
    }
    if (pattern.includes('*')) {
        const matches = globSync(pattern, { cwd: root }).sort();
        for (const f of matches) {
            if (!seen.has(f)) { seen.add(f); files.push(f); }
        }
    } else if (!seen.has(pattern)) {
        seen.add(pattern);
        files.push(pattern);
    }
}

// Drop any file that was queued before its later exclusion was registered.
const excluded = new Set(patterns.filter(p => p.startsWith('!')).map(p => p.slice(1)));
const included = files.filter(f => !excluded.has(f));

const body = included.map(f => readFileSync(join(root, f), 'utf8')).join('\n');
let wrapped = `(function(){\n"use strict";\n${body}\n})();\n`;

if (minifyOutput) {
    const { transform } = await import('esbuild');
    const result = await transform(wrapped, { minify: true });
    wrapped = result.code;
}

writeFileSync(out, wrapped);

// stressTest.js is injected standalone at runtime (see doc/dev.md), not concatenated.
copyFileSync(join(root, 'src/client/stressTest.js'), join(root, 'web', 'js', 'stressTest.js'));

console.log(`Client built → ${out} (${included.length} files${minifyOutput ? ', minified' : ''})`);
