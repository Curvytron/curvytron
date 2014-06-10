/**
 * Lobby Repository
 */
function LobbyRepository(socket)
{
    this.socket  = socket;
    this.lobbies = new Collection([], 'name');
}

/**
 * Create a lobby
 *
 * @param {String} first_argument
 *
 * @return {Lobby}
 */
LobbyRepository.prototype.create = function(name)
{
    var lobby = new Lobby(name);

    if (this.lobbies.add(lobby)) {
        this.socket.emit('lobby:new', lobby.name);

        return lobby;
    }
};

/**
 * Get by name
 *
 * @param {String} name
 *
 * @return {Lobby}
 */
LobbyRepository.prototype.get = function(name)
{
    return this.lobbies.getById(name);
};