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
 * Bonus classes
 *
 * @type {Object}
 */
RoomConfig.prototype.bonusClasses = {
    BonusSelfSmall: 'bonus-self-small',
    BonusSelfSlow: 'bonus-self-slow',
    BonusSelfFast: 'bonus-self-fast',
    BonusSelfMaster: 'bonus-self-master',
    BonusEnemySlow: 'bonus-enemy-slow',
    BonusEnemyFast: 'bonus-enemy-fast',
    BonusEnemyBig: 'bonus-enemy-big',
    BonusEnemyInverse: 'bonus-enemy-inverse',
    BonusEnemyStraightAngle: 'bonus-enemy-straight-angle',
    BonusAllBorderless: 'bonus-all-borderless',
    BonusAllColor:'bonus-all-color',
    BonusGameClear: 'bonus-all-clear'
};

/**
 * Variables names
 *
 * @type {Object}
 */
RoomConfig.prototype.variablesNames = {
    speed: 'Speed',
    curving: 'Curving',
    bonusRate: 'Quantity'
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
            bonuses.push(bonus);
        }
    }

    return bonuses;
};
