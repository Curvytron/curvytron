/**
 * Slow Enemy Bonus
 *
 * @param {Array} position
 */
function SlowEnemyBonus(position)
{
    Bonus.call(this, position);
}

SlowEnemyBonus.prototype = Object.create(Bonus.prototype);

SlowEnemyBonus.prototype.type   = 'slow_enemy';
SlowEnemyBonus.prototype.affect = 'enemy';
SlowEnemyBonus.prototype.step   = BaseAvatar.prototype.velocity/2;

/**
 * On
 */
SlowEnemyBonus.prototype.on = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].setVelocity(this.target[i].velocity - this.step);
    }
};

/**
 * Off
 */
SlowEnemyBonus.prototype.off = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].setVelocity(this.target[i].velocity + this.step);
    }
};