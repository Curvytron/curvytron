/**
 * Bonus Manager
 *
 * @param {Game} game
 */
function BonusManager(game)
{
    BaseBonusManager.call(this, game);

    this.bonuses.index = false;

    this.onLoad = this.onLoad.bind(this);

    this.loaded = false;
    this.sprite = new SpriteAsset('images/bonus.png', 3, 4, this.onLoad, true);
    this.assets = {};
}

BonusManager.prototype = Object.create(BaseBonusManager.prototype);
BonusManager.prototype.constructor = BonusManager;

/**
 * Bonuses position on the sprite
 *
 * @type {Array}
 */
BonusManager.prototype.spritePosition = [
    'BonusSelfFast',
    'BonusEnemyFast',
    'BonusSelfSlow',
    'BonusEnemySlow',
    'BonusGameBorderless',
    'BonusSelfMaster',
    'BonusEnemyBig',
    'BonusAllColor',
    'BonusEnemyInverse',
    'BonusSelfSmall',
    'BonusGameClear',
    'BonusEnemyStraightAngle'
];

/**
 * Load DOM
 */
BonusManager.prototype.loadDOM = function()
{
    this.canvas = new Canvas(0, 0, document.getElementById('bonus'));
};

/**
 * On bonus sprite loaded
 */
BonusManager.prototype.onLoad = function()
{
    var images = this.sprite.getImages();

    for (var i = this.spritePosition.length - 1; i >= 0; i--) {
        this.assets[this.spritePosition[i]] = images[i];
    }

    Bonus.prototype.assets = this.assets;

    this.loaded = true;
    this.emit('load');
};

/**
 * Remove bonus
 *
 * @param {Bonus} bonus
 */
BonusManager.prototype.remove = function(bonus)
{
    this.clearBonus(bonus);
    BaseBonusManager.prototype.remove.call(this, bonus);
};

/**
 * Clear
 */
BonusManager.prototype.clear = function()
{
    this.canvas.clear();
    BaseBonusManager.prototype.clear.call(this);
};

/**
 * Draw
 *
 * @param {Canvas} canvas
 */
BonusManager.prototype.draw = function()
{
    for (var bonus, i = this.bonuses.items.length - 1; i >= 0; i--) {
        bonus = this.bonuses.items[i];
        if (!bonus.animation.done) {
            this.clearBonus(bonus);
        }
    }

    for (bonus, i = this.bonuses.items.length - 1; i >= 0; i--) {
        bonus = this.bonuses.items[i];
        if (!bonus.animation.done) {
            this.drawBonus(bonus);
        }
    }
};

/**
 * Draw bonus
 *
 * @param {Bonus} bonus
 */
BonusManager.prototype.drawBonus = function(bonus)
{
    var width = bonus.getDrawWidth();
    this.canvas.drawImageScaled(bonus.asset, bonus.position[0] - width/2, bonus.position[1] - width/2, width, width);
};

/**
 * Clear bonus from the canvas
 *
 * @param {Bonus} bonus
 */
BonusManager.prototype.clearBonus = function(bonus)
{
    var width = bonus.width * 1.3;
    this.canvas.clearZoneScaled(bonus.position[0] - width/2, bonus.position[1] - width/2, width, width);
};

/**
 * Set dimension
 *
 * @param {Number} width
 * @param {Float} scale
 */
BonusManager.prototype.setDimension = function(width, scale)
{
    this.canvas.setDimension(width, width, scale);
    this.draw();
};
