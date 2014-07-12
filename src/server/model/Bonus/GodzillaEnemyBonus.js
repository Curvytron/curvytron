/**
 * Godzilla Enemy Bonus
 *
 * @param {Array} position
 */
function GodzillaEnemyBonus(position)
{
    Bonus.call(this, position);
}

GodzillaEnemyBonus.prototype = Object.create(Bonus.prototype);

GodzillaEnemyBonus.prototype.type   = 'godzilla';
GodzillaEnemyBonus.prototype.affect = 'enemy';
GodzillaEnemyBonus.prototype.step   = BaseAvatar.prototype.defaultRadius;

/**
 * On
 */
GodzillaEnemyBonus.prototype.on = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].setRadius(this.target[i].radius + this.step);
    }
};

/**
 * Off
 */
GodzillaEnemyBonus.prototype.off = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].setRadius(this.target[i].radius - this.step);
    }
};