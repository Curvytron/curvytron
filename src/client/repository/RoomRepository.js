/**
 * RoomRepository
 *
 * @param {SocketCLient} client
 */
function RoomRepository(client)
{
    EventEmitter.call(this);

    this.client      = client;
    this.room        = null;
    this.master      = null;
    this.clients     = new Collection();
    this.playerCache = new Collection();

    this.start            = this.start.bind(this);
    this.onClientAdd      = this.onClientAdd.bind(this);
    this.onClientRemove   = this.onClientRemove.bind(this);
    this.onRoomMaster     = this.onRoomMaster.bind(this);
    this.onJoinRoom       = this.onJoinRoom.bind(this);
    this.onLeaveRoom      = this.onLeaveRoom.bind(this);
    this.onGameStart      = this.onGameStart.bind(this);
    this.onPlayerReady    = this.onPlayerReady.bind(this);
    this.onPlayerColor    = this.onPlayerColor.bind(this);
    this.onPlayerName     = this.onPlayerName.bind(this);
    this.onConfigOpen     = this.onConfigOpen.bind(this);
    this.onConfigMaxScore = this.onConfigMaxScore.bind(this);
    this.onConfigVariable = this.onConfigVariable.bind(this);
    this.onConfigBonus    = this.onConfigBonus.bind(this);
    this.onKick           = this.onKick.bind(this);
    this.onVote           = this.onVote.bind(this);
    this.onClientActivity = this.onClientActivity.bind(this);
    this.forwardEvent     = this.forwardEvent.bind(this);
}

RoomRepository.prototype = Object.create(EventEmitter.prototype);
RoomRepository.prototype.constructor = RoomRepository;

/**
 * Attach events
 */
RoomRepository.prototype.attachEvents = function()
{
    this.client.on('client:add', this.onClientAdd);
    this.client.on('client:remove', this.onClientRemove);
    this.client.on('room:master', this.onRoomMaster);
    this.client.on('room:join', this.onJoinRoom);
    this.client.on('room:leave', this.onLeaveRoom);
    this.client.on('room:game:start', this.onGameStart);
    this.client.on('player:ready', this.onPlayerReady);
    this.client.on('player:color', this.onPlayerColor);
    this.client.on('player:name', this.onPlayerName);
    this.client.on('room:config:open', this.onConfigOpen);
    this.client.on('room:config:max-score', this.onConfigMaxScore);
    this.client.on('room:config:variable', this.onConfigVariable);
    this.client.on('room:config:bonus', this.onConfigBonus);
    this.client.on('room:launch:start', this.forwardEvent);
    this.client.on('room:launch:cancel', this.forwardEvent);
    this.client.on('room:kick', this.onKick);
    this.client.on('vote:new', this.onVote);
    this.client.on('vote:close', this.onVote);
    this.client.on('client:activity', this.onClientActivity);
};

/**
 * Attach events
 */
RoomRepository.prototype.detachEvents = function()
{
    this.client.off('client:add', this.onClientAdd);
    this.client.off('client:remove', this.onClientRemove);
    this.client.off('room:master', this.onRoomMaster);
    this.client.off('room:join', this.onJoinRoom);
    this.client.off('room:leave', this.onLeaveRoom);
    this.client.off('room:game:start', this.onGameStart);
    this.client.off('player:ready', this.onPlayerReady);
    this.client.off('player:color', this.onPlayerColor);
    this.client.off('player:name', this.onPlayerName);
    this.client.off('room:config:open', this.onConfigOpen);
    this.client.off('room:config:max-score', this.onConfigMaxScore);
    this.client.off('room:config:variable', this.onConfigVariable);
    this.client.off('room:config:bonus', this.onConfigBonus);
    this.client.off('room:launch:start', this.forwardEvent);
    this.client.off('room:launch:cancel', this.forwardEvent);
    this.client.off('room:kick', this.onKick);
    this.client.off('vote:new', this.onVote);
    this.client.off('vote:close', this.onVote);
    this.client.off('client:activity', this.onClientActivity);
};

/**
 * Join room
 *
 * @param {String} name
 * @param {String} password
 * @param {Function} callback
 */
RoomRepository.prototype.join = function(name, password, callback)
{
    var repository = this;

    if (this.room && this.room.name === name) {
        return callback({success: true, room: repository.room});
    }

    this.client.addEvent('room:join', {name: name, password: password}, function (result) {
        if (result.success) {
            var clients  = repository.createClients(result.clients),
                master   = clients.getById(result.master),
                room     = repository.createRoom(result.room, clients),
                messages = result.messages.length;

            repository.setRoom(room, clients, master);
            callback({success: true, room: room});

            for (var m = 0; m < messages; m++) {
                repository.client.emit('room:talk', result.messages[m]);
            }

            for (var v = result.votes.length - 1; v >= 0; v--) {
                repository.client.emit('vote:new', result.votes[v]);
            }
        } else {
            callback({
                success: false,
                name: name,
                error: typeof(result.error) !== 'undefined' ? result.error : 'Unknown error'
            });
        }
    });
};

