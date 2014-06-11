/**
 * LobbyRepository
 *
 * @param {Object} config
 */
function LobbyRepository(SocketClient)
{
    EventEmitter.call(this);

    this.client     = SocketClient;
    this.lobbies    = new Collection([], 'name');

    this.onNewLobby = this.onNewLobby.bind(this);

    this.client.io.on('lobby:new', this.onNewLobby);
}

LobbyRepository.prototype = Object.create(EventEmitter.prototype);

/**
 * Get all
 *
 * @return {Array}
 */
LobbyRepository.prototype.getAll = function()
{
    return this.lobbies.items;
};

// EVENTS:

/**
 * On new lobby
 *
 * @param {Object} data
 *
 * @return {Boolean}
 */
LobbyRepository.prototype.onNewLobby = function(data)
{
    console.log("onNewLobby");

    var lobby = new Lobby(data.name);

    if(this.lobbies.add(lobby)) {
        this.emit('lobby:new', lobby);
        console.log('lobby:new', lobby);
    }
};