/**
 * Player
 *
 * @param {String} name
 * @param {String} color
 */
function Player(name, color)
{
    BasePlayer.call(this, name, color);

    this.input = new PlayerInput();
}

Player.prototype = Object.create(BasePlayer.prototype);

/**
 * Update
 */
Player.prototype.update = function()
{
    if (this.input.key) {
        this.trail.addAngle(0.1 * (this.input.key == '37' ? -1 : 1));
    }

    BasePlayer.prototype.update.call(this);
};