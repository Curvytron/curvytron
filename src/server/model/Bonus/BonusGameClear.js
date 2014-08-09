/**
 * Master Bonus
 *
 * @param {Array} position
 */
function BonusGameClear(position)
{
    BonusGame.call(this, position);
}

BonusGameClear.prototype = Object.create(BonusGame.prototype);
BonusGameClear.prototype.constructor = BonusGameClear;

/**
 * Duration
 *
 * @type {Number}
 */
BonusGameClear.prototype.duration = 0;

/**
 * Apply on
 */
BonusGame.prototype.on = function()
{
    this.target.clearTrails();
};