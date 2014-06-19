/**
 * Player
 *
 * @param {String} client
 * @param {String} name
 * @param {String} color
 */
function Player(client, name, color, mail)
{
    BasePlayer.call(this, client, name, color, mail);

    this.local = false;
}

Player.prototype = Object.create(BasePlayer.prototype);

/**
 * Set local
 *
 * @param {Boolean} local
 */
Player.prototype.setLocal = function(local)
{
    this.local = local;

    /*if (this.avatar) {
        this.avatar.setLocal(this.local);
    }*/
};