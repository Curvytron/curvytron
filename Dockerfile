FROM node:slim

ADD . /curvytron
WORKDIR /curvytron

ENV PYTHON /usr/bin/python2.7

RUN buildDeps='python2.7 make g++ git' \
    && set -x \
    && apt-get update && apt-get install -y $buildDeps --no-install-recommends \
    && npm install -g bower \
    && echo '{ "allow_root": true, "interactive": false }' > ~/.bowerrc \
    && npm install --unsafe-perm \
    && npm install -g gulp \
    && gulp \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge -y --auto-remove $buildDeps

EXPOSE 8080

CMD [ "node", "bin/curvytron.js" ]
