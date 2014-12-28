/**
 * Inspector
 *
 * @param {Server} server
 * @param {Object} config
 */
function Inspector (server, config)
{
    this.server = server;
    this.client = influx(config);

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
    this.onGameFPS     = this.onGameFPS.bind(this);

    this.server.on('client', this.onClientOpen);
    this.server.roomRepository.on('room:open', this.onRoomOpen);
    this.server.roomRepository.on('room:close', this.onRoomClose);

    this.client.writePoint(this.CLIENTS, { value: this.server.clients.count() });
    this.client.writePoint(this.ROOMS, { value: this.server.roomRepository.rooms.count() });
}

Inspector.prototype.CLIENT             = 'client';
Inspector.prototype.CLIENTS            = 'client.total';
Inspector.prototype.CLIENT_PLAYER      = 'client.player';
Inspector.prototype.CLIENT_GAME_PLAYER = 'client.game.player';
Inspector.prototype.ROOM               = 'room';
Inspector.prototype.ROOMS              = 'room.total';
Inspector.prototype.GAME               = 'game';
Inspector.prototype.GAME_FPS           = 'game.fps';

/**
 * On client open
 *
 * @param {SocketClient} client
 */
Inspector.prototype.onClientOpen = function(client)
{
    this.client.writePoint(this.CLIENTS, { value: this.server.clients.count() });

    client.on('close', this.onClientClose);

    this.trackers.client.add(new ClientTracker(this, client));
};

/**
 * On client close
 *
 * @param {SocketClient} client
 */
Inspector.prototype.onClientClose = function(client)
{
    var tracker = this.trackers.client.getById(client.id);

    this.client.writePoint(this.CLIENTS, { value: this.server.clients.count() });

    if (tracker) {
        this.client.writePoint(this.CLIENT, tracker.serialize());
        this.trackers.client.remove(tracker.destroy());
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

    this.trackers.room.add(new RoomTracker(this, room));

    this.client.writePoint(this.ROOMS, { value: this.server.roomRepository.rooms.count() });

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
        game = room.game,
        tracker = this.trackers.room.getById(room.name);

    room.removeListener('game:new', this.onGameNew);

    this.client.writePoint(this.ROOMS, { value: this.server.roomRepository.rooms.count() });

    if (game) {
        this.onGameAbort(game);
    }

    if (tracker) {
        this.client.writePoint(this.ROOM, tracker.serialize());
        this.trackers.room.remove(tracker.destroy());
    }
};

/**
 * On game add
 *
 * @param {Game} game
 */
Inspector.prototype.onGameNew = function(data)
{
    var game = data.game,
        tracker = new GameTracker(this, game),
        avatar, client;

    this.trackers.game.add(tracker);

    for (var i = game.avatars.items.length - 1; i >= 0; i--) {
        avatar = game.avatars.items[i];
        client = avatar.player.client;
        clientTracker = this.trackers.client.getById(client.id);

        this.client.writePoint(
            this.CLIENT_GAME_PLAYER,
            {
                game: tracker.uniqId,
                client: clientTracker.uniqId,
                player: avatar.name,
                color: avatar.color
            }
        );
    }

    tracker.on('fps', this.onGameFPS);
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

    if (tracker) {
        tracker.removeListener('fps', this.onGameFPS);
        this.collectGameTrackerData(tracker);
    }
};

/**
 * On game FPS
 *
 * @param {Object} data
 */
Inspector.prototype.onGameFPS = function(data)
{
    this.client.writePoint(this.GAME_FPS, {
        value: data.fps,
        game: data.tracker.uniqId
    });
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
    this.client.writePoint(this.GAME, tracker.serialize());
    this.trackers.game.remove(tracker.destroy());
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
