/**
 * Godzilla Enemy Bonus
 *
 * @param {Array} position
 */
function SmallerEnemyBonus(position)
{
    Bonus.call(this, position);
}

SmallerEnemyBonus.prototype = Object.create(Bonus.prototype);

SmallerEnemyBonus.prototype.type   = 'smaller';
SmallerEnemyBonus.prototype.affect = 'enemy';
SmallerEnemyBonus.prototype.step   = BaseAvatar.prototype.defaultRadius;

/**
 * On
 */
SmallerEnemyBonus.prototype.on = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].setRadius(this.target[i].radius - (this.step / 2));
    }
};

/**
 * Off
 */
SmallerEnemyBonus.prototype.off = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].setRadius(this.step);
    }
};