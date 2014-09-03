/**
 * Bonus Stack
 *
 * @param {Avatar} avatar
 */
function BonusStack(avatar)
{
    BaseBonusStack.call(this, avatar);

    this.canvas = new Canvas(this.width, this.width);

    this.draw = this.draw.bind(this);
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
 * Warning time
 *
 * @type {Number}
 */
BonusStack.prototype.warning = 1000;

/**
 * Add bonus to the stack
 *
 * @param {Bonus} bonus
 */
BonusStack.prototype.add = function(bonus)
{
    bonus.on('change', this.draw);
    setTimeout(bonus.setEnding, bonus.duration - this.warning);
    this.bonuses.add(bonus);
    this.updateDimensions();
};

/**
 * Remove bonus from the stack
 *
 * @param {Bonus} bonus
 */
BonusStack.prototype.remove = function(bonus)
{
    bonus.clear();
    bonus.off('change', this.draw);
    this.bonuses.remove(bonus);
    this.updateDimensions();
};

/**
 * Update dimensions
 */
BonusStack.prototype.updateDimensions = function()
{
    this.drawWidth  = this.bonuses.items.length;
    this.drawHeight = 1;

    this.canvas.setDimension(this.drawWidth * this.bonusWidth, this.drawHeight * this.bonusWidth);
    this.draw();
};

/**
 * Draw
 */
BonusStack.prototype.draw = function()
{
    this.canvas.clear();

    for (var i = this.bonuses.items.length - 1; i >= 0; i--) {
        bonus = this.bonuses.items[i];
        this.canvas.drawImage(bonus.asset, [i * this.bonusWidth, 0], this.bonusWidth, this.bonusWidth, 0, bonus.opacity);
    }
};