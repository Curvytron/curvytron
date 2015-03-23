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
    this.kickManager = new KickManager(this);
    this.chat        = new Chat();

    this.onPlayerJoin  = this.onPlayerJoin.bind(this);
    this.onPlayerLeave = this.onPlayerLeave.bind(this);
    this.onGame        = this.onGame.bind(this);
    this.loadRoom      = this.loadRoom.bind(this);
    this.unloadRoom    = this.unloadRoom.bind(this);
    this.onVoteNew     = this.onVoteNew.bind(this);
    this.onVoteClose   = this.onVoteClose.bind(this);
    this.onKick        = this.onKick.bind(this);
    this.checkForClose = this.checkForClose.bind(this);

    this.callbacks = {
        onTalk: function (data) { controller.onTalk(this, data[0], data[1]); },
        onPlayerAdd: function (data) { controller.onPlayerAdd(this, data[0], data[1]); },
        onPlayerRemove: function (data) { controller.onPlayerRemove(this, data[0], data[1]); },
        onReady: function (data) { controller.onReady(this, data[0], data[1]); },
        onKickVote: function (data) { controller.onKickVote(this, data[0], data[1]); },
        onName: function (data) { controller.onName(this, data[0], data[1]); },
        onColor: function (data) { controller.onColor(this, data[0], data[1]); },
        onLeave: function () { controller.onLeave(this); },
        onActivity: function () { controller.onActivity(this); },

        onConfigMaxScore: function (data) { controller.onConfigMaxScore(this, data[0], data[1]); },
        onConfigVariable:  function (data) { controller.onConfigVariable(this, data[0], data[1]); },
        onConfigBonus:  function (data) { controller.onConfigBonus(this, data[0], data[1]); }
    };

    this.loadRoom();
}

RoomController.prototype = Object.create(EventEmitter.prototype);
RoomController.prototype.constructor = RoomController;

/**
 * Time before closing an empty room
 *
 * @type {Number}
 */
RoomController.prototype.timeToClose = 5000;

/**
 * Load room
 */
RoomController.prototype.loadRoom = function()
{
    this.room.on('close', this.unloadRoom);
    this.room.on('player:join', this.onPlayerJoin);
    this.room.on('player:leave', this.onPlayerLeave);
    this.room.on('game:new', this.onGame);
    this.kickManager.on('kick', this.onKick);
    this.kickManager.on('vote:new', this.onVoteNew);
    this.kickManager.on('vote:close', this.onVoteClose);
};

/**
 * Load room
 */
RoomController.prototype.unloadRoom = function()
{
    this.room.removeListener('close', this.unloadRoom);
    this.room.removeListener('player:join', this.onPlayerJoin);
    this.room.removeListener('player:leave', this.onPlayerLeave);
    this.room.removeListener('game:new', this.onGame);
    this.kickManager.removeListener('kick', this.onKick);
    this.kickManager.removeListener('vote:new', this.onVoteNew);
    this.kickManager.removeListener('vote:close', this.onVoteClose);
    this.kickManager.clear();
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
        this.emit('client:add', { room: this.room, client: client});
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
        this.emit('client:remove', { room: this.room, client: client});
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
    client.on('activity', this.callbacks.onActivity);
    client.on('room:leave', this.callbacks.onLeave);
    client.on('room:talk', this.callbacks.onTalk);
    client.on('player:add', this.callbacks.onPlayerAdd);
    client.on('player:remove', this.callbacks.onPlayerRemove);
    client.on('player:kick', this.callbacks.onKickVote);
    client.on('room:ready', this.callbacks.onReady);
    client.on('room:color', this.callbacks.onColor);
    client.on('room:name', this.callbacks.onName);

    client.on('room:config:max-score', this.callbacks.onConfigMaxScore);
    client.on('room:config:variable', this.callbacks.onConfigVariable);
    client.on('room:config:bonus', this.callbacks.onConfigBonus);
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.detachEvents = function(client)
{
    client.removeListener('close', this.callbacks.onLeave);
    client.removeListener('activity', this.callbacks.onActivity);
    client.removeListener('room:leave', this.callbacks.onLeave);
    client.removeListener('room:talk', this.callbacks.onTalk);
    client.removeListener('player:add', this.callbacks.onPlayerAdd);
    client.removeListener('player:remove', this.callbacks.onPlayerRemove);
    client.removeListener('player:kick', this.callbacks.onKickVote);
    client.removeListener('room:ready', this.callbacks.onReady);
    client.removeListener('room:color', this.callbacks.onColor);
    client.removeListener('room:name', this.callbacks.onName);

    client.removeListener('room:config:max-score', this.callbacks.onConfigMaxScore);
    client.removeListener('room:config:variable', this.callbacks.onConfigVariable);
    client.removeListener('room:config:bonus', this.callbacks.onConfigBonus);
};

/**
 * Remove player
 *
 * @param {Player} player
 */
RoomController.prototype.removePlayer = function(player)
{
    var client = player.client;

    if (this.room.removePlayer(player) && client) {
        client.players.remove(player);

        if (!client.isPlaying()) {
            this.kickManager.removeClient(client);
        }
    }
};

/**
 * Initialise a new client
 *
 * @param {SocketClient} client
 */
RoomController.prototype.onClientAdd = function(client)
{
    var messages = this.chat.serialize(100),
        events = new Array(messages.length);

    client.players.clear();

    for (var i = messages.length - 1; i >= 0; i--) {
        events[i] = ['room:talk', messages[i]];
    }

    client.addEvents(events);

    if (this.room.game) {
        this.room.game.controller.attach(client);
        client.addEvent('room:game:start');
    }
};

/**
 * On leave room
 *
 * @param {SocketClient} client
 */
RoomController.prototype.onClientRemove = function(client)
{
    if (this.room.game) {
        this.room.game.controller.detach(client);
    }

    for (var i = client.players.items.length - 1; i >= 0; i--) {
        this.room.removePlayer(client.players.items[i]);
    }

    client.players.clear();

    if (this.room.players.isEmpty()) {
        setTimeout(this.checkForClose, this.timeToClose);
    }
};

/**
 * Check is room is empty and shoul be closed
 */
RoomController.prototype.checkForClose = function()
{
    if (this.room.players.isEmpty()) {
        this.room.close();
    }
};

// Events:

/**
 * On client leave
 *
 * @param {SocketClient} client
 */
RoomController.prototype.onLeave = function(client)
{
    this.detach(client);
};

/**
 * On client activity change
 *
 * @param {SocketClient} client
 */
RoomController.prototype.onActivity = function(client)
{
    this.socketGroup.addEvent('client:activity', {
        client: client.id,
        active: client.active
    });
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
    var name = data.name.substr(0, Player.prototype.maxLength).trim(),
        color = typeof(data.color) !== 'undefined' ? data.color : null;

    if (!name.length) {
        return callback({success: false, error: 'Invalid name.'});
    }

    if (this.room.game) {
        return callback({success: false, error: 'Game already started.'});
    }

    if (!this.room.isNameAvailable(name)) {
        return callback({success: false, error: 'This username is already used.'});
    }

    var player = new Player(client, name, color);

    this.room.addPlayer(player);
    client.players.add(player);
    this.emit('player:add', { room: this.room, player: player});
    callback({success: true});
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
        this.removePlayer(player);
        this.emit('player:remove', { room: this.room, player: player});
    }

    callback({success: player ? true : false});
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
    var message = new Message(data.content, client),
        success = this.chat.addMessage(message);

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
        color = data.color;

    if (player && player.setColor(color)) {
        callback({success: true, color: player.color});
        this.socketGroup.addEvent('player:color', { player: player.id, color: player.color });
    } else {
        callback({success: false});
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
        name = data.name.substr(0, Player.prototype.maxLength).trim();

    if (!player) {
        return callback({success: false, error: 'Unknown player: "' + name + '"'});
    }

    if (!name.length) {
        return callback({success: false, error: 'Invalid name.', name: player.name});
    }

    if (!this.room.isNameAvailable(name)) {
        return callback({success: false, error: 'This username is already used.', name: player.name});
    }

    player.setName(name);
    callback({success: true, name: player.name});
    this.socketGroup.addEvent('player:name', { player: player.id, name: player.name });
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
    } else {
        callback({success: false, error: 'Player with id "' + data.player + '" not found'});
    }
};

