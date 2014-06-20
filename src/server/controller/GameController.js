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
    }
};

/**
 * Remove game
 *
 * @param {Game} game
 */
GameController.prototype.removeGame = function(game)
{
    console.log('removeGame');
    if (this.games.remove(game)) {
        game.on('round:new', this.onRoundNew);
        game.on('round:end', this.onRoundEnd);
        game.on('round:winner', this.onRoundWinner);

        console.log('game removed', this.games.ids);
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attach = function(client, game)
{
    if (!game.clients.exists(client)) {
        client.joinGame(game);
        this.attachEvents(client);
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.detach = function(client)
{
    console.log('detach', client.id);

    this.detachEvents(client);

    if (client.game) {
        for (var i = client.players.items.length - 1; i >= 0; i--) {
            this.io.sockets.in(client.game.channel).emit('game:leave', {avatar: client.players.items[i].avatar.name});
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
    console.log('detachEvents', client.id);
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
        this.io.sockets.in(client.game.channel).emit('position', {avatar: avatar.name, point: avatar.head});
        this.io.sockets.in(client.game.channel).emit('angle', {avatar: avatar.name, angle: avatar.angle});
    }

    if (client.game.isReady()) {
        client.game.newRound();
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
        channel = avatar.player.client.game.channel,
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
        channel = avatar.player.client.game.channel,
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
        channel = avatar.player.client.game.channel,
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
        channel = avatar.player.client.game.channel;

    this.io.sockets.in(channel).emit('die', {avatar: avatar.name});
};

/**
 * On score
 *
 * @param {Object} data
 */
GameController.prototype.onScore = function(data)
{
    var avatar = data.avatar,
        channel = avatar.player.client.game.channel,
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
        channel = avatar.player.client.game.channel;

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
