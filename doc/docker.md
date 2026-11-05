## Prerequisite

You need to install Docker.

## Building an Image

__Clone the repository__

    git clone https://github.com/Elao/curvytron.git
    cd curvytron

__Build the docker image__

    docker build -t yourname/curvytron .

## Launch server

    docker run -d --name curvytron -p 8080:8080 yourname/curvytron

## Play

Go to [http://localhost:8080](http://localhost:8080/)
Join a room, choose a player name and play!
