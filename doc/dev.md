# Development

## Structure

    src
     |- shared  # "Abstract" super classes that are meant to be extended by their equivalent on client and server side
     |- client  # Client side application
     |- server  # Server side application
     |- vendor  # Vendored third-party builds (e.g. key-mapper)

## Build

The project keeps the original "concatenation" model: first-party code is **not** split into ES modules — it is concatenated in load order and runs in a single shared scope. Only third-party libraries are bundled (by Vite).

| Command | Builds | Output |
| --- | --- | --- |
| `npm run build` | everything, minified (production) | see [installation](installation.md) |
| `npm run build:server` | concat `src/server` + `src/shared` | `bin/curvytron.cjs` |
| `npm run build:vendor` | npm libs exposed on `window` (Vite) | `web/js/dependencies.js` |
| `npm run build:client` | concat `src/shared` + `src/client` (IIFE) | `web/js/curvytron.js` |
| `npm run build:css` | compile + compress Sass | `web/css/style.css` |
| `npm run build:views` / `build:html` | copy templates | `web/...` |

To add a third-party library, import it in `src/client/vendor.js` and expose it on `window` there.

## Automatic build

Watch the sources and rebuild on the fly (unminified). Run these in separate terminals:

    npm run watch:client   # rebuilds web/js/curvytron.js on src/client + src/shared changes
    npm run watch:server   # rebuilds bin/curvytron.cjs on src/server + src/shared changes
    npm run watch:css      # rebuilds web/css/style.css on Sass changes

The vendor bundle (`dependencies.js`) rarely changes; rebuild it with `npm run build:vendor` when you touch `vendor.js`.

## Stress test

The stress test creates a room, adds 150 players in it and sets them ready so the game launches.
To use it, open your console and run:

```js
var stressTest = document.createElement('script');
stressTest.src = 'js/stressTest.js';
document.head.appendChild(stressTest);
```
