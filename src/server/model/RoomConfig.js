/**
 * Room Configuration
 *
 * @param {Room} room
 */
function RoomConfig(room)
{
    BaseRoomConfig.call(this, room);
}

RoomConfig.prototype = Object.create(BaseRoomConfig.prototype);
RoomConfig.prototype.constructor = RoomConfig;

/**
 * Bonus types
 *
 * @type {Array}
 */
RoomConfig.prototype.bonusTypes = {
    BonusSelfSmall: BonusSelfSmall,
    BonusSelfSlow: BonusSelfSlow,
    BonusSelfFast: BonusSelfFast,
    BonusSelfMaster: BonusSelfMaster,
    BonusEnemySlow: BonusEnemySlow,
    BonusEnemyFast: BonusEnemyFast,
    BonusEnemyBig: BonusEnemyBig,
    BonusEnemyInverse: BonusEnemyInverse,
    BonusGameBorderless: BonusGameBorderless,
    BonusAllColor: BonusAllColor,
    BonusGameClear: BonusGameClear,
    BonusEnemyStraightAngle: BonusEnemyStraightAngle
};

/**
 * Get available bonuses
 *
 * @return {Array}
 */
RoomConfig.prototype.getBonuses = function()
{
    var bonuses = [];

    for (var bonus in this.bonuses) {
        if (this.bonuses[bonus]) {
            bonuses.push(this.bonusTypes[bonus]);
        }
    }

    return bonuses;
};
