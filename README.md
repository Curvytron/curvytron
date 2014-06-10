Curvytron
=========

A web multiplayer Tron game like with curves

## Installation

    npm install
    bower install
    gulp

__Sample Vhost config:__

    <VirtualHost *:80>
            ServerAdmin thomas.jarrand@gmail.comm
            ServerName curvytron.dev

            DocumentRoot /Users/tom32i/Sites/curvytron/web

            <Location /socket.io/>
                ProxyPass http://127.0.0.1:3000/socket.io/
                ProxyPassReverse http://127.0.0.1:3000/socket.io/
            </Location>

            <Directory /Users/tom32i/Sites/curvytron/web>
                    Options Indexes FollowSymLinks MultiViews
                    AllowOverride All
                    Order Allow,Deny
                    Allow from all
            </Directory>
    </VirtualHost>

## Launch server:

    node bin/curvytron.js