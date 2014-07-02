/**
 * Bonus Manager
 *
 * @param {Game} game
 */
function BonusManager(game)
{
    BaseBonusManager.call(this, game);

    this.bonuses.index = false;
}

BonusManager.prototype = Object.create(BaseBonusManager.prototype);

/**
 * Add bonus
 *
 * @param {Bonus} bonus
 */
BonusManager.prototype.add = function(bonus)
{
    bonus.setScale(this.game.canvas.scale);

    return BaseBonusManager.prototype.add.call(this, bonus);
};

/**
 * Set scale
 *
 * @param {Number} scale
 */
BonusManager.prototype.setScale = function(scale)
{
    for (i = this.bonuses.items.length - 1; i >= 0; i--) {
        this.bonuses.items[i].setScale(scale);
    }
};