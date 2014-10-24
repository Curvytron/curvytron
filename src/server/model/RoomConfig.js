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

RoomConfig.prototype.bonusTypes = [
    BonusSelfSmall,
    BonusSelfSlow,
    BonusSelfFast,
    BonusSelfMaster,
    BonusEnemySlow,
    BonusEnemyFast,
    BonusEnemyBig,
    BonusEnemyInverse,
    BonusAllBorderless,
    BonusAllColor,
    BonusGameClear,
    BonusEnemyStraightAngle
];
