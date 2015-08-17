/**
 * Inspector
 *
 * @param {Server} server
 * @param {Object} config
 */
function Inspector (server, config)
{
    this.server = server;
    this.client = influx({
        host: config.host,
        username: config.username,
        password: config.password,
        database: config.database
    });

    console.info('Inspector activated on %s', config.host);

    this.trackers = {
        client: new Collection(),
        room:   new Collection(),
        game:   new Collection()
    };

    this.onClientOpen    = this.onClientOpen.bind(this);
    this.onClientClose   = this.onClientClose.bind(this);
    this.onClientLatency = this.onClientLatency.bind(this);
    this.onRoomOpen      = this.onRoomOpen.bind(this);
    this.onRoomClose     = this.onRoomClose.bind(this);
    this.onGameNew       = this.onGameNew.bind(this);
    this.onGameEnd       = this.onGameEnd.bind(this);
    this.onGameFPS       = this.onGameFPS.bind(this);
    this.onLog           = this.onLog.bind(this);
    this.logUsage        = this.logUsage.bind(this);

    this.server.on('client', this.onClientOpen);
    this.server.roomRepository.on('room:open', this.onRoomOpen);
    this.server.roomRepository.on('room:close', this.onRoomClose);

    this.client.writePoint(this.DEPLOY, { version: packageInfo.version }, {}, {});
    this.client.writePoint(this.CLIENTS, this.server.clients.count(), {}, {});
    this.client.writePoint(this.ROOMS, this.server.roomRepository.rooms.count(), {}, {});

    this.logInterval = setInterval(this.onLog, this.logFrequency);
}

Inspector.prototype.DEPLOY             = 'deploy';
Inspector.prototype.CLIENT             = 'client';
Inspector.prototype.CLIENTS            = 'client.total';
Inspector.prototype.CLIENT_PLAYER      = 'client.player';
Inspector.prototype.CLIENT_GAME_PLAYER = 'client.game.player';
Inspector.prototype.CLIENT_LATENCY     = 'client.latency';
Inspector.prototype.ROOM               = 'room';
Inspector.prototype.ROOMS              = 'room.total';
Inspector.prototype.GAME               = 'game';
Inspector.prototype.GAME_FPS           = 'game.fps';
Inspector.prototype.USAGE_MEMORY       = 'usage.memory';
Inspector.prototype.USAGE_CPU          = 'usage.cpu';

/**
 * Usage log frequency
 *
 * @type {Number}
 */
Inspector.prototype.logFrequency = 1000;

/**
 * On client open
 *
 * @param {SocketClient} client
 */
Inspector.prototype.onClientOpen = function(client)
{
    var tracker = new ClientTracker(this, client);

    this.trackers.client.add(tracker);

    tracker.on('latency', this.onClientLatency);
    client.on('close', this.onClientClose);

    this.client.writePoint(this.CLIENTS, this.server.clients.count(), {}, {});
};

/**
 * On client close
 *
 * @param {SocketClient} client
 */
Inspector.prototype.onClientClose = function(client)
{
    var tracker = this.trackers.client.getById(client.id);

    this.client.writePoint(this.CLIENTS, this.server.clients.count(), {}, {});

    if (tracker) {
        client.removeListener('close', this.onClientClose);
        tracker.removeListener('latency', this.onClientLatency);
        this.client.writePoint(this.CLIENT, tracker.getValues(), tracker.getTags(), {});
        this.trackers.client.remove(tracker.destroy());
    }
};

/**
 * On client latency
 *
 * @param {Object} data
 */
Inspector.prototype.onClientLatency = function(data)
{
    this.client.writePoint(this.CLIENT_LATENCY, data.latency, {game: data.tracker.uniqId}, {});
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

    this.client.writePoint(this.ROOMS, this.server.roomRepository.rooms.count(), {}, {});

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
        tracker = this.trackers.room.getById(room.name);

    room.removeListener('game:new', this.onGameNew);

    this.client.writePoint(this.ROOMS, this.server.roomRepository.rooms.count(), {}, {});

    if (tracker) {
        this.client.writePoint(this.ROOM, tracker.getValues(), tracker.getTags(), {});
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
        avatar, client, clientTracker;

    this.trackers.game.add(tracker);

    for (var i = game.avatars.items.length - 1; i >= 0; i--) {
        avatar        = game.avatars.items[i];
        client        = avatar.player.client;
        clientTracker = this.trackers.client.getById(client.id);

        if (clientTracker) {
            this.client.writePoint(
                this.CLIENT_GAME_PLAYER,
                {
                    color: avatar.color,
                    player: md5(avatar.name),
                    game: tracker.uniqId,
                    client: clientTracker.uniqId
                },
                {
                    player: md5(avatar.name),
                    game: tracker.uniqId,
                    client: clientTracker.uniqId
                },
                {}
            );
        }
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
    var game    = data.game,
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
    this.client.writePoint(this.GAME_FPS, data.fps, {game: data.tracker.uniqId}, {});
};

/**
 * Collect data from the given tracker
 *
 * @param {GameTracker} tracker
 */
Inspector.prototype.collectGameTrackerData = function(tracker)
{
    this.client.writePoint(this.GAME, tracker.getValues(), tracker.getTags(), {});
    this.trackers.game.remove(tracker.destroy());
};

/**
 * On every frame
 */
Inspector.prototype.onLog = function()
{
    usage.lookup(process.pid, this.logUsage);
};

/**
 * Log usage
 */
Inspector.prototype.logUsage = function (err, result)
{
    if (result) {
        this.client.writePoint(this.USAGE_CPU, result.cpu, {}, {});
        this.client.writePoint(this.USAGE_MEMORY, result.memory, {}, {});
    }
};
