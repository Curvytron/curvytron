/**
 * Game Controller
 */
function GameController(game)
{
    var controller = this;

    this.game        = game;
    this.clients     = new Collection();
    this.socketGroup = new SocketGroup(this.clients);
    this.compressor  = new Compressor();
    this.waiting     = null;

    this.onGameStart       = this.onGameStart.bind(this);
    this.onGameStop        = this.onGameStop.bind(this);
    this.onDie             = this.onDie.bind(this);
    this.onPosition        = this.onPosition.bind(this);
    this.onAngle           = this.onAngle.bind(this);
    this.onAngularVelocity = this.onAngularVelocity.bind(this);
    this.onPoint           = this.onPoint.bind(this);
    this.onScore           = this.onScore.bind(this);
    this.onRoundScore      = this.onRoundScore.bind(this);
    this.onProperty        = this.onProperty.bind(this);
    this.onBonusStack      = this.onBonusStack.bind(this);
    this.onBonusPop        = this.onBonusPop.bind(this);
    this.onBonusClear      = this.onBonusClear.bind(this);
    this.onRoundNew        = this.onRoundNew.bind(this);
    this.onRoundEnd        = this.onRoundEnd.bind(this);
    this.onPlayerLeave     = this.onPlayerLeave.bind(this);
    this.onClear           = this.onClear.bind(this);
    this.onBorderless      = this.onBorderless.bind(this);
    this.onEnd             = this.onEnd.bind(this);
    this.stopWaiting       = this.stopWaiting.bind(this);

    this.callbacks = {
        onReady: function () { controller.onReady(this); },
        onMove: function (data) { controller.onMove(this, data); }
    };

    this.loadGame();
}

/**
 * Waiting time
 *
 * @type {Number}
 */
GameController.prototype.waitingTime = 5000;

/**
 * Load game
 */
GameController.prototype.loadGame = function()
{
    this.game.on('game:start', this.onGameStart);
    this.game.on('game:stop', this.onGameStop);
    this.game.on('end', this.onEnd);
    this.game.on('clear', this.onClear);
    this.game.on('player:leave', this.onPlayerLeave);
    this.game.on('round:new', this.onRoundNew);
    this.game.on('round:end', this.onRoundEnd);
    this.game.on('borderless', this.onBorderless);
    this.game.bonusManager.on('bonus:pop', this.onBonusPop);
    this.game.bonusManager.on('bonus:clear', this.onBonusClear);

    for (var i = this.game.room.controller.clients.items.length - 1; i >= 0; i--) {
        this.attach(this.game.room.controller.clients.items[i]);
    }

    this.waiting = setTimeout(this.stopWaiting, this.waitingTime);
};

/**
 * Remove game
 *
 * @param {Game} game
 */
