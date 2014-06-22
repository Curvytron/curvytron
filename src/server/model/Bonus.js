/**
 * Bonus
 *
 * @param name
 * @param color
 * @param radius
 */
function Bonus(name, color, radius)
{
    BaseBonus.call(this, name, color, radius);
}

Bonus.prototype = Object.create(BaseBonus.prototype);

/**
 * Set position
 *
 * @param {Array} point
 */
Bonus.prototype.setPosition = function(point)
{
    BaseBonus.prototype.setPosition.call(this, point);
    this.emit('bonus:position', point);
};

/**
 * Pop
 */
Bonus.prototype.pop = function()
{
    BaseBonus.prototype.pop.call(this);
    this.emit('bonus:pop', this.position);
};

/**
 * Clear
 */
Bonus.prototype.clear = function()
{
    BaseBonus.prototype.clear.call(this);
    this.emit('clear');
};

/**
 * Check if a bonus has been taken by given avatar
 *
 * @param avatar
 * @returns {boolean}
 */
Bonus.prototype.isTakenBy = function (avatar) {
    if (
        this.active &&
        Island.circlesTouch(
            [avatar.head[0], avatar.head[1], avatar.radius, avatar.mask],
            [this.position[0], this.position[1], this.radius, 0]
        )
    ) {
        return true;
    } else {
        return false;
    }
};
