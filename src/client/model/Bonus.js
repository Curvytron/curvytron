/**
 * Bonus
 *
 * @param {Number} id
 * @param {Array} position
 * @param {String} type
 * @param {String} affect
 * @param {Number} radius
 * @param {Number} duration
 */
function Bonus(id, position, type, affect, radius, duration)
{
    BaseBonus.call(this, position);

    this.id        = id;
    this.type      = type;
    this.affect    = affect;
    this.radius    = radius;
    this.duration  = duration;
    this.asset     = this.assets[this.type];
    this.animation = new BounceIn(300);
    this.width     = this.radius * 2;

    this.setEnding     = this.setEnding.bind(this);
    this.toggleOpacity = this.toggleOpacity.bind(this);
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
 * Get drawing width
 *
 * @param {Float} scale
 *
 * @return {Float}
 */
Bonus.prototype.getDrawWidth = function()
{
    return this.width * this.animation.getValue();
};

/**
 * Clear
 */
Bonus.prototype.clear = function()
{
    if (this.timeout) {
        clearInterval(this.timeout);
    }

    BaseBonus.prototype.clear.call(this);
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
    this.emit('change');
};