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
        game.on('round:winner', function (data) { controller.onRoundWinner(this, data); });
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
        for (var i = client.players.items.length - 1; i >= 0; i--) {
            this.io.sockets.in(client.room.game.channel).emit('game:leave', {avatar: client.players.items[i].avatar.name});
        }
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
    var controller = this,
        avatar;

    client.socket.on('loaded', function (data) { controller.onGameLoaded(client); });
    client.socket.on('player:move', function (data) { controller.onMove(client, data); });

    for (var i = client.players.items.length - 1; i >= 0; i--) {
        avatar = client.players.items[i].avatar;

        avatar.on('die', function () { controller.onDie(client, avatar); });
        avatar.on('angle', function (point) { controller.onAngle(client, avatar, point); });
        avatar.on('position', function (point) { controller.onPosition(client, avatar, point); });
        avatar.on('point', function (data) { controller.onPoint(client, avatar, data.point); });
        avatar.on('score', function (data) { controller.onScore(client, avatar, data); });
        avatar.trail.on('clear', function (data) { controller.onTrailClear(client, avatar); });
    }
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

    for (var i = client.game.avatars.ids.length - 1; i >= 0; i--) {
        avatar = client.game.avatars.items[i];
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
    var player = client.players.getbyId(data.avatar);

    if (player && player.avatar) {
        player.avatar.setAngularVelocity(move);
    }
};

/**
 * On position
 *
 * @param {SocketClient} client
 * @param {Array} point
 */
GameController.prototype.onPosition = function(client, avatar, point)
{
    this.io.sockets.in(client.room.game.channel).emit('position', {avatar: avatar.name, point: point});
};

/**
 * On angle
 *
 * @param {SocketClient} client
 * @param {Array} point
 */
GameController.prototype.onAngle = function(client, angle)
{
    this.io.sockets.in(client.room.game.channel).emit('angle', {avatar: avatar.name, angle: angle});
};

/**
 * On point
 *
 * @param {SocketClient} client
 * @param {Array} point
 */
GameController.prototype.onPoint = function(client, point)
{
    this.io.sockets.in(client.room.game.channel).emit('point', {avatar: avatar.name, point: point});
};

/**
 * On die
 *
 * @param {SocketClient} client
 */
GameController.prototype.onDie = function(client, avatar)
{
    this.io.sockets.in(client.room.game.channel).emit('die', {avatar: avatar.name});
};

/**
 * On score
 *
 * @param {SocketClient} client
 */
GameController.prototype.onScore = function(client, avatar, data)
{
    this.io.sockets.in(client.room.game.channel).emit('score', {avatar: avatar.name, score: data.score});
};

/**
 * On point
 *
 * @param {SocketClient} client
 * @param {Array} point
 */
GameController.prototype.onTrailClear = function(client, avatar)
{
    this.io.sockets.in(client.room.game.channel).emit('trail:clear', {avatar: avatar.name});
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
 * On round winner
 *
 * @param {Game} game
 */
GameController.prototype.onRoundWinner = function(game, data)
{
    this.io.sockets.in(game.channel).emit('round:winner', {winner: data.winner.name});
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
