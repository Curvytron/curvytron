/**
 * Teleport Self Bonus
 *
 * @param {Array} position
 */
function BonusSelfTeleport(position)
{
    BonusSelf.call(this, position);
}

BonusSelfTeleport.prototype = Object.create(BonusSelf.prototype);
BonusSelfTeleport.prototype.constructor = BonusSelfTeleport;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusSelfTeleport.prototype.getEffects = function(avatar)
{
    var point = avatar.game.world.getRandomPosition(avatar.radius, 0.1);

    return [
        ['point', point],
        ['printing', -1]];
};