GameController.prototype.unloadGame = function()
{
    this.game.removeListener('game:start', this.onGameStart);
    this.game.removeListener('game:stop', this.onGameStop);
    this.game.removeListener('end', this.onEnd);
    this.game.removeListener('clear', this.onClear);
    this.game.removeListener('player:leave', this.onPlayerLeave);
    this.game.removeListener('round:new', this.onRoundNew);
    this.game.removeListener('round:end', this.onRoundEnd);
    this.game.removeListener('borderless', this.onBorderless);
    this.game.bonusManager.removeListener('bonus:pop', this.onBonusPop);
    this.game.bonusManager.removeListener('bonus:clear', this.onBonusClear);

    for (var i = this.clients.items.length - 1; i >= 0; i--) {
        this.detach(this.clients.items[i]);
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attach = function(client)
{
    if (this.clients.add(client)) {
        this.attachEvents(client);
        this.socketGroup.addEvent('game:spectators', this.countSpectators());
        client.pingLogger.start();
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.detach = function(client)
{
    this.detachEvents(client);

    if (this.clients.remove(client)) {
        for (var i = client.players.items.length - 1; i >= 0; i--) {
            this.game.removeAvatar(client.players.items[i].avatar);
        }
        this.socketGroup.addEvent('game:spectators', this.countSpectators());
        client.pingLogger.stop();
    }
};

/**
 * On player leave
 */
GameController.prototype.onPlayerLeave = function(data)
{
    this.socketGroup.addEvent('game:leave', {avatar: data.player.id});
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attachEvents = function(client)
{
    var avatar;

    client.on('ready', this.callbacks.onReady);

    if (!client.players.isEmpty()) {
        client.on('player:move', this.callbacks.onMove);
    }

    for (var i = client.players.items.length - 1; i >= 0; i--) {
        avatar = client.players.items[i].getAvatar();

        avatar.on('die', this.onDie);
        avatar.on('position', this.onPosition);
        avatar.on('angle', this.onAngle);
        avatar.on('angularVelocity', this.onAngularVelocity);
        avatar.on('point', this.onPoint);
        avatar.on('score', this.onScore);
        avatar.on('score:round', this.onRoundScore);
        avatar.on('property', this.onProperty);
        avatar.bonusStack.on('change', this.onBonusStack);
    }
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.detachEvents = function(client)
{
    var avatar;

    client.removeListener('ready', this.callbacks.onReady);

    if (!client.players.isEmpty()) {
        client.removeListener('player:move', this.callbacks.onMove);
    }

    for (var i = client.players.items.length - 1; i >= 0; i--) {
        avatar = client.players.items[i].avatar;

        if (avatar) {
            avatar.removeListener('die', this.onDie);
            avatar.removeListener('position', this.onPosition);
            avatar.removeListener('angularVelocity', this.onAngularVelocity);
            avatar.removeListener('point', this.onPoint);
            avatar.removeListener('score', this.onScore);
            avatar.removeListener('score:round', this.onRoundScore);
            avatar.removeListener('property', this.onProperty);
            avatar.bonusStack.removeListener('change', this.onBonusStack);
        }
    }
};

/**
 * Attach spectator
 *
 * @param {SocketClient} client
 */
GameController.prototype.attachSpectator = function(client)
{
    var properties = {
            angle: 'angle',
            radius: 'radius',
            color: 'color',
            printing: 'printing',
            score: 'score'
        },
        events = [['spectate', {
            inRound: this.game.inRound,
            rendered: this.game.rendered ? true : false,
            maxScore: this.game.maxScore
        }]],
        avatar, i;

    for (i = this.game.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.game.avatars.items[i];

        events.push(['position', [avatar.id, this.compressor.compressPosition(avatar.head[0], avatar.head[1])]]);

        for (var property in properties) {
            if (properties.hasOwnProperty(property)) {
                events.push(['property', {avatar: avatar.id, property: property, value: avatar[properties[property]]}]);
            }
        }

        if (!avatar.alive) {
            events.push(['die', {avatar: avatar.id}]);
        }
    }

    if (this.game.inRound) {
        for (i = this.game.bonusManager.bonuses.items.length - 1; i >= 0; i--) {
            events.push(['bonus:pop', this.game.bonusManager.bonuses.items[i].serialize()]);
        }
    } else {
        this.socketGroup.addEvent('round:end', {winner: this.game.roundWinner ? this.game.roundWinner.id : null});
    }

    events.push(['game:spectators', this.countSpectators()]);

    client.addEvents(events);
};

/**
 * Count spectators
 *
 * @return {Number}
 */
GameController.prototype.countSpectators = function()
{
    return this.clients.filter(function () { return !this.isPlaying(); }).count();
};

/**
 * On game loaded
 *
 * @param {SocketClient} client
 */
GameController.prototype.onReady = function(client)
{
    var avatar;

    if (this.game.started) {
        this.attachSpectator(client);
    } else {
        for (var i = client.players.items.length - 1; i >= 0; i--) {
            avatar = client.players.items[i].getAvatar();
            avatar.ready = true;
            this.socketGroup.addEvent('ready', {avatar: avatar.id});
        }

        this.checkReady();
    }
};

/**
 * Check if all players are ready
 */
GameController.prototype.checkReady = function()
{
    if (this.game.isReady()) {
        this.waiting = clearTimeout(this.waiting);
        this.game.newRound();
    }
};

/**
 * Stop waiting for loading players
 */
GameController.prototype.stopWaiting = function()
{
    this.waiting = clearTimeout(this.waiting);

    var avatars = this.game.getLoadingAvatars();

    for (var i = avatars.items.length - 1; i >= 0; i--) {
        this.detach(avatars.items[i].player.client);
    }

    this.checkReady();
};

/**
 * On move
 *
 * @param {SocketClient} client
 * @param {Number} move
 */
GameController.prototype.onMove = function(client, data)
{
    var player = client.players.getById(data.avatar);

    if (player && player.avatar) {
        player.avatar.updateAngularVelocity(data.move);
    }
};

/**
 * On point
 *
 * @param {Object} data
 */
GameController.prototype.onPoint = function(data)
{
    if (data.important) {
        var point = this.compressor.compressPosition(data.point[0], data.point[1]);
        point.push(data.avatar.id);
        this.socketGroup.addEvent('point', point);
    }
};

/**
 * On position
 *
 * @param {Object} data
 */
GameController.prototype.onPosition = function(data)
{
    var point = this.compressor.compressPosition(data.value[0], data.value[1]);
    point.push(data.avatar.id);
    this.socketGroup.addEvent('position', point);
};

/**
 * On angle
 *
 * @param {Object} data
 */
GameController.prototype.onAngle = function(data)
{
    this.socketGroup.addEvent('angle', [data.avatar.id, data.angle]);
};

/**
 * On angular velocity
 *
 * @param {Object} data
 */
GameController.prototype.onAngularVelocity = function(data)
{
    this.socketGroup.addEvent('angularVelocity', [data.avatar.id, data.angularVelocity]);
};

/**
 * On die
 *
 * @param {Object} data
 */
GameController.prototype.onDie = function(data)
{
    this.socketGroup.addEvent('die', {
        avatar: data.avatar.id,
        killer: data.killer ? data.killer.id : null,
        old: data.old
    });
};

/**
 * On bonus pop
 *
 * @param {Object} data
 */
GameController.prototype.onBonusPop = function(data)
{
    this.socketGroup.addEvent('bonus:pop', data.bonus.serialize());
};

/**
 * On bonus clear
 *
 * @param {Object} data
 */
GameController.prototype.onBonusClear = function(data)
{
    this.socketGroup.addEvent('bonus:clear', {bonus: data.bonus.id});
};

/**
 * On score
 *
 * @param {Object} data
 */
GameController.prototype.onScore = function(data)
{
    this.socketGroup.addEvent('score', {avatar: data.avatar.id, score: data.score});
};

/**
 * On round score
 *
 * @param {Object} data
 */
GameController.prototype.onRoundScore = function(data)
{
    this.socketGroup.addEvent('score:round', {avatar: data.avatar.id, score: data.score});
};

/**
 * On property
 *
 * @param {Object} data
 */
GameController.prototype.onProperty = function(data)
{
    this.socketGroup.addEvent('property', {avatar: data.avatar.id, property: data.property, value: data.value});
};

/**
 * On bonus stack add
 *
 * @param {Object} data
 */
GameController.prototype.onBonusStack = function(data)
{
    this.socketGroup.addEvent('bonus:stack', {avatar: data.avatar.id, method: data.method, bonus: data.bonus.serialize()});
};

// Game events:

/**
 * On game start
 *
 * @param {Object} data
 */
GameController.prototype.onGameStart = function(data)
{
    this.socketGroup.addEvent('game:start');
};

/**
 * On game stop
 *
 * @param {Object} data
 */
GameController.prototype.onGameStop = function(data)
{
    this.socketGroup.addEvent('game:stop');
};

/**
 * On round new
 *
 * @param {Object} data
 */
GameController.prototype.onRoundNew = function(data)
{
    this.socketGroup.addEvent('round:new');
};

/**
 * On round end
 *
 * @param {Object} data
 */
GameController.prototype.onRoundEnd = function(data)
{
    this.socketGroup.addEvent('round:end', {winner: data.winner ? data.winner.id : null});
};

/**
 * On clear
 *
 * @param {Object} data
 */
GameController.prototype.onClear = function(data)
{
    this.socketGroup.addEvent('clear');
};

/**
 * On borderless
 *
 * @param {Object} data
 */
GameController.prototype.onBorderless = function(data)
{
    this.socketGroup.addEvent('borderless', data);
};

/**
 * On end
 *
 * @param {Object} data
 */
GameController.prototype.onEnd = function(data)
{
    this.socketGroup.addEvent('end');
    this.unloadGame();
};
