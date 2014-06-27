/**
 * BaseBonus
 *
 * @param name
 * @param color
 */
function BaseBonus(position)
{
    EventEmitter.call(this);

    this.position = typeof(position) != 'undefined' ? position : [this.radius, this.radius];
    this.id       = null;
    this.active   = false;
}

BaseBonus.prototype = Object.create(EventEmitter.prototype);

BaseBonus.prototype.precision = 1;
BaseBonus.prototype.name      = 'Bonus';
BaseBonus.prototype.color     = '#7CFC00';
BaseBonus.prototype.radius    = 2.4;
BaseBonus.prototype.duration  = 3333;
BaseBonus.prototype.positive  = true;

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