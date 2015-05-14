/**
 * Map Bonus
 *
 * @param {Number} id
 * @param {Number} x
 * @param {Number} y
 * @param {String} type
 * @param {Number} radius
 */
function MapBonus(id, x, y, type)
{
    BaseBonus.call(this, x, y);

    this.id         = id;
    this.asset      = this.assets[type];
    this.animation  = new BounceIn(300);
    this.changed    = true;
    this.drawRadius = 0;
    this.drawWidth  = 0;
    this.drawX      = 0;
    this.drawY      = 0;

    this.update();
}

MapBonus.prototype = Object.create(BaseBonus.prototype);
MapBonus.prototype.constructor = MapBonus;

/**
 * Assets
 *
 * @type {Object}
 */
MapBonus.prototype.assets = BonusManager.prototype.assets;

/**
 * Update bonus for drawing
 */
MapBonus.prototype.update = function()
{
    this.drawRadius = this.radius * this.animation.getValue();
    this.drawWidth  = this.drawRadius * 2;
    this.drawX      = this.x - this.drawRadius;
    this.drawY      = this.y - this.drawRadius;
};
