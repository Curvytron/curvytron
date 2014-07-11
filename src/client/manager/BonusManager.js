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

    this.sprite = new SpriteAsset('images/bonus.png', 4, 2, this.onLoad, true);
    this.assets = {};
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

/**
 * On bonus sprite loaded
 */
BonusManager.prototype.onLoad = function()
{
    var bonuses = ['rabbit', 'turtle', 'bigger', 'smaller', 'borderless', 'magnet', 'color', 'fly'],
        images = this.sprite.getImages();

    for (var i = bonuses.length - 1; i >= 0; i--) {
        this.assets[bonuses[i]] = images[i];
    }

    Bonus.prototype.assets = this.assets;
};

/**
 * Draw
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