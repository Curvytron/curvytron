var loaded = false;

function onload ()
{
    if (!loaded) {

        window.removeEventListener('load', onload);

        loaded = true;

        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        new Game();
    }
}

window.addEventListener('load', onload);