/**
 * Teleport Enemy Bonus
 *
 * @param {Array} position
 */
function BonusEnemyTeleport(position)
{
    BonusEnemy.call(this, position);
}

BonusEnemyTeleport.prototype = Object.create(BonusEnemy.prototype);
BonusEnemyTeleport.prototype.constructor = BonusEnemyTeleport;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusEnemyTeleport.prototype.getEffects = function(avatar)
{
    var point = avatar.game.world.getRandomPosition(avatar.radius, 0.1);

    return [
        ['point', point],
        ['printing', -1]];
};