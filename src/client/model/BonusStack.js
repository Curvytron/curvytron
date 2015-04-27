/**
 * Bonus Stack
 *
 * @param {Avatar} avatar
 */
function BonusStack(avatar)
{
    BaseBonusStack.call(this, avatar);

    this.canvas     = new Canvas(this.width, this.width);
    this.changed    = true;
    this.lastWidth  = this.width;
    this.lastHeight = this.width;

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
    bonus.setEndingTimeout(this.warning);
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
 * Clear
 */
BonusStack.prototype.clear = function()
{
    for (var i = this.bonuses.items.length - 1; i >= 0; i--) {
        this.bonuses.items[i].clear();
    }

    BaseBonusStack.prototype.clear.call(this);
    this.updateDimensions();
};

/**
 * Update dimensions
 */
BonusStack.prototype.updateDimensions = function()
{
    this.canvas.setDimension(this.bonuses.items.length * this.bonusWidth, this.bonusWidth);
    this.changed = true;
    this.draw();
};

/**
 * Draw
 */
BonusStack.prototype.draw = function(e)
{
    if (this.changed) {
        this.canvas.clear();
    }

    for (var bonus, x, i = this.bonuses.items.length - 1; i >= 0; i--) {
        bonus = this.bonuses.items[i];
        if (this.changed || bonus.changed) {
            x = i * this.bonusWidth;
            if (!this.changed) {
                this.canvas.clearZone(x, 0, this.bonusWidth, this.bonusWidth);
            }
            this.canvas.setOpacity(bonus.opacity);
            this.canvas.drawImage(bonus.asset, x, 0, this.bonusWidth, this.bonusWidth);
            bonus.changed = false;
        }
    }

    this.changed = false;
};
