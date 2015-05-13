/**
 * All Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusAll(x, y)
{
    Bonus.call(this, x, y);

    this.off = this.off.bind(this);
}

BonusAll.prototype = Object.create(Bonus.prototype);
BonusAll.prototype.constructor = BonusAll;

/**
 * Affect all
 *
 * @type {String}
 */
BonusAll.prototype.affect = 'all';

/**
 * Get target
 *
 * @param {Avatar} avatar
 * @param {Game} game
 *
 * @return {Object}
 */
BonusAll.prototype.getTarget = function(avatar, game)
{
    return game.avatars.filter(function () { return this.alive; }).items;
};

/**
 * Apply on
 */
BonusAll.prototype.on = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].bonusStack.add(this);
    }
};

/**
 * Apply on
 */
BonusAll.prototype.off = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].bonusStack.remove(this);
    }
};
