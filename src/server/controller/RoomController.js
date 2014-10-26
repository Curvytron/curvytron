/**
 * Room Controller
 *
 * @param {Room} room
 */
function RoomController(room)
{
    EventEmitter.call(this);

    var controller = this;

    this.room        = room;
    this.clients     = new Collection();
    this.socketGroup = new SocketGroup(this.clients);

    this.onPlayerJoin  = this.onPlayerJoin.bind(this);
    this.onPlayerLeave = this.onPlayerLeave.bind(this);
    this.onGame        = this.onGame.bind(this);
    this.onGameEnd     = this.onGameEnd.bind(this);
    this.loadRoom      = this.loadRoom.bind(this);
    this.unloadRoom    = this.unloadRoom.bind(this);

    this.callbacks = {
        onTalk: function (data) { controller.onTalk(this, data.data, data.callback); },
        onPlayerAdd: function (data) { controller.onPlayerAdd(this, data.data, data.callback); },
        onPlayerRemove: function (data) { controller.onPlayerRemove(this, data.data, data.callback); },
        onReady: function (data) { controller.onReady(this, data.data, data.callback); },
        onName: function (data) { controller.onName(this, data.data, data.callback); },
        onColor: function (data) { controller.onColor(this, data.data, data.callback); },
        onLeave: function () { controller.onLeave(this); }
    };

    this.loadRoom();
}

RoomController.prototype = Object.create(EventEmitter.prototype);
RoomController.prototype.constructor = RoomController;

/**
 * Load room
 */
RoomController.prototype.loadRoom = function()
{
    this.room.on('close', this.unloadRoom);
    this.room.on('player:join', this.onPlayerJoin);
    this.room.on('player:leave', this.onPlayerLeave);
    this.room.on('game:new', this.onGame);
    this.room.on('game:end', this.onGameEnd);
};

/**
 * Load room
 */
