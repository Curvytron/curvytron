/**
 * BaseBonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BaseBonus(x, y)
{
    EventEmitter.call(this);

    this.x  = x;
    this.y  = y;
    this.id = null;
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
 * Probability to appear
 *
 * @type {Number}
 */
BaseBonus.prototype.probability = 1;

/**
 * Clear
 *
 * @param {Array} point
 */
BaseBonus.prototype.clear = function () {};

/**
 * Apply to target(s)
 *
 * @param {Avatar} avatar
 * @param {Game} game
 *
 * @return {Number}
 */
BaseBonus.prototype.applyTo = function (avatar, game) {};

/**
 * Get probability
 *
 * @param {Game} game
 *
 * @return {Number}
 */
BaseBonus.prototype.getProbability = function (game)
{
    return BaseBonus.prototype.probability;
};
