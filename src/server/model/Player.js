/**
 * Player
 *
 * @param {SocketClient} client
 * @param {String} name
 * @param {String} color
 */
function Player(client, name, color)
{
    BasePlayer.call(this, client, name, color);
}

Player.prototype = Object.create(BasePlayer.prototype);
Player.prototype.constructor = Player;