/**
 * Create clients
 *
 * @param {Array} data
 *
 * @return {return}
 */
RoomRepository.prototype.createClients = function(data)
{
    var clients = new Collection();

    for (var i = data.length - 1; i >= 0; i--) {
        clients.add(new Client(data[i].id, data[i].active));
    }

    return clients;
};

/**
 * Create room rom server data
 *
 * @param {Object} data
 * @param {Collection} clients
 *
 * @return {Room}
 */
RoomRepository.prototype.createRoom = function(data, clients)
{
    var room = new Room(data.name),
        length = data.players.length;

    for (var client, i =  0; i < length; i++) {
        client = clients.getById(data.players[i].client);

        if (client) {
            room.addPlayer(new Player(
                data.players[i].id,
                client,
                data.players[i].name,
                data.players[i].color,
                data.players[i].ready
            ));
        } else {
            console.error('Could not find a client:', data.players[i].client, clients);
        }
    }

    room.config.setOpen(data.config.open);
    room.config.setPassword(data.config.password);
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
 * @param {Collection} clients
 * @param {Client} master
 */
RoomRepository.prototype.setRoom = function(room, clients, master)
{
    if (!this.room || !this.room.equal(room)) {
        this.room    = room;
        this.clients = clients;
        this.emit(this.room ? 'room:join': 'room:leave');
        this.setRoomMaster(master);
    }
};

/**
 * Set room master
 *
 * @param {Client} master
 */
RoomRepository.prototype.setRoomMaster = function(master)
{
    if (this.master) {
        this.master.setMaster(false);
    }

    this.master = master;

    if (this.master) {
        this.master.setMaster(true);
    }

    this.emit('room:master', {master: this.master});
};

/**
 * Am I the room master?
 *
 * @return {Boolean}
 */
RoomRepository.prototype.amIMaster = function()
{
    var client = this.clients.getById(this.client.id);

    return client && client.master;
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
        player: player.id,
        color: color.substr(0, Player.prototype.colorMaxLength)
    }, function (result) {
        if (!result.success) {
            console.error('Could not set color %s for player %s', player.color, player.name);
        }
        player.color = result.color;
        callback(result);
    });
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
 * Set config open
 *
 * @param {Boolean} open
 * @param {Function} callback
 */
RoomRepository.prototype.setConfigOpen = function(open, callback)
{
    this.client.addEvent('room:config:open', {open: open ? true : false}, callback);
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

/**
 * Launch
 */
RoomRepository.prototype.launch = function()
{
    this.client.addEvent('room:launch');
};

// EVENTS:

/**
 * On client add
 *
 * @param {Object} e
 */
RoomRepository.prototype.onClientAdd = function(e)
{
    this.clients.add(new Client(e.detail));
};

/**
 * On client remove
 *
 * @param {Object} e
 */
RoomRepository.prototype.onClientRemove = function(e)
{
    this.clients.removeById(e.detail);
};

/**
 * On join room
 *
 * @param {Event} e
 *
 * @return {Boolean}
 */
RoomRepository.prototype.onJoinRoom = function(e)
{
    var data   = e.detail,
        player = new Player(
            data.player.id,
            this.clients.getById(data.player.client),
            data.player.name,
            data.player.color,
            data.player.ready
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
    var player = this.room.players.getById(e.detail.player);

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
    var client = this.clients.getById(e.detail.client);

    if (client) {
        client.active = e.detail.active;
        this.emit('client:activity', {client: client, active: client.active});
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
 * On game master
 *
 * @param {Event} e
 */
RoomRepository.prototype.onRoomMaster = function(e)
{
    var master = this.clients.getById(e.detail.client);

    if (master) {
        this.setRoomMaster(master);
    }
};

/**
 * On config open
 *
 * @param {Event} e
 */
RoomRepository.prototype.onConfigOpen = function(e)
{
    var data = e.detail;

    this.room.config.setOpen(data.open);
    this.room.config.setPassword(data.password);

    this.emit('room:config:open', {open: data.open, password: data.password});
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
    this.room.newGame();
    this.emit('room:game:start');
};

/**
 * On vote
 *
 * @param {Event} e
 */
RoomRepository.prototype.onVote = function(e)
{
    var player = this.room.players.getById(e.detail.target);

    if (!player) {
        player = this.playerCache.getById(e.detail.target);
    }

    if (player) {
        player.vote = e.type === 'vote:new';
        this.emit(e.type, {target: player, result: e.detail.result});
    }
};

/**
 * On kick
 *
 * @param {Event} e
 */
RoomRepository.prototype.onKick = function(e)
{
    var player = this.room.players.getById(e.detail);

    if (!player) {
        player = this.playerCache.getById(e.detail);
    }

    if (player) {
        this.emit(e.type, player);
    }
};

/**
 * Forward event
 *
 * @param {Event} e
 */
RoomRepository.prototype.forwardEvent = function(e)
{
    this.emit(e.type, e.detail);
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
    this.setRoom(null, new Collection(), null);
};
