/**
 * Room tracker
 *
 * @param {Inspector} inspector
 * @param {Room} room
 */
function RoomTracker (inspector, room)
{
    Tracker.call(this, inspector, room.name);

    this.room  = room;
    this.games = 0;

    this.onGame = this.onGame.bind(this);

    this.room.on('game:new', this.onGame);
}

RoomTracker.prototype = Object.create(Tracker.prototype);
RoomTracker.prototype.constructor = RoomTracker;

/**
 * On game
 */
RoomTracker.prototype.onGame = function()
{
    this.games++;
};
/**
 * @inheritDoc
 */
RoomTracker.prototype.destroy = function()
{
    this.room.removeListener('game:new', this.onGame);

    return Tracker.prototype.destroy.call(this);
};

/**
 * @inheritDoc
 */
RoomTracker.prototype.getValues = function()
{
    var data = Tracker.prototype.getValues.call(this);

    data.games = this.games;

    return data;
};
