FROM node:0.12.7
MAINTAINER Danilo Bargen <mail@dbrgn.ch>

# Choose work directory
WORKDIR /app/

# Install node packages
ADD package.json /app/
RUN npm install

# Install bower packages
ADD bower.json /app/
RUN npm install -g bower gulp
RUN bower --allow-root --force-latest install

# Run gulp tasks
ADD . /app
RUN gulp

# Add config.json
ADD config.json.docker /app/config.json

# Entry point
EXPOSE 8080
CMD ["node", "bin/curvytron.js"]
