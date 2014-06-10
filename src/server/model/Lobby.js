/**
 * Lobby
 */
function Lobby(name)
{
    BaseLobby.call(this, name);
}

Lobby.prototype = Object.create(BaseLobby.prototype);