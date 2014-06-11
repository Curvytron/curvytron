/**
 * Avatar
 *
 * @param {String} name
 * @param {String} color
 */
function Avatar(player, color)
{
    BaseAvatar.call(this, player, color);

    this.input = new PlayerInput();
}

Avatar.prototype = Object.create(BaseAvatar.prototype);

/**
 * Update
 */
Avatar.prototype.update = function()
{
    if (this.input.key) {
        this.trail.addAngle(0.1 * (this.input.key == '37' ? -1 : 1));
    }

    BaseAvatar.prototype.update.call(this);
};