Curvytron
=========

A web multiplayer Tron game like with curves

## Installation

    npm install
    bower install
    gulp

## Configuration

Duplicate `config.json.sample` to `config.json`:

    cp config.json.sample config.json

## Launch server:

    node bin/curvytron.js

## Play:

Go to `http://localhost:8080/`, join a room, choose a player name and get ready!

## Configuration reference:

```
{
    # The port on wich Curvytron server will run
    "port": 8080,

    # Optional Google Analytocs Identifier
    "googleAnalyticsId": null,

    # Inspector (InfluxDb statistics):
    "inspector": {
        "enabled": false,
        # InfluxDb configuration:
        "host": "127.0.0.1",
        "port": 8086,
        "username": "root",
        "password": "root",
        "database": "curvytron"
    }
}
```

## Setting it up with Nginx:

Create a virtual host:

```
server {
    listen 80;

    server_name curvytron.acme.com;

    root /path/to/curvytron/web;
    index index.html;

    access_log  /var/log/nginx/curvytron/access.log combined;
    error_log   /var/log/nginx/curvytron/error.log;

    location / {

        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
