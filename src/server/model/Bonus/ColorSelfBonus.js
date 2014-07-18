/**
 * Godzilla Enemy Bonus
 *
 * @param {Array} position
 */
function ColorSelfBonus(position)
{
    Bonus.call(this, position);
}

ColorSelfBonus.prototype = Object.create(Bonus.prototype);

ColorSelfBonus.prototype.type   = 'color';
ColorSelfBonus.prototype.affect = 'self';
ColorSelfBonus.prototype.step   = BaseAvatar.prototype.defaultRadius;

/**
 * On
 */
ColorSelfBonus.prototype.on = function()
{
    this.target.setColor(this.getRandomColor());
};

/**
 * Off
 */
ColorSelfBonus.prototype.off = function()
{
};

/**
 * Get random Color
 *
 * @return {String}
 */
ColorSelfBonus.prototype.getRandomColor = function()
{
    var code = Math.floor(Math.random()*16777215).toString(16),
        miss = 6 - code.length;

    return '#' + code + (miss ? new Array(miss +1).join('0') : '');
};