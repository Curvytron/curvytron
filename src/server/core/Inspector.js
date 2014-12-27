/**
 * Inspector
 *
 * @param {Server} server
 */
function Inspector (server)
{
    this.server = server;
    this.client = new StatsD();

    this.trackers = {
        client: new Collection(),
        room:   new Collection(),
        game:   new Collection()
    };

    this.onClientOpen  = this.onClientOpen.bind(this);
    this.onClientClose = this.onClientClose.bind(this);
    this.onRoomOpen    = this.onRoomOpen.bind(this);
    this.onRoomClose   = this.onRoomClose.bind(this);
    this.onGameNew     = this.onGameNew.bind(this);
    this.onGameEnd     = this.onGameEnd.bind(this);

    this.client.socket.on('error', this.onError);

    this.server.on('client', this.onClientOpen);
    this.server.roomRepository.on('room:open', this.onRoomOpen);
    this.server.roomRepository.on('room:close', this.onRoomClose);
}

Inspector.prototype.CLIENT_CONNECTED = 'client.connected';
Inspector.prototype.CLIENT_DURATION  = 'client.duration';
Inspector.prototype.ROOM_COUNT       = 'room.count';
Inspector.prototype.ROOM_DURATION    = 'room.duration';
Inspector.prototype.ROOM_GAME_COUNT  = 'room.game.count';
Inspector.prototype.GAME_COUNT       = 'game.count';
Inspector.prototype.GAME_END_FINISH  = 'game.end.finish';
Inspector.prototype.GAME_END_ABORT   = 'game.end.abort';
Inspector.prototype.GAME_SIZE        = 'game.size';
Inspector.prototype.GAME_DURATION    = 'game.duration';
Inspector.prototype.GAME_ROUNDS      = 'game.rounds';

/**
 * On client open
 *
 * @param {SocketClient} client
 */
Inspector.prototype.onClientOpen = function(client)
{
    this.client.gauge(this.CLIENT_CONNECTED, '+1');

    client.on('close', this.onClientClose);

    this.trackers.client.add(new ClientTracker(client));
};

/**
 * On client close
 *
 * @param {SocketClient} client
 */
Inspector.prototype.onClientClose = function(client)
{
    var tracker = this.trackers.client.getById(client.id);

    this.client.gauge(this.CLIENT_CONNECTED, '-1');

    if (tracker) {
        this.client.timing(this.CLIENT_DURATION, tracker.getDuration());
    }
};

/**
 * On room open
 *
 * @param {Object} data
 */
Inspector.prototype.onRoomOpen = function(data)
{
    var room = data.room;

    this.trackers.room.add(new RoomTracker(room));

    this.client.gauge(this.ROOM_COUNT, '+1');

    room.on('game:new', this.onGameNew);
};

/**
 * On room open
 *
 * @param {Object} data
 */
Inspector.prototype.onRoomClose = function(data)
{
    var room = data.room,
        game = room.game
        tracker = this.trackers.room.getById(room.name);

    room.removeListener('game:new', this.onGameNew);

    this.client.gauge(this.ROOM_COUNT, '-1');

    if (game) {
        this.onGameAbort(game);
    }

    if (tracker) {
        this.client.timing(this.ROOM_GAME_COUNT, tracker.games);
        this.client.timing(this.ROOM_DURATION, tracker.getDuration());
        tracker.detach();
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

    this.trackers.game.add(new GameTracker(game));

    this.client.gauge(this.GAME_COUNT, '+1');
    this.client.timing(this.GAME_SIZE, game.avatars.count());

    game.on('end', this.onGameEnd);
};

/**
 * On game end
 *
 * @param {Game} game
 */
Inspector.prototype.onGameEnd = function(data)
{
    var game = data.game,
        tracker = this.trackers.game.getById(game.name);

    game.removeListener('end', this.onGameEnd);

    this.client.gauge(this.GAME_COUNT, '-1');
    this.client.increment(this.GAME_END_FINISH);

    if (tracker) {
        this.collectGameTrackerData(tracker);
    }
};

/**
 * On game is aborted
 *
 * @param {Game} game
 */
Inspector.prototype.onGameAbort = function(game)
{
    var tracker = this.trackers.game.getById(game.name);

    game.removeListener('end', this.onGameEnd);

    this.client.gauge(this.GAME_COUNT, '-1');
    this.client.increment(this.GAME_END_ABORT);

    if (tracker) {
        this.collectGameTrackerData(tracker);
    }
};

/**
 * Collect data from the given tracker
 *
 * @param {GameTracker} tracker
 */
Inspector.prototype.collectGameTrackerData = function(tracker)
{
    this.client.timing(this.GAME_ROUNDS, tracker.rounds);
    this.client.timing(this.GAME_DURATION, tracker.getDuration());
    tracker.detach();
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
