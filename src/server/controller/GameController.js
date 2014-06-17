/**
 * Game Controller
 */
function GameController(io)
{
    this.io    = io;
    this.games = new Collection([], 'name');
}

/**
 * Add game
 *
 * @param {Game} game
 */
GameController.prototype.addGame = function(game)
{
    var controller = this;

    if (this.games.add(game)) {
        game.on('round:new', function () { controller.onRoundNew(this); });
        game.on('round:end', function (data) { controller.onRoundEnd(this, data); });
        game.on('end', function () { controller.onEnd(this); });
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attach = function(client, game)
{
    client.joinGame(game);
    this.attachEvents(client);
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.detach = function(client)
{
    this.detachEvents(client);

    if (client.room && client.room.game) {
        this.io.sockets.in(client.room.game.channel).emit('game:leave', {avatar: client.avatar.name});
        client.leaveGame();
    }
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attachEvents = function(client)
{
    var controller = this;

    client.socket.on('loaded', function (data) { controller.onGameLoaded(client); });
    client.socket.on('channel', function (data) { controller.onChannel(client); });
    client.socket.on('player:move', function (data) { controller.onMove(client, data); });

    client.avatar.on('die', function () { controller.onDie(client); });
    client.avatar.on('angle', function (point) { controller.onAngle(client, point); });
    client.avatar.on('position', function (point) { controller.onPosition(client, point); });
    client.avatar.on('point', function (data) { controller.onPoint(client, data.point); });
    client.avatar.on('score', function (data) { controller.onScore(client, data); });
    client.avatar.trail.on('clear', function (data) { controller.onTrailClear(client); });
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.detachEvents = function(client)
{
    client.socket.removeAllListeners('loaded');
    client.socket.removeAllListeners('channel');
    client.socket.removeAllListeners('player:move');

    client.avatar.removeAllListeners('die');
    client.avatar.removeAllListeners('position');
    client.avatar.removeAllListeners('point');
    client.avatar.removeAllListeners('score');
    client.avatar.trail.removeAllListeners('clear');
};

/**
 * On game loaded
 *
 * @param {SocketClient} client
 */
GameController.prototype.onGameLoaded = function(client)
{
    client.avatar.ready = true;

    if (client.room.game.isReady()) {
        client.room.game.newRound();
    }
};

/**
 * On channel change
 *
 * @param {String} channel
 */
GameController.prototype.onChannel = function(client)
{
    var avatar;

    for (var i = client.game.avatars.ids.length - 1; i >= 0; i--) {
        avatar = client.game.avatars.items[i];
        this.io.sockets.in(client.room.game.channel).emit('position', {avatar: avatar.name, point: avatar.head});
        this.io.sockets.in(client.room.game.channel).emit('angle', {avatar: avatar.name, angle: avatar.angle});
    }
};

/**
 * On move
 *
 * @param {SocketClient} client
 * @param {Number} move
 */
GameController.prototype.onMove = function(client, move)
{
    client.avatar.setAngularVelocity(move);
};

/**
 * On position
 *
 * @param {SocketClient} client
 * @param {Array} point
 */
GameController.prototype.onPosition = function(client, point)
{
    this.io.sockets.in(client.room.game.channel).emit('position', {avatar: client.avatar.name, point: point});
};

/**
 * On angle
 *
 * @param {SocketClient} client
 * @param {Array} point
 */
GameController.prototype.onAngle = function(client, angle)
{
    this.io.sockets.in(client.room.game.channel).emit('angle', {avatar: client.avatar.name, angle: angle});
};

/**
 * On point
 *
 * @param {SocketClient} client
 * @param {Array} point
 */
GameController.prototype.onPoint = function(client, point)
{
    this.io.sockets.in(client.room.game.channel).emit('point', {avatar: client.avatar.name, point: point});
};

/**
 * On die
 *
 * @param {SocketClient} client
 */
GameController.prototype.onDie = function(client)
{
    this.io.sockets.in(client.room.game.channel).emit('die', {avatar: client.avatar.name});
};

/**
 * On score
 *
 * @param {SocketClient} client
 */
GameController.prototype.onScore = function(client, data)
{
    this.io.sockets.in(client.room.game.channel).emit('score', {avatar: client.avatar.name, score: data.score});
};

/**
 * On point
 *
 * @param {SocketClient} client
 * @param {Array} point
 */
GameController.prototype.onTrailClear = function(client)
{
    this.io.sockets.in(client.room.game.channel).emit('trail:clear', {avatar: client.avatar.name});
};

// Game events:

/**
 * On round new
 *
 * @param {Game} game
 */
GameController.prototype.onRoundNew = function(game)
{
    this.io.sockets.in(game.channel).emit('round:new');
};

/**
 * On round new
 *
 * @param {Game} game
 */
GameController.prototype.onRoundEnd = function(game, data)
{
    this.io.sockets.in(game.channel).emit('round:end');
};

/**
 * On round new
 *
 * @param {Game} game
 */
GameController.prototype.onEnd = function(game)
{
    this.io.sockets.in(game.channel).emit('end');
};
