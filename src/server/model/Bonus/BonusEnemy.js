/**
 * Enemy Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusEnemy(x, y)
{
    Bonus.call(this, x, y);

    this.off = this.off.bind(this);
}

BonusEnemy.prototype = Object.create(Bonus.prototype);
BonusEnemy.prototype.constructor = BonusEnemy;

/**
 * Affect enemy
 *
 * @type {String}
 */
BonusEnemy.prototype.affect = 'enemy';

/**
 * Get target
 *
 * @param {Avatar} avatar
 * @param {Game} game
 *
 * @return {Object}
 */
BonusEnemy.prototype.getTarget = function(avatar, game)
{
    return game.avatars.filter(function () { return this.alive && !this.equal(avatar); }).items;
};

/**
 * Apply on
 */
BonusEnemy.prototype.on = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].bonusStack.add(this);
    }
};

/**
 * Apply on
 */
BonusEnemy.prototype.off = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].bonusStack.remove(this);
    }
};
