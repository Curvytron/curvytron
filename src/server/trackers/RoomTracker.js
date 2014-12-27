/**
 * Room tracker
 *
 * @param {Room} room
 */
function RoomTracker (room)
{
    Tracker.call(this, room.name);

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
 * Detach tracker
 */
RoomTracker.prototype.detach = function()
{
    this.room.removeListener('game:new', this.onGame);
};
