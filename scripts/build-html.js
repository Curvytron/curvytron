import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = join(root, 'src/client/views/index.html');
const dest = join(root, 'web/index.html');

// Read the build config to decide which optional integrations to wire in.
// Prefer the local (gitignored) config.json, fall back to the tracked sample,
// and degrade gracefully to "everything off" if neither is readable.
function loadConfig() {
    for (const file of ['config.json', 'config.json.sample']) {
        try {
            return JSON.parse(readFileSync(join(root, file), 'utf8'));
        } catch (error) {
            // Try the next candidate.
        }
    }
    return {};
}

const config = loadConfig();

// Umami analytics: only emit the script when both endpoint and site id are set.
function analyticsSnippet({ umami }) {
    if (umami && umami.src && umami.websiteId) {
        return `<script defer src="${umami.src}" data-website-id="${umami.websiteId}" data-performance="true"></script>`;
    }
    return '';
}

// "Try Curvytron 2" promo banner: only emit the link when a URL is configured.
function curvytron2Snippet({ curvytron2 }) {
    if (curvytron2) {
        return `<a href="${curvytron2}" title="Try Curvytron 2!" class="curvytron2"><span>Try</span>Curvytron 2</a>`;
    }
    return '';
}

mkdirSync(join(root, 'web'), { recursive: true });

const html = readFileSync(src, 'utf8')
    .replace('<!-- Analytics -->', analyticsSnippet(config))
    .replace('<!-- Curvytron2 -->', curvytron2Snippet(config));

writeFileSync(dest, html);
console.log('HTML built → web/index.html');
