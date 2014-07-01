/**
 * BaseBonus
 *
 * @param {Array} position
 */
function BaseBonus(position)
{
    EventEmitter.call(this);

    this.position = position;
    this.id       = null;
}

BaseBonus.prototype = Object.create(EventEmitter.prototype);

BaseBonus.prototype.precision = 1;
BaseBonus.prototype.type      = 'default';
BaseBonus.prototype.color     = '#7CFC00';
BaseBonus.prototype.radius    = 2.4;
BaseBonus.prototype.duration  = 3333;
BaseBonus.prototype.positive  = true;

/**
 * Clear
 *
 * @param {Array} point
 */
BaseBonus.prototype.clear = function() {};

/**
 * Serialize
 *
 * @return {Object}
 */
BaseBonus.prototype.serialize = function ()
{
    return {
        id: this.id,
        type: this.type,
        color: this.color,
        radius: this.radius,
        position: this.position
    };
};