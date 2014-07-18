/**
 * Bonus Stack
 *
 * @param {Avatar} avatar
 */
function BonusStack(avatar)
{
    BaseBonusStack.call(this, avatar);

    this.canvas = new Canvas(100, 20);
}

BonusStack.prototype = Object.create(BaseBonusStack.prototype);
BonusStack.prototype.constructor = BonusStack;

/**
 * Add bonus to the stack
 *
 * @param {Bonus} bonus
 */
BonusStack.prototype.add = function(bonus)
{
    this.bonuses.add(bonus);
    this.draw();
};

/**
 * Remove bonus from the stack
 *
 * @param {Bonus} bonus
 */
BonusStack.prototype.remove = function(bonus)
{
    this.bonuses.remove(bonus);
    this.draw();
};

/**
 * Draw
 *
 * @return {[type]}
 */
BonusStack.prototype.draw = function()
{
    this.canvas.clear;

    for (var i = this.bonuses.items.length - 1; i >= 0; i--) {
        this.canvas.drawImage(this.bonuses.items[i].canvas.element, [i * 10, 0], 10, 10);
    }
};