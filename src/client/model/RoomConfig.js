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
RoomConfig.prototype.constructor = Room;

/**
 * Bonus classes
 *
 * @type {Object}
 */
RoomConfig.prototype.bonusClasses = {
    BonusSelfSmall: 'bonus-self-fast',
    BonusSelfSlow: 'bonus-enemy-fast',
    BonusSelfFast: 'bonus-self-slow',
    BonusSelfMaster: 'bonus-enemy-slow',
    BonusEnemySlow: 'bonus-enemy-big',
    BonusEnemyFast: 'bonus-self-small',
    BonusEnemyBig: 'bonus-enemy-inverse',
    BonusEnemyInverse: 'bonus-self-master',
    BonusAllBorderless: 'bonus-all-borderless',
    BonusAllColor:'bonus-all-color',
    BonusGameClear: 'bonus-all-clear',
    BonusEnemyStraightAngle: 'bonus-enemy-straight-angle'
};

/**
 * Variables names
 *
 * @type {Object}
 */
RoomConfig.prototype.variablesNames = {
    speed: 'Speed',
    curving: 'Curvig',
    bonusRate: 'Bonus rate'
};
