/**
 * Bonus
 *
 * @param {Number} id
 * @param {Number} x
 * @param {Number} y
 * @param {String} type
 * @param {String} affect
 * @param {Number} radius
 * @param {Number} duration
 */
function Bonus(id, x, y, type, affect, radius, duration)
{
    BaseBonus.call(this, x, y);

    this.id         = id;
    this.type       = type;
    this.affect     = affect;
    this.radius     = radius;
    this.duration   = duration;
    this.asset      = this.assets[this.type];
    this.animation  = new BounceIn(300);
    this.changed    = true;
    this.drawRadius = 0;
    this.drawWidth  = 0;
    this.drawX      = 0;
    this.drawY      = 0;

    this.setEnding     = this.setEnding.bind(this);
    this.toggleOpacity = this.toggleOpacity.bind(this);

    this.update();
}

Bonus.prototype = Object.create(BaseBonus.prototype);
Bonus.prototype.constructor = Bonus;

/**
 * Opacity
 *
 * @type {Number}
 */
Bonus.prototype.opacity = 1;

/**
 * Update bonus for drawing
 */
Bonus.prototype.update = function()
{
    this.drawRadius = this.radius * this.animation.getValue();
    this.drawWidth  = this.drawRadius * 2;
    this.drawX      = this.x - this.drawRadius;
    this.drawY      = this.y - this.drawRadius;
};

/**
 * Clear
 */
Bonus.prototype.clear = function()
{
    if (this.timeout) {
        this.timeout = clearInterval(this.timeout);
    }
};

/**
 * Set ending timeout
 *
 * @param {Number} warning
 */
Bonus.prototype.setEndingTimeout = function(warning)
{
    this.timeout = setTimeout(this.setEnding, this.duration - warning);
};

/**
 * Set ending
 */
Bonus.prototype.setEnding = function()
{
    this.timeout = setInterval(this.toggleOpacity, 100);
};

/**
 * Toggle opacity
 */
Bonus.prototype.toggleOpacity = function()
{
    this.opacity = this.opacity === 1 ? 0.5 : 1;
    this.changed = true;
    this.emit('change');
};
