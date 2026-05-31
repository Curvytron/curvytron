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
            '@client': resolve(__dirname, './src/client'),
            '@server': resolve(__dirname, './src/server'),
            '@shared': resolve(__dirname, './src/shared'),
            '@vendor': resolve(__dirname, './src/vendor'),
            '@sass': resolve(__dirname, './src/sass'),
        },
    },
    build: {
        outDir: resolve(__dirname, 'web'),
        emptyOutDir: false,
        sourcemap: mode !== 'production',
        rollupOptions: {
            input: resolve(__dirname, 'src/client/vendor.js'),
            output: {
                format: 'iife',
                entryFileNames: 'js/dependencies.js',
            },
            // onwarn(warning, warn) {
            //     // Socket and angular are runtime globals, not missing imports
            //     if (warning.code === 'MISSING_GLOBAL_NAME') return;
            //     // Vendor files (soundjs, key-mapper) use top-level `this` expecting window
            //     if (warning.code === 'THIS_IS_UNDEFINED') return;
            //     warn(warning);
            // },
        },
        minify: mode === 'production' ? 'esbuild' : false,
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
