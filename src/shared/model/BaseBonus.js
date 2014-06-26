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

    this.name     = name || this.defaultName;
    this.color    = color || this.defaultColor;
    this.radius   = radius || this.defaultRadius;
    this.active   = false;
    this.positive = true;

    console.log(this);

    this.position = [this.radius, this.radius];
}

BaseBonus.prototype = Object.create(EventEmitter.prototype);

BaseBonus.prototype.precision     = 1;
BaseBonus.prototype.defaultName   = 'Bonus';
BaseBonus.prototype.defaultColor  = '#7CFC00';
BaseBonus.prototype.defaultRadius = 1.2;

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
 * Update
 */
BaseBonus.prototype.update = function() {};

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
    _.extend(this, bonus);
};