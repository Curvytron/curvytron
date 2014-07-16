/**
 * Rabbit Enemy Bonus
 *
 * @param {Array} position
 */
function RabbitEnemyBonus(position)
{
    Bonus.call(this, position);
}

RabbitEnemyBonus.prototype = Object.create(Bonus.prototype);

RabbitEnemyBonus.prototype.type   = 'rabbit';
RabbitEnemyBonus.prototype.affect = 'enemy';
RabbitEnemyBonus.prototype.step   = BaseAvatar.prototype.velocity/2;

/**
 * On
 */
RabbitEnemyBonus.prototype.on = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].setVelocity(this.target[i].velocity + this.step);
    }
};

/**
 * Off
 */
RabbitEnemyBonus.prototype.off = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].setVelocity(this.target[i].velocity - this.step);
    }
};