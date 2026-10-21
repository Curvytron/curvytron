import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => ({
    plugins: [
        {
            // soundjs-0.6.2 uses `this.createjs` at the top level of its factory,
            // expecting `this` to be `window`. Rollup replaces top-level module `this`
            // with `undefined`, causing a crash. Fix it before Rollup sees it.
            name: 'fix-legacy-this',
            transform(code, id) {
                if (id.includes('soundjs')) {
                    return { code: code.replace(/\bthis\.createjs\b/g, 'window.createjs'), map: null };
                }
            },
        },
    ],
    resolve: {
        alias: {
            '@client': resolve(import.meta.dirname, './src/client'),
            '@server': resolve(import.meta.dirname, './src/server'),
            '@shared': resolve(import.meta.dirname, './src/shared'),
            '@vendor': resolve(import.meta.dirname, './src/vendor'),
            '@sass': resolve(import.meta.dirname, './src/sass'),
        },
    },
    build: {
        outDir: resolve(import.meta.dirname, 'web'),
        emptyOutDir: false,
        sourcemap: mode !== 'production',
        rollupOptions: {
            input: resolve(import.meta.dirname, 'src/client/vendor.js'),
            output: {
                format: 'iife',
                entryFileNames: 'js/dependencies.js',
            },
        },
        minify: mode === 'production',
    },
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ['import'],
            },
        },
    },
    optimizeDeps: {
        exclude: ['key-mapper.js'],
    },
}));
