/**
 * Godzilla Enemy Bonus
 *
 * @param {Array} position
 */
function ColorEnemyBonus(position)
{
    Bonus.call(this, position);
}

ColorEnemyBonus.prototype = Object.create(Bonus.prototype);

ColorEnemyBonus.prototype.type   = 'color';
ColorEnemyBonus.prototype.affect = 'enemy';
ColorEnemyBonus.prototype.step   = BaseAvatar.prototype.defaultRadius;

/**
 * On
 */
ColorEnemyBonus.prototype.on = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].setColor(this.getRandomColor());
    }
};

/**
 * Off
 */
ColorEnemyBonus.prototype.off = function()
{
};

/**
 * Get random Color
 *
 * @return {String}
 */
ColorEnemyBonus.prototype.getRandomColor = function()
{
    var code = Math.floor(Math.random()*16777215).toString(16),
        miss = 6 - code.length;

    return '#' + code + (miss ? new Array(miss +1).join('0') : '');
};