# Development

## Structure

    src
     |- shared  # "Abstract" super class that are meant to be extended by their equivalent on client and server side
     |- client  # Client side application
     |- server  # Server side application

## Automatic build

You can automatically watch for changes in the sources and have gulp rebuild the game on the fly.
Launch gulp watch task with:

    gulp watch

## Stress test

The stress test creates a room, adds 150 players in it and set them ready so the game launch.
Tu use it, open your console an run:

```js
var stressTest = document.createElement('script');
stressTest.src = 'js/stressTest.js';
document.head.appendChild(stressTest);
```
