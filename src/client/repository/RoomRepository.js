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

            repository.room.config.setMaxScore(result.room.config.maxScore);

            for (var variable in result.room.config.variables) {
                if (result.room.config.variables.hasOwnProperty(variable)) {
                    repository.room.config.setVariable(variable, result.room.config.variables[variable]);
                }
            }

            for (var bonus in result.room.config.bonuses) {
                if (result.room.config.bonuses.hasOwnProperty(bonus)) {
                    repository.room.config.setBonus(bonus, result.room.config.bonuses[bonus]);
                }
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
            console.log('kickPlayer', result);
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
