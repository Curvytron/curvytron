var loaded = false;

function onload ()
{
    if (!loaded) {

        window.removeEventListener('load', onload);

        loaded = true;

        new Game();
    }
}

window.addEventListener('load', onload);