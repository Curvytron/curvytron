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