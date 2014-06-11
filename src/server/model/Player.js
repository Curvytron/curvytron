/**
 * Player
 *
 * @param {SocketClient} client
 * @param {String} name
 * @param {String} color
 */
function Player(client, name, color)
{
    BasePlayer.call(this, name, color);

    this.client = client;
}

Player.prototype = Object.create(BasePlayer.prototype);

/**
 * Serialize
 *
 * @return {Object}
 */
Player.prototype.serialize = function()
{
    return {
        name: this.name,
        color: this.color
    };
};