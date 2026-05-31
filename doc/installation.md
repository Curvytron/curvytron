## Prerequisite

Curvytron runs on [node.js >= v18](https://nodejs.org/) (the build uses `fs.globSync`, `node --watch-path` and Vite).
You need to install node on the machine that will run the Curvytron server.

## Installation

__Clone the repository__

    git clone https://github.com/Elao/curvytron.git
    cd curvytron

__Install dependencies__

    npm install

__Build the game__

    npm run build

This produces the production (minified) build:

* `bin/curvytron.cjs` — the server bundle
* `web/js/dependencies.js` — third-party libraries (bundled by Vite)
* `web/js/curvytron.js` — the client application
* `web/css/style.css`, `web/index.html`, `web/js/views/`

## Launch server

    npm start

## Play

Go to [http://localhost:8020/](http://localhost:8020/)
Join a room, choose a player name and play!

The port is set in `config.json` (defaults to `8020`).
