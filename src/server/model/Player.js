/**
 * Player
 *
 * @param {SocketClient} client
 * @param {String} name
 * @param {String} color
 */
function Player(client, name, color, mail)
{
    BasePlayer.call(this, client, name, color, mail);
}

Player.prototype = Object.create(BasePlayer.prototype);
Player.prototype.constructor = Player;