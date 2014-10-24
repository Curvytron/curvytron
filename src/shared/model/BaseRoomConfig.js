/**
 * Base room configuration
 */
function BaseRoomConfig(room)
{
    this.room = room;
}

/**
 * Max score
 *
 * @type {Number}
 */
BaseRoomConfig.prototype.maxScore  = null;
BaseRoomConfig.prototype.speed     = 1;
BaseRoomConfig.prototype.curving   = 1;
BaseRoomConfig.prototype.bonusRate = 1;
BaseRoomConfig.prototype.bonuses   = {
    BonusSelfSmall: true,
    BonusSelfSlow: true,
    BonusSelfFast: true,
    BonusSelfMaster: true,
    BonusEnemySlow: true,
    BonusEnemyFast: true,
    BonusEnemyBig: true,
    BonusEnemyInverse: true,
    BonusAllBorderless: true,
    BonusAllColor: true,
    BonusGameClear: true,
    BonusEnemyStraightAngle: true
};

/**
 * Get available bonuses
 *
 * @return {Array}
 */
BaseRoomConfig.prototype.getAvailableBonuses = function()
{
    return this.bonusTypes;
};

/**
 * Get available bonuses
 *
 * @return {Array}
 */
BaseRoomConfig.prototype.getSelectedBonuses = function()
{
    return this.bonuses;
};

/**
 * Get max score
 *
 * @return {Number}
 */
BaseRoomConfig.prototype.getMaxScore = function()
{
    return this.maxScore ? this.maxScore : this.getDefaultMaxScore();
};

/**
 * Get max score
 *
 * @param {Number} players
 *
 * @return {Number}
 */
BaseRoomConfig.prototype.getDefaultMaxScore = function()
{
    return Math.max(1, (this.room.players.count() - 1) * 10);
};
