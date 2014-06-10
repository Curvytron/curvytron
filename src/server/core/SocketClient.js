/**
 * Socket Client
 *
 * @param {Socket} socket
 */
function SocketClient(socket)
{
    this.id     = socket.id
    this.socket = socket;
    this.player = new Player(this, this.id);

    this.onJoinLobby = this.onJoinLobby.bind(this);
    this.onNewLobby  = this.onNewLobby.bind(this);

    this.attachEvents();

    this.socket.emit('open');
}

/**
 * Attach events
 */
SocketClient.prototype.attachEvents = function()
{
    this.socket.on('lobby:new', this.onNewLobby);
    this.socket.on('lobby:join', this.onJoinLobby);
};

/**
 * Attach events
 */
SocketClient.prototype.detachEvents = function()
{
    this.socket.off('lobby:new', this.onNewLobby);
    this.socket.off('lobby:join', this.onJoinLobby);
};

/**
 * On new lobby
 *
 * @param {String} name
 */
SocketClient.prototype.onNewLobby = function(name)
{
    console.log("onNewLobby", name);
    this.repositories.lobby.create(name);
};

/**
 * On join lobby
 *
 * @param {Object} data
 */
SocketClient.prototype.onJoinLobby = function(data)
{
    /*var lobby = this.lobbyController.get(data.lobby)
        player = new Player(this, data.player);

    lobby.addPlayer(player);*/
};