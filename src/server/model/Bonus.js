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
