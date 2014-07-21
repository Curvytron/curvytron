/**
 * Bonus Stack
 *
 * @param {Avatar} avatar
 */
function BonusStack(avatar)
{
    BaseBonusStack.call(this, avatar);

    this.canvas = new Canvas(this.width, this.width);
}

BonusStack.prototype = Object.create(BaseBonusStack.prototype);
BonusStack.prototype.constructor = BonusStack;

/**
 * Bonus width
 *
 * @type {Number}
 */
BonusStack.prototype.bonusWidth = 20;

/**
 * Add bonus to the stack
 *
 * @param {Bonus} bonus
 */
BonusStack.prototype.add = function(bonus)
{
    setTimeout(bonus.setEnding, bonus.duration - 1000);
    this.bonuses.add(bonus);
};

/**
 * Remove bonus from the stack
 *
 * @param {Bonus} bonus
 */
BonusStack.prototype.remove = function(bonus)
{
    bonus.clear();
    this.bonuses.remove(bonus);
};

/**
 * Update dimensions
 */
BonusStack.prototype.updateDimensions = function()
{
    this.drawWidth  = this.bonuses.items.length;
    this.drawHeight = 1;

    this.canvas.setDimension(this.drawWidth * this.bonusWidth, this.drawHeight * this.bonusWidth);

    this.canvas.clear();
};

/**
 * Draw
 */
BonusStack.prototype.draw = function()
{
    this.updateDimensions();

    for (var i = this.bonuses.items.length - 1; i >= 0; i--) {
        bonus = this.bonuses.items[i];
        this.canvas.drawImage(bonus.canvas.element, [i * this.bonusWidth, 0], this.bonusWidth, this.bonusWidth, 0, bonus.opacity);
    }

    return this.canvas.element;
};