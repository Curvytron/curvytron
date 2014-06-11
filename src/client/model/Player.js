/**
 * Player
 *
 * @param {String} name
 * @param {String} color
 */
function Player(name, color, mail)
{
    BasePlayer.call(this, name, color, mail);
}

Player.prototype = Object.create(BasePlayer.prototype);