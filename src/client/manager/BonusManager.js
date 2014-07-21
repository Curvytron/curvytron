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
    'BonusAllBorderless',
    'BonusSelfMaster',
    'BonusEnemyBig',
    'BonusAllColor',
    'BonusEnemyInverse',
    'BonusSelfGodzilla'
];

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
};

/**
 * Draw
 *
 * @param {Canvas} canvas
 */
BonusManager.prototype.draw = function(canvas)
{
    var i, bonus;

    for (i = this.bonuses.items.length - 1; i >= 0; i--) {
        bonus = this.bonuses.items[i];
        canvas.drawImage(
            bonus.canvas.element,
            [
                bonus.position[0] * canvas.scale,
                bonus.position[1] * canvas.scale
            ]
        );
    }
};