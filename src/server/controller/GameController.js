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

    client.socket.on('player:move', function (data) { controller.onMove(client, data); });

    client.avatar.on('die', function () { controller.onDie(client); });
    client.avatar.on('position', function (point) { controller.onPosition(client, point); });
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
 * On point
 *
 * @param {SocketClient} client
 * @param {Array} point
 */
GameController.prototype.onPosition = function(client, point)
{
    console.log('onPosition', point, client.room.game.channel, {avatar: client.avatar.name, point: point});
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