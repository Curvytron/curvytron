/**
 * Bonus Stack
 *
 * @param {Avatar} avatar
 */
function BonusStack(avatar)
{
    BaseBonusStack.call(this, avatar);
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
    BaseBonusStack.prototype.add.call(this, bonus);
    this.emit('change', {avatar: this.avatar, method: 'add', bonus: bonus});
};

/**
 * Remove bonus from the stack
 *
 * @param {Bonus} bonus
 */
BonusStack.prototype.remove = function(bonus)
{
    BaseBonusStack.prototype.remove.call(this, bonus);
    this.emit('change', {avatar: this.avatar, method: 'remove', bonus: bonus});
};