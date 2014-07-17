/**
 * Big Enemy Bonus
 *
 * @param {Array} position
 */
function BigEnemyBonus(position)
{
    Bonus.call(this, position);
}

BigEnemyBonus.prototype = Object.create(Bonus.prototype);

BigEnemyBonus.prototype.type   = 'big';
BigEnemyBonus.prototype.affect = 'enemy';
BigEnemyBonus.prototype.step   = BaseAvatar.prototype.defaultRadius;

/**
 * On
 */
BigEnemyBonus.prototype.on = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].setRadius(this.target[i].radius + this.step);
    }
};

/**
 * Off
 */
BigEnemyBonus.prototype.off = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].setRadius(this.target[i].radius - this.step);
    }
};