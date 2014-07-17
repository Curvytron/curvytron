/**
 * Fast Enemy Bonus
 *
 * @param {Array} position
 */
function FastEnemyBonus(position)
{
    Bonus.call(this, position);
}

FastEnemyBonus.prototype = Object.create(Bonus.prototype);

FastEnemyBonus.prototype.type   = 'fast_enemy';
FastEnemyBonus.prototype.affect = 'enemy';
FastEnemyBonus.prototype.step   = BaseAvatar.prototype.velocity/2;

/**
 * On
 */
FastEnemyBonus.prototype.on = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].setVelocity(this.target[i].velocity + this.step);
    }
};

/**
 * Off
 */
FastEnemyBonus.prototype.off = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].setVelocity(this.target[i].velocity - this.step);
    }
};