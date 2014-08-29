/**
 * Inverse Enemy Straight Angle
 *
 * @param {Array} position
 */
function BonusEnemyStraightAngle(position)
{
    BonusEnemy.call(this, position);
}

BonusEnemyStraightAngle.prototype = Object.create(BonusEnemy.prototype);
BonusEnemyStraightAngle.prototype.constructor = BonusEnemyStraightAngle;

/**
 * Duration
 *
 * @type {Number}
 */
BonusEnemyStraightAngle.prototype.duration = 7500;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusEnemyStraightAngle.prototype.getEffects = function(avatar)
{
    return [
        ['directionInLoop', false],
        ['angularVelocityBase', Math.PI/2]
    ];
};