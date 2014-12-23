/**
 * Inspector
 *
 * @param {Server} server
 */
function Inspector (server)
{
    this.server       = server;
    this.client       = new StatsD();
    this.gameTrackers = new Collection([], 'name');

    this.onRoomOpen  = this.onRoomOpen.bind(this);
    this.onRoomClose = this.onRoomClose.bind(this);
    this.onGameNew   = this.onGameNew.bind(this);
    this.onGameRound = this.onGameRound.bind(this);
    this.onGameEnd   = this.onGameEnd.bind(this);

    this.client.socket.on('error', this.onError);

    this.server.roomRepository.on('room:open', this.onRoomOpen);
    this.server.roomRepository.on('room:close', this.onRoomClose);
}

Inspector.prototype.ROOM_COUNT    = 'room.count';
Inspector.prototype.GAME_COUNT    = 'game.count';
Inspector.prototype.GAME_FINISHED = 'game.finished';
Inspector.prototype.GAME_SIZE     = 'game.size';
Inspector.prototype.GAME_DURATION = 'game.duration';
Inspector.prototype.GAME_ROUNDS   = 'game.rounds';

/**
 * On room open
 *
 * @param {Object} data
 */
Inspector.prototype.onRoomOpen = function(data)
{
    console.log('increment ROOM_COUNT');
    this.client.increment(this.ROOM_COUNT);

    data.room.on('game:new', this.onGameNew);
};

/**
 * On room open
 *
 * @param {Object} data
 */
Inspector.prototype.onRoomClose = function(data)
{
    var room = data.room,
        game = room.game;

    console.log('decrement ROOM_COUNT');
    this.client.decrement(this.ROOM_COUNT);

    room.removeListener('game:new', this.onGameNew);

    if (game) {
        this.onGameAbort(game);
    }
};

/**
 * On game add
 *
 * @param {Game} game
 */
Inspector.prototype.onGameNew = function(data)
{
    var game = data.game;

    console.log('increment GAME_COUNT');
    this.client.increment(this.GAME_COUNT);

    this.gameTrackers.add({
        name: game.name,
        creation: new Date(),
        rounds: 0
    });

    console.log('gauge GAME_SIZE', game.avatars.count());
    this.client.gauge(this.GAME_SIZE, game.avatars.count());

    game.on('round:new', this.onGameRound);
    game.on('end', this.onGameEnd);
};

/**
 * On game round
 *
 * @param {Game} game
 */
Inspector.prototype.onGameRound = function(data)
{
    var tracker = this.getGameTracker(data.game.name);

    if (tracker) {
        tracker.rounds++;
    }
};

/**
 * On game end
 *
 * @param {Game} game
 */
Inspector.prototype.onGameEnd = function(data)
{
    var game = data.game,
        tracker = this.getGameTracker(game.name);

    game.removeListener('round:new', this.onGameRound);
    game.removeListener('end', this.onGameEnd);

    console.log('decrement GAME_COUNT');
    this.client.decrement(this.GAME_COUNT);
    console.log('increment GAME_FINISHED');
    this.client.increment(this.GAME_FINISHED);

    if (tracker) {
        console.log('gauge GAME_ROUNDS', tracker.rounds);
        client.gauge(this.GAME_ROUNDS, tracker.rounds);
        console.log('timing GAME_DURATION', new Date() - tracker.duration);
        client.timing(this.GAME_DURATION, new Date() - tracker.duration);
    }
};

/**
 * On game is aborted
 *
 * @param {Game} game
 */
Inspector.prototype.onGameAbort = function(game)
{
    var tracker = this.getGameTracker(game.name);

    game.removeListener('round:new', this.onGameRound);
    game.removeListener('end', this.onGameEnd);

    console.log('decrement GAME_COUNT');
    this.client.decrement(this.GAME_COUNT);
};

/**
 * Get game tracker
 *
 * @param {String} name
 *
 * @return {Object}
 */
Inspector.prototype.getGameTracker = function(name)
{
    if (typeof(this.gameTrackers[name]) === 'undefined') {
        return null;
    }

    return this.gameTrackers[name];
};

/**
 * On StatsD error
 *
 * @param {Error} error
 */
Inspector.prototype.onError = function (error)
{
    return console.error('Inspector | Error in socket:', error);
};
