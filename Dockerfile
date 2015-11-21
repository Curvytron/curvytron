FROM node:slim

RUN apt-get update && apt-get install -y python2.7 make g++ git --no-install-recommends

ENV PYTHON /usr/bin/python2.7

RUN npm install -g bower gulp
RUN echo '{ "allow_root": true, "interactive": false }' > ~/.bowerrc

ADD . /curvytron
WORKDIR /curvytron

RUN npm install --unsafe-perm
RUN gulp

EXPOSE 8080

CMD [ "node", "bin/curvytron.js" ]
