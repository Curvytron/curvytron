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

    if (this.target.local) {
        this.updateDimensions();
    }

    this.emit('change');
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

    if (this.target.local) {
        this.updateDimensions();
    }

    this.emit('change');
};

/**
 * Clear
 */
BonusStack.prototype.clear = function()
{
    BaseBonusStack.prototype.clear.call(this);

    if (this.target.local) {
        this.updateDimensions();
    }

    this.emit('change');
};

/**
 * Update dimensions
 */
BonusStack.prototype.updateDimensions = function()
{
    this.canvas.setDimension(this.bonuses.items.length * this.bonusWidth, this.bonusWidth);
    this.draw();
};

/**
 * Draw
 */
BonusStack.prototype.draw = function()
{
    this.canvas.clear();

    for (var bonus, x, i = this.bonuses.items.length - 1; i >= 0; i--) {
        bonus = this.bonuses.items[i];
        if (bonus.changed) {
            x = i * this.bonusWidth;
            this.canvas.clearZone(x, 0, this.bonusWidth, this.bonusWidth);
            this.canvas.drawImage(bonus.asset, x, 0, this.bonusWidth, this.bonusWidth, 0, bonus.opacity);
            bonus.changed = false;
        }
    }
};
