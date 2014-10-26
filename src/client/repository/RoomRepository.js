/**
 * RoomRepository
 *
 * @param {SocketCLient} client
 */
function RoomRepository(client)
{
    EventEmitter.call(this);

    this.client = client;
    this.room   = null;

    this.start         = this.start.bind(this);
    this.onJoinRoom    = this.onJoinRoom.bind(this);
    this.onLeaveRoom   = this.onLeaveRoom.bind(this);
    this.onGameStart   = this.onGameStart.bind(this);
    this.onGameEnd     = this.onGameEnd.bind(this);
    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.onPlayerColor = this.onPlayerColor.bind(this);
    this.onPlayerName  = this.onPlayerName.bind(this);
}

RoomRepository.prototype = Object.create(EventEmitter.prototype);
RoomRepository.prototype.constructor = RoomRepository;

/**
 * Attach events
 */
RoomRepository.prototype.attachEvents = function()
{
    this.client.on('room:join', this.onJoinRoom);
    this.client.on('room:leave', this.onLeaveRoom);
    this.client.on('room:game:start', this.onGameStart);
    this.client.on('room:game:end', this.onGameEnd);
    this.client.on('player:ready', this.onPlayerReady);
    this.client.on('player:color', this.onPlayerColor);
    this.client.on('player:name', this.onPlayerName);
};

/**
 * Attach events
 */
RoomRepository.prototype.detachEvents = function()
{
    this.client.off('room:join', this.onJoinRoom);
    this.client.off('room:leave', this.onLeaveRoom);
    this.client.off('room:game:start', this.onGameStart);
    this.client.off('room:game:end', this.onGameEnd);
    this.client.off('player:ready', this.onPlayerReady);
    this.client.off('player:color', this.onPlayerColor);
    this.client.off('player:name', this.onPlayerName);
};

/**
 * Join room
 *
 * @param {String} name
 */
RoomRepository.prototype.join = function(name, callback)
{
    var repository = this;

    if (this.room && this.room.name === name) {
        return callback({success: true, room: repository.room});
    }

    this.client.addEvent('room:join', {name: name}, function (result) {
        if (result.success) {
            repository.room = new Room(result.room.name);

            for (var i = result.room.players.length - 1; i >= 0; i--) {
                repository.room.addPlayer(new Player(
                    result.room.players[i].id,
                    result.room.players[i].client,
                    result.room.players[i].name,
                    result.room.players[i].color,
                    result.room.players[i].ready
                ));
            }

            callback({success: true, room: repository.room});
        } else {
            callback({success: false});
        }
    });
};

/**
 * Add player
 *
 * @param {String} name
 * @param {Function} callback
 */
RoomRepository.prototype.addPlayer = function(name, color, callback)
{
    this.client.addEvent('player:add', {
        name: name.substr(0, Player.prototype.maxLength),
        color: color ? color.substr(0, Player.prototype.colorMaxLength) : null
    }, callback);
};

/**
 * Remove player
 *
 * @param {Number} player
 * @param {Function} callback
 */
RoomRepository.prototype.removePlayer = function(player, callback)
{
    this.client.addEvent('player:remove', {player: player}, callback);
};

/**
 * Leave
 *
 * @param {Function} callback
 */
RoomRepository.prototype.leave = function()
{
    this.client.addEvent('room:leave');
    this.stop();
};

/**
 * Set color
 *
 * @param {Room} room
 * @param {Number} player
 * @param {String} color
 * @param {Function} callback
 */
RoomRepository.prototype.setColor = function(player, color, callback)
{
    this.client.addEvent('room:color', {
        player: player,
        color: color.substr(0, Player.prototype.colorMaxLength)
    }, callback);
};

/**
 * Set name
 *
 * @param {Room} room
 * @param {Number} player
 * @param {String} name
 * @param {Function} callback
 */
RoomRepository.prototype.setName = function(player, name, callback)
{
    name = name.substr(0, Player.prototype.nameMaxLength);

    if (name !== player.name) {
        this.client.addEvent('room:name', {player: player, name: name}, callback);
    }
};

/**
 * Set ready
 *
 * @param {Room} room
 * @param {Number} player
 * @param {Function} callback
 */
RoomRepository.prototype.setReady = function(player, callback)
{
    this.client.addEvent('room:ready', {player: player}, callback);
};

// EVENTS:

/**
 * On join room
 *
 * @param {Event} e
 *
 * @return {Boolean}
 */
RoomRepository.prototype.onJoinRoom = function(e)
{
    var data = e.detail,
        player = new Player(data.player.id, data.player.client, data.player.name, data.player.color);

    if (this.room.addPlayer(player)) {
        this.emit('room:join', {player: player});
    }
};

/**
 * On leave room
 *
 * @param {Event} e
 *
 * @return {Boolean}
 */
RoomRepository.prototype.onLeaveRoom = function(e)
{
    var data = e.detail,
        player = this.room.players.getById(data.player);

    if (player && this.room.removePlayer(player)) {
        this.emit('room:leave', {player: player});
    }
};

/**
 * On player change color
 *
 * @param {Event} e
 */
RoomRepository.prototype.onPlayerColor = function(e)
{
    var data = e.detail,
        player = this.room.players.getById(data.player);

    if (player) {
        player.setColor(data.color);
        this.emit('player:color', {player: player});
    }
};

/**
 * On player change name
 *
 * @param {Event} e
 */
RoomRepository.prototype.onPlayerName = function(e)
{
    var data = e.detail,
        player = this.room.players.getById(data.player);

    if (player) {
        player.setName(data.name);
        this.emit('player:name', {player: player});
    }
};

/**
 * On player toggle ready
 *
 * @param {Event} e
 */
RoomRepository.prototype.onPlayerReady = function(e)
{
    var data = e.detail,
        player = this.room.players.getById(data.player);

    if (player) {
        player.toggleReady(data.ready);
        this.emit('player:ready', {player: player});
    }
};

/**
 * On room game start
 *
 * @param {Event} e
 */
RoomRepository.prototype.onGameStart = function(e)
{
    this.emit('room:game:start');
};

/**
 * On room game end
 *
 * @param {Event} e
 */
RoomRepository.prototype.onGameEnd = function(e)
{
    var data = e.detail;

    this.emit('room:game:end');
};

/**
 * Start
 */
RoomRepository.prototype.start = function()
{
    if (this.client.connected) {
        this.attachEvents();
    } else {
        this.client.on('connected', this.start);
    }
};

/**
 * Pause
 */
RoomRepository.prototype.stop = function()
{
    this.detachEvents();
    this.room = null;
};
