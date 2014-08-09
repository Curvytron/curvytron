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
BaseBonus.prototype.constructor = BaseBonus;

/**
 * Target affected
 *
 * @type {String}
 */
BaseBonus.prototype.affect = 'self';

/**
 * Radius
 *
 * @type {Number}
 */
BaseBonus.prototype.radius = 3;

/**
 * Effect duration
 *
 * @type {Number}
 */
BaseBonus.prototype.duration = 5000;

/**
 * Clear
 *
 * @param {Array} point
 */
BaseBonus.prototype.clear = function() {};

/**
 * Apply to target(s)
 *
 * @param {Avatar} avatar
 * @param {Game} game
 *
 * @return {Number}
 */
BaseBonus.prototype.applyTo = function(avatar, game) {};

/**
 * Serialize
 *
 * @return {Object}
 */
BaseBonus.prototype.serialize = function ()
{
    return {
        id: this.id,
        type: this.constructor.name,
        radius: this.radius,
        position: this.position,
        affect: this.affect,
        duration: this.duration
    };
};