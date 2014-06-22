/**
 * Game Controller
 */
function GameController(io)
{
    this.io    = io;
    this.games = new Collection([], 'name');

    this.onDie         = this.onDie.bind(this);
    this.onAngle       = this.onAngle.bind(this);
    this.onPosition    = this.onPosition.bind(this);
    this.onPoint       = this.onPoint.bind(this);
    this.onScore       = this.onScore.bind(this);
    this.onTrailClear  = this.onTrailClear.bind(this);
    this.onRoundNew    = this.onRoundNew.bind(this);
    this.onRoundEnd    = this.onRoundEnd.bind(this);
    this.onRoundWinner = this.onRoundWinner.bind(this);
    this.onBonusPop    = this.onBonusPop.bind(this);
    this.onBonusClear  = this.onBonusClear.bind(this);
}

/**
 * Add game
 *
 * @param {Game} game
 */
GameController.prototype.addGame = function(game)
{
    if (this.games.add(game)) {
        game.on('round:new', this.onRoundNew);
        game.on('round:end', this.onRoundEnd);
        game.on('round:winner', this.onRoundWinner);

        game.on('bonus:pop', this.onBonusPop);
        game.on('bonus:clear', this.onBonusClear);
        
        for (var i = game.clients.items.length - 1; i >= 0; i--) {
            this.attach(game.clients.items[i], game);
        }
    }
};

/**
 * Remove game
 *
 * @param {Game} game
 */
GameController.prototype.removeGame = function(game)
{
    if (this.games.remove(game)) {
        game.removeListener('round:new', this.onRoundNew);
        game.removeListener('round:end', this.onRoundEnd);
        game.removeListener('round:winner', this.onRoundWinner);
        game.removeListener('bonus:pop', this.onBonusPop);
        game.removeListener('bonus:clear', this.onBonusClear);
        
        for (var i = game.clients.items.length - 1; i >= 0; i--) {
            this.detach(game.clients.items[i], game);
        }
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attach = function(client, game)
{
    this.attachEvents(client);
    client.joinChannel('game:' + game.name);
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.detach = function(client)
{
    this.detachEvents(client);

    var avatar;

    if (client.room.game) {
        for (var i = client.players.items.length - 1; i >= 0; i--) {
            avatar = client.players.items[i].avatar;
            this.io.sockets.in(client.room.game.channel).emit('game:leave', {avatar: avatar.name});
            client.room.game.removeAvatar(avatar);
        }
    }
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attachEvents = function(client)
{
    var controller = this,
        avatar;

    client.socket.on('loaded', function (data) { controller.onGameLoaded(client); });
    client.socket.on('player:move', function (data) { controller.onMove(client, data); });

    for (var i = client.players.items.length - 1; i >= 0; i--) {
        avatar = client.players.items[i].avatar;

        avatar.on('die', this.onDie);
        avatar.on('angle', this.onAngle);
        avatar.on('position', this.onPosition);
        avatar.on('point', this.onPoint);
        avatar.on('score', this.onScore);
        avatar.trail.on('clear', this.onTrailClear);
    }
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.detachEvents = function(client)
{
    var avatar;

    client.socket.removeAllListeners('loaded');
    client.socket.removeAllListeners('channel');
    client.socket.removeAllListeners('player:move');

    for (var i = client.players.items.length - 1; i >= 0; i--) {
        client.players.items[i].avatar.removeAllListeners('die');
        client.players.items[i].avatar.removeAllListeners('position');
        client.players.items[i].avatar.removeAllListeners('point');
        client.players.items[i].avatar.removeAllListeners('score');
        client.players.items[i].avatar.trail.removeAllListeners('clear');
    }
};

/**
 * On game loaded
 *
 * @param {SocketClient} client
 */
GameController.prototype.onGameLoaded = function(client)
{
    var avatar;

    for (var i = client.players.ids.length - 1; i >= 0; i--) {
        avatar = client.players.items[i].avatar;
        avatar.ready = true;
        this.io.sockets.in(client.room.game.channel).emit('position', {avatar: avatar.name, point: avatar.head});
        this.io.sockets.in(client.room.game.channel).emit('angle', {avatar: avatar.name, angle: avatar.angle});
    }

    if (client.room.game.isReady()) {
        client.room.game.newRound();
    }
};

/**
 * On move
 *
 * @param {SocketClient} client
 * @param {Number} move
 */
GameController.prototype.onMove = function(client, data)
{
    var player = client.players.getById(data.avatar);

    if (player && player.avatar) {
        player.avatar.setAngularVelocity(data.move);
    }
};

/**
 * On position
 *
 * @param {Object} data
 */
GameController.prototype.onPosition = function(data)
{
    var avatar = data.avatar,
        channel = avatar.player.client.room.game.channel,
        point = data.point;

    this.io.sockets.in(channel).emit('position', {avatar: avatar.name, point: point});
};

/**
 * On angle
 *
 * @param {Object} data
 */
GameController.prototype.onAngle = function(data)
{
    var avatar = data.avatar,
        channel = avatar.player.client.room.game.channel,
        angle = data.angle;

    this.io.sockets.in(channel).emit('angle', {avatar: avatar.name, angle: angle});
};

/**
 * On point
 *
 * @param {Object} data
 */
GameController.prototype.onPoint = function(data)
{
    var avatar = data.avatar,
        channel = avatar.player.client.room.game.channel,
        point = data.point;

    this.io.sockets.in(channel).emit('point', {avatar: avatar.name, point: point});
};

/**
 * On die
 *
 * @param {Object} data
 */
GameController.prototype.onDie = function(data)
{
    var avatar = data.avatar,
        channel = avatar.player.client.room.game.channel;

    this.io.sockets.in(channel).emit('die', {avatar: avatar.name});
};

/**
 * On bonus pop
 *
 * @param {SocketClient} game
 */
GameController.prototype.onBonusPop = function(data)
{
    var game = data.game,
        channel = data.game.channel;
    
    this.io.sockets.in(channel).emit('bonus:pop', data.bonus.serialize());
};

/**
 * On bonus clear
 *
 * @param {SocketClient}client
 * @param data
 */
GameController.prototype.onBonusClear = function(data)
{
    var game = data.game,
        channel = data.game.channel;

    this.io.sockets.in(channel).emit('bonus:clear', data.bonus.serialize());
};


/**
 * On score
 *
 * @param {Object} data
 */
GameController.prototype.onScore = function(data)
{
    var avatar = data.avatar,
        channel = avatar.player.client.room.game.channel,
        score = data.score;

    this.io.sockets.in(channel).emit('score', {avatar: avatar.name, score: score});
};

/**
 * On point
 *
 * @param {Object} data
 */
GameController.prototype.onTrailClear = function(data)
{
    var avatar = data.avatar,
        channel = avatar.player.client.room.game.channel;

    this.io.sockets.in(channel).emit('trail:clear', {avatar: avatar.name});
};

// Game events:

/**
 * On round new
 *
 * @param {Object} data
 */
GameController.prototype.onRoundNew = function(data)
{
    this.io.sockets.in(data.game.channel).emit('round:new');
};

/**
 * On round new
 *
 * @param {Object} data
 */
GameController.prototype.onRoundEnd = function(data)
{
    this.io.sockets.in(data.game.channel).emit('round:end');
};

/**
 * On round winner
 *
 * @param {Object} data
 */
GameController.prototype.onRoundWinner = function(data)
{
    this.io.sockets.in(data.game.channel).emit('round:winner', {winner: data.winner.name});
};