RoomController.prototype.unloadRoom = function()
{
    this.room.removeListener('player:join', this.onPlayerJoin);
    this.room.removeListener('player:leave', this.onPlayerLeave);
    this.room.removeListener('game:new', this.onGame);
    this.room.removeListener('game:end', this.onGameEnd);
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.attach = function(client)
{
    if (this.clients.add(client)) {
        this.attachEvents(client);
        this.onClientAdd(client);
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.detach = function(client)
{
    if (this.clients.remove(client)) {
        this.detachEvents(client);
        this.onClientRemove(client);
    }
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.attachEvents = function(client)
{
    client.on('close', this.callbacks.onLeave);
    client.on('room:leave', this.callbacks.onLeave);
    client.on('room:talk', this.callbacks.onTalk);
    client.on('player:add', this.callbacks.onPlayerAdd);
    client.on('player:remove', this.callbacks.onPlayerRemove);
    client.on('room:ready', this.callbacks.onReady);
    client.on('room:color', this.callbacks.onColor);
    client.on('room:name', this.callbacks.onName);
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.detachEvents = function(client)
{
    client.removeListener('close', this.callbacks.onLeave);
    client.removeListener('room:leave', this.callbacks.onLeave);
    client.removeListener('room:talk', this.callbacks.onTalk);
    client.removeListener('player:add', this.callbacks.onPlayerAdd);
    client.removeListener('player:remove', this.callbacks.onPlayerRemove);
    client.removeListener('room:ready', this.callbacks.onReady);
    client.removeListener('room:color', this.callbacks.onColor);
    client.removeListener('room:name', this.callbacks.onName);
};

/**
 * Initialise a new client
 *
 * @param {SocketClient} client
 */
RoomController.prototype.onClientAdd = function(client)
{
    var events = [];

    client.players.clear();

    if (this.room.game) {
        /*this.detach(client);
        client.on('room:talk', this.callbacks.onTalk);*/
        this.room.game.controller.attach(client);
        this.socketGroup.addEvent('room:game:start');
    }
};

/**
 * On leave room
 *
 * @param {SocketClient} client
 */
RoomController.prototype.onClientRemove = function(client)
{
    for (var i = client.players.items.length - 1; i >= 0; i--) {
        this.room.removePlayer(client.players.items[i]);
    }

    client.players.clear();

    if (this.clients.isEmpty()) {
        this.room.close();
    }
};

// Events:

RoomController.prototype.onLeave = function(client)
{
    this.detach(client);
};

/**
 * On add player to room
 *
 * @param {SocketClient} client
 * @param {Object} data
 * @param {Function} callback
 */
RoomController.prototype.onPlayerAdd = function(client, data, callback)
{
    var name = data.name.substr(0, Player.prototype.maxLength);

    if (this.room.isNameAvailable(name)) {

        var player = new Player(client, name);

        if (typeof(data.color) !== 'undefined' && data.color && player.validateColor(data.color)) {
            player.setColor(data.color.toLowerCase());
        }

        this.room.addPlayer(player);
        client.players.add(player);
        callback({success: true});
    } else {
        callback({success: false});
    }
};

/**
 * On remove player from room
 *
 * @param {SocketClient} client
 * @param {Object} data
 * @param {Function} callback
 */
RoomController.prototype.onPlayerRemove = function(client, data, callback)
{
    var player = client.players.getById(data.player);

    if (player) {
        this.room.removePlayer(player);
        client.players.remove(player);
        callback({success: true});
    } else {
        callback({success: false});
    }
};

/**
 * On talk
 *
 * @param {SocketClient} client
 * @param {Object} data
 * @param {Function} callback
 */
RoomController.prototype.onTalk = function(client, data, callback)
{
    var message = new Message(client.players.getById(data.player), data.content),
        success = message.content.length;

    callback({success: success});

    if (success) {
        this.socketGroup.addEvent('room:talk', message.serialize());
    }
};

/**
 * On player change color
 *
 * @param {SocketClient} client
 * @param {Object} data
 * @param {Function} callback
 */
RoomController.prototype.onColor = function(client, data, callback)
{
    var player = client.players.getById(data.player),
        color = data.color.toLowerCase();

    if (player && player.validateColor(color)) {
        player.setColor(color);
        callback({success: true, color: player.color});
        this.socketGroup.addEvent('player:color', { player: player.id, color: player.color });
    } else {
        callback({success: false, color: player.color});
    }
};

/**
 * On player change name
 *
 * @param {SocketClient} client
 * @param {Object} data
 * @param {Function} callback
 */
RoomController.prototype.onName = function(client, data, callback)
{
    var player = client.players.getById(data.player),
        name = data.name.substr(0, Player.prototype.maxLength);

    if (this.room.isNameAvailable(name)) {
        player.setName(name);
        callback({success: true, name: player.name});
        this.socketGroup.addEvent('player:name', { player: player.id, name: player.name });
    } else {
        callback({success: false, name: player.name});
    }
};

/**
 * On player ready
 *
 * @param {SocketClient} client
 * @param {Object} data
 * @param {Function} callback
 */
RoomController.prototype.onReady = function(client, data, callback)
{
    var player = client.players.getById(data.player);

    if (player) {
        player.toggleReady();

        callback({success: true, ready: player.ready});
        this.socketGroup.addEvent('player:ready', { player: player.id, ready: player.ready });

        if (this.room.isReady()) {
            this.room.newGame();
        }
    }
};

/**
 * On player join
 *
 * @param {Object} data
 */
RoomController.prototype.onPlayerJoin = function(data)
{
    this.socketGroup.addEvent('room:join', {player: data.player.serialize()});
};

/**
 * On player leave
 *
 * @param {Object} data
 */
RoomController.prototype.onPlayerLeave = function(data)
{
    this.socketGroup.addEvent('room:leave', {player: data.player.id});
};

/**
 * Warmup room
 *
 * @param {Room} room
 */
RoomController.prototype.onGame = function()
{
    this.socketGroup.addEvent('room:game:start');

    //this.game.on('end', this.endGame);
};

/**
 * End game
 *
 * @param {Object} data
 */
RoomController.prototype.onGameEnd = function(data)
{
    /*this.socketGroup.addEvent('room:game:end', {room: room.name});

    this.gameController.removeGame(game);

    for (var i = room.clients.items.length - 1; i >= 0; i--) {
        this.emitAllRooms(room.clients.items[i]);
    }

    room.closeGame();*/
};
