import js from '@eslint/js';
import globals from 'globals';

export default [
    { ignores: ['node_modules/**', 'web/**', 'bin/**', 'bower_components/**'] },

    // Build tooling: modern ES modules running on Node.
    {
        files: ['scripts/**/*.js', 'vite.config.js', 'eslint.config.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...globals.node },
        },
        rules: js.configs.recommended.rules,
    },

    // ES module browser entries: the Vite vendor entry and vendored libraries.
    {
        files: ['src/client/vendor.js', 'src/vendor/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...globals.browser },
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-undef': 'off',
            'no-unused-vars': 'warn',
        },
    },

    // First-party application code (src/client, src/shared, src/server).
    //
    // This code is NOT split into modules: it is concatenated in load order and
    // runs in a single shared scope (see doc/dev.md). Classes and third-party
    // libraries therefore resolve across files via that scope and via window
    // globals from dependencies.js — which per-file linting cannot see — so
    // `no-undef` is disabled here. The remaining recommended rules still catch
    // real bugs (unreachable code, duplicate keys, bad typeof, etc.).
    {
        files: ['src/client/**/*.js', 'src/shared/**/*.js', 'src/server/**/*.js'],
        ignores: ['src/client/vendor.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: { ...globals.browser, ...globals.node },
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-undef': 'off',
            'no-unused-vars': 'warn',
            // Legacy patterns in the 2015 codebase — surfaced as warnings, not
            // hard errors, so `make lint` stays green without rewriting game logic.
            'no-prototype-builtins': 'warn',
            'no-useless-assignment': 'warn',
        },
    },
];
