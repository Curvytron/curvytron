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

    this.playerCache = new Collection();

    this.start            = this.start.bind(this);
    this.onJoinRoom       = this.onJoinRoom.bind(this);
    this.onLeaveRoom      = this.onLeaveRoom.bind(this);
    this.onGameStart      = this.onGameStart.bind(this);
    this.onGameEnd        = this.onGameEnd.bind(this);
    this.onPlayerReady    = this.onPlayerReady.bind(this);
    this.onPlayerColor    = this.onPlayerColor.bind(this);
    this.onPlayerName     = this.onPlayerName.bind(this);
    this.onConfigMaxScore = this.onConfigMaxScore.bind(this);
    this.onConfigVariable = this.onConfigVariable.bind(this);
    this.onConfigBonus    = this.onConfigBonus.bind(this);
    this.onVote           = this.onVote.bind(this);
    this.onClientActivity = this.onClientActivity.bind(this);
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
    this.client.on('room:config:max-score', this.onConfigMaxScore);
    this.client.on('room:config:variable', this.onConfigVariable);
    this.client.on('room:config:bonus', this.onConfigBonus);
    this.client.on('vote:new', this.onVote);
    this.client.on('vote:close', this.onVote);
    this.client.on('client:activity', this.onClientActivity);
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
    this.client.off('room:config:max-score', this.onConfigMaxScore);
    this.client.off('room:config:variable', this.onConfigVariable);
    this.client.off('room:config:bonus', this.onConfigBonus);
    this.client.off('vote:new', this.onVote);
    this.client.off('vote:close', this.onVote);
    this.client.off('client:activity', this.onClientActivity);
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
            var room = repository.createRoom(result.room);
            repository.setRoom(room);
            callback({success: true, room: room});
        } else {
            callback({success: false});
        }
    });
};

/**
 * Create room rom server data
 *
 * @param {Object} data
 *
 * @return {Room}
 */
RoomRepository.prototype.createRoom = function(data)
{
    var room = new Room(data.name);

    for (var i = data.players.length - 1; i >= 0; i--) {
        room.addPlayer(new Player(
            data.players[i].id,
            data.players[i].client,
            data.players[i].name,
            data.players[i].color,
            data.players[i].ready,
            data.players[i].active
        ));
    }

    room.config.setMaxScore(data.config.maxScore);

    for (var variable in data.config.variables) {
        if (data.config.variables.hasOwnProperty(variable)) {
            room.config.setVariable(variable, data.config.variables[variable]);
        }
    }

    for (var bonus in data.config.bonuses) {
        if (data.config.bonuses.hasOwnProperty(bonus)) {
            room.config.setBonus(bonus, data.config.bonuses[bonus]);
        }
    }

    return room;
};

/**
 * Set current room
 *
 * @param {Room} room
 */
RoomRepository.prototype.setRoom = function(room)
{
    if (!this.room || !this.room.equal(room)) {
        this.room = room;
        this.emit(this.room ? 'room:join': 'room:leave');
    }
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
 * @param {Player} player
 * @param {Function} callback
 */
RoomRepository.prototype.removePlayer = function(player, callback)
{
    this.client.addEvent('player:remove', {player: player.id}, callback);
};

/**
 * Kick player
 *
 * @param {Player} player
 * @param {Function} callback
 */
RoomRepository.prototype.kickPlayer = function(player, callback)
{
    var client = this.client;

    this.client.addEvent('player:kick', { player: player.id },
        function (result) {
            player.kicked = result.kicked;
            callback(result);
        }
    );
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
    this.emit('room:leave');
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
    name = name.substr(0, Player.prototype.nameMaxLength).trim();

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

/**
 * Set config max score
 *
 * @param {Number} maxScore
 * @param {Function} callback
 */
RoomRepository.prototype.setConfigMaxScore = function(maxScore, callback)
{
    this.client.addEvent('room:config:max-score', {maxScore: parseInt(maxScore, 10)}, callback);
};

/**
 * Set config speed
 *
 * @param {Number} speed
 * @param {Function} callback
 */
RoomRepository.prototype.setConfigVariable = function(variable, value, callback)
{
    this.client.addEvent('room:config:variable', {variable: variable, value: parseFloat(value)}, callback);
};

/**
 * Set config bonus
 *
 * @param {String} bonus
 * @param {Function} callback
 */
RoomRepository.prototype.setConfigBonus = function(bonus, callback)
{
    this.client.addEvent('room:config:bonus', {bonus: bonus}, callback);
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
        player = new Player(
            data.player.id,
            data.player.client,
            data.player.name,
            data.player.color,
            data.player.ready,
            data.player.active
        );

    if (this.room.addPlayer(player)) {
        this.emit('player:join', {player: player});
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
        this.playerCache.add(player);
        this.emit('player:leave', {player: player});
    }
};

/**
 * On client changes activity
 *
 * @param {Event} e
 *
 * @return {Boolean}
 */
RoomRepository.prototype.onClientActivity = function(e)
{
    var data = e.detail;

    this.room.players.walk(function () {
        if (this.client === data.client) {
            this.active = data.active;
        }
    });

    this.emit('client:activity', data);
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
 * On config max score
 *
 * @param {Event} e
 */
RoomRepository.prototype.onConfigMaxScore = function(e)
{
    var data = e.detail;

    this.room.config.setMaxScore(data.maxScore);
    this.emit('config:max-score', {maxScore: data.maxScore});
};

/**
 * On config variable
 *
 * @param {Event} e
 */
RoomRepository.prototype.onConfigVariable = function(e)
{
    var data = e.detail;

    this.room.config.setVariable(data.variable, data.value);
    this.emit('config:variable', {variable: data.variable, value: data.value});
};

/**
 * On config bonus
 *
 * @param {Event} e
 */
RoomRepository.prototype.onConfigBonus = function(e)
{
    var data = e.detail;

    this.room.config.setBonus(data.bonus, data.enabled);
    this.emit('config:bonus', {bonus: data.bonus, enabled: data.enabled});
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
    this.emit('room:game:end');
};

/**
 * On vote
 *
 * @param {Event} e
 */
RoomRepository.prototype.onVote = function(e)
{
    console.log(e);
    var data = e.detail,
        type = e.type,
        player = this.room.players.getById(data.target);

    if (!player) {
        player = this.playerCache.getById(data.target);
    }

    if (player) {
        player.vote = type === 'vote:new';
        this.emit(type, {target: player, result: data.result});
    }
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
    this.playerCache.clear();
    this.setRoom(null);
};
