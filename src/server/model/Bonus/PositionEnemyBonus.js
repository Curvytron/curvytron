/**
 * Godzilla Enemy Bonus
 *
 * @param {Array} position
 */
function PositionEnemyBonus(position)
{
    Bonus.call(this, position);
}

PositionEnemyBonus.prototype = Object.create(Bonus.prototype);

PositionEnemyBonus.prototype.type   = 'position';
PositionEnemyBonus.prototype.affect = 'enemy';
PositionEnemyBonus.prototype.step   = BaseAvatar.prototype.defaultRadius;

/**
 * On
 */
PositionEnemyBonus.prototype.on = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        var point = this.target[i].game.world.getRandomPosition(this.target[i].radius, 0.1);
        this.target[i].setPosition(point);
    }
};

/**
 * Off
 */
PositionEnemyBonus.prototype.off = function()
{
};
