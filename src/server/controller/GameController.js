/**
 * Game Controller
 */
function GameController(io)
{
    this.io = io;
}

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
    if (client.room && client.room.game) {
        this.io.sockets.in(client.room.game.channel).emit('game:leave', {room: client.room.name, player: client.player.name});
        client.leaveGame();
    }

    this.detachEvents(client);
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attachEvents = function(client)
{
    var controller = this;

    client.socket.on('channel', function (data) { controller.onChannel(client); });
    client.socket.on('player:move', function (data) { controller.onMove(client, data); });

    client.avatar.on('die', function () { controller.onDie(client); });
    client.avatar.on('position', function (point) { controller.onPosition(client, point); });
    client.avatar.on('point', function (data) { controller.onPoint(client, data.point); });
    client.avatar.trail.on('clear', function (data) { controller.onTrailClear(client); });
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.detachEvents = function(client)
{
    client.socket.removeAllListeners('game:move');
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
    console.log('onDie');
    this.io.sockets.in(client.room.game.channel).emit('die', {avatar: client.avatar.name});
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
