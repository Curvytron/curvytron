/**
 * Turtle Enemy Bonus
 *
 * @param {Array} position
 */
function TurtleEnemyBonus(position)
{
    Bonus.call(this, position);
}

TurtleEnemyBonus.prototype = Object.create(Bonus.prototype);

TurtleEnemyBonus.prototype.type   = 'turtle';
TurtleEnemyBonus.prototype.affect = 'enemy';
TurtleEnemyBonus.prototype.step   = BaseAvatar.prototype.velocity/2;

/**
 * On
 */
TurtleEnemyBonus.prototype.on = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].setVelocity(this.target[i].velocity - this.step);
    }
};

/**
 * Off
 */
TurtleEnemyBonus.prototype.off = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].setVelocity(this.target[i].velocity + this.step);
    }
};