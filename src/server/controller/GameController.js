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

    client.avatar.trail.on('point', function (point) { controller.onPoint(client, point); });
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
 * On new room
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
GameController.prototype.onPoint = function(client, point)
{
    this.io.sockets.in(client.room.game.channel).emit('point', {avatar: client.avatar.name, point: point});
};