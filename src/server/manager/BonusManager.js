/**
 * Bonus Manager
 *
 * @param {Game} game
 */
function BonusManager(game)
{
    BaseBonusManager.call(this, game);
}

BonusManager.prototype = Object.create(BaseBonusManager.prototype);