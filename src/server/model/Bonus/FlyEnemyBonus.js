/**
 * Fly Enemy Bonus
 *
 * @param {Array} position
 */
function FlyEnemyBonus(position)
{
    Bonus.call(this, position);
}

FlyEnemyBonus.prototype = Object.create(Bonus.prototype);

FlyEnemyBonus.prototype.type     = 'fly';
FlyEnemyBonus.prototype.affect   = 'enemy';
FlyEnemyBonus.prototype.step     = BaseAvatar.prototype.defaultRadius;
FlyEnemyBonus.prototype.duration = 5000;

/**
 * On
 */
FlyEnemyBonus.prototype.on = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].stopPrinting();
        this.target[i].setInvincible(true);
        this.target[i].setRadius(this.step * 2);
    }
};

/**
 * Off
 */
FlyEnemyBonus.prototype.off = function()
{
    for (var i = this.target.length - 1; i >= 0; i--) {
        this.target[i].togglePrinting();
        this.target[i].setRadius(this.step);
        this.target[i].setInvincible(false);
    }
};
