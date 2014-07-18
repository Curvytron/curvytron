/**
 * Godzilla Enemy Bonus
 *
 * @param {Array} position
 */
function PositionSelfBonus(position)
{
    Bonus.call(this, position);
}

PositionSelfBonus.prototype = Object.create(Bonus.prototype);

PositionSelfBonus.prototype.type   = 'position';
PositionSelfBonus.prototype.affect = 'self';
PositionSelfBonus.prototype.step   = BaseAvatar.prototype.defaultRadius;

/**
 * On
 */
PositionSelfBonus.prototype.on = function()
{
     var point = this.target.game.world.getRandomPosition(this.target.radius, 0.1);
     this.target.setPosition(point);
};

/**
 * Off
 */
PositionSelfBonus.prototype.off = function()
{
};
