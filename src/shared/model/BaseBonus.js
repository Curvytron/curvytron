/**
 * BaseBonus
 *
 * @param name
 * @param color
 * @param radius
 */
function BaseBonus(name, color, radius)
{
    EventEmitter.call(this);

    this.id       = null;
    this.name     = name || this.defaultName;
    this.color    = color || this.defaultColor;
    this.radius   = radius || this.defaultRadius;
    this.active   = false;
    this.positive = true;
    this.position = [this.radius, this.radius];
}

BaseBonus.prototype = Object.create(EventEmitter.prototype);

BaseBonus.prototype.precision     = 1;
BaseBonus.prototype.defaultName   = 'Bonus';
BaseBonus.prototype.defaultColor  = '#7CFC00';
BaseBonus.prototype.defaultRadius = 2.4;

/**
 * Set Point
 *
 * @param {Array} point
 */
BaseBonus.prototype.setPosition = function(point)
{
    this.position[0] = point[0];
    this.position[1] = point[1];
};

/**
 * Pop
 */
BaseBonus.prototype.pop = function()
{
    this.active = true;
};

/**
 * Clear
 *
 * @param {Array} point
 */
BaseBonus.prototype.clear = function()
{
    this.active = false;
};

/**
 * Serialize
 *
 * @returns {{id: *, name: *, color: *, radius: *, active: *, position: *}}
 */
BaseBonus.prototype.serialize = function ()
{
    return {
        id: this.id,
        name: this.name,
        color: this.color,
        radius: this.radius,
        active: this.active,
        position: this.position
    };
};

/**
 * Unserialize
 *
 * @param bonus
 */
BaseBonus.prototype.unserialize = function (bonus)
{
    this.id       = bonus.id;
    this.name     = bonus.name;
    this.color    = bonus.color;
    this.radius   = bonus.radius;
    this.active   = bonus.active;
    this.position = bonus.position;
};