/**
 * On kick vote
 *
 * @param {SocketClient} client
 * @param {Object} data
 * @param {Function} callback
 */
RoomController.prototype.onKickVote = function(client, data, callback)
{
    if (client.isPlaying()) {
        var player = this.room.players.getById(data.player);

        if (player) {
            var kickVote = this.kickManager.vote(client, player);

            return callback({success: true, kicked: kickVote.hasVote(client)});
        }
    }

    return callback({success: false, kicked: false});
};

/**
 * On config maxScore
 *
 * @param {SocketClient} client
 * @param {Object} data
 * @param {Function} callback
 */
RoomController.prototype.onConfigMaxScore = function(client, data, callback)
{
    var success = client.isPlaying() && this.room.config.setMaxScore(data.maxScore);

    callback({success: success, maxScore: this.room.config.maxScore });

    if (success) {
        this.socketGroup.addEvent('room:config:max-score', { maxScore: this.room.config.maxScore });
    }
};

/**
 * On config speed
 *
 * @param {SocketClient} client
 * @param {Object} data
 * @param {Function} callback
 */
RoomController.prototype.onConfigVariable = function(client, data, callback)
{
    var success = client.isPlaying() && this.room.config.setVariable(data.variable, data.value);

    callback({success: success, value: this.room.config.getVariable(data.variable) });

    if (success) {
        this.socketGroup.addEvent('room:config:variable', {
            variable: data.variable,
            value: this.room.config.getVariable(data.variable)
        });
    }
};

/**
 * On config bonus
 *
 * @param {SocketClient} client
 * @param {Object} data
 * @param {Function} callback
 */
RoomController.prototype.onConfigBonus = function(client, data, callback)
{
    var success = client.isPlaying() && this.room.config.toggleBonus(data.bonus);

    callback({success: success, enabled: this.room.config.getBonus(data.bonus) });

    if (success) {
        this.socketGroup.addEvent('room:config:bonus', {
            bonus: data.bonus,
            enabled: this.room.config.getBonus(data.bonus)
        });
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

    if (this.room.isReady()) {
        this.room.newGame();
    }
};

/**
 * Warmup room
 *
 * @param {Room} room
 */
RoomController.prototype.onGame = function()
{
    this.socketGroup.addEvent('room:game:start');
};

/**
 * On kick
 *
 * @param {Player} player
 */
RoomController.prototype.onKick = function(player)
{
    this.removePlayer(player);
};

/**
 * On new vote
 *
 * @param {kickVote} kickVote
 */
RoomController.prototype.onVoteNew = function(kickVote)
{
    this.socketGroup.addEvent('vote:new', kickVote.serialize());
};

/**
 * On vote close
 *
 * @param {kickVote} kickVote
 */
RoomController.prototype.onVoteClose = function(kickVote)
{
    this.socketGroup.addEvent('vote:close', kickVote.serialize());
};
