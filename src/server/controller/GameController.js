/**
 * Game Controller
 */
function GameController(game)
{
    var controller = this;

    this.game        = game;
    this.clients     = new Collection();
    this.socketGroup = new SocketGroup(this.clients);

    this.onDie         = this.onDie.bind(this);
    this.onPoint       = this.onPoint.bind(this);
    this.onProperty    = this.onProperty.bind(this);
    this.onBonusStack  = this.onBonusStack.bind(this);
    this.onBonusPop    = this.onBonusPop.bind(this);
    this.onBonusClear  = this.onBonusClear.bind(this);
    this.onRoundNew    = this.onRoundNew.bind(this);
    this.onRoundEnd    = this.onRoundEnd.bind(this);
    this.onRoundWinner = this.onRoundWinner.bind(this);
    this.onPlayerLeave = this.onPlayerLeave.bind(this);
    this.onClear       = this.onClear.bind(this);
    this.onEnd         = this.onEnd.bind(this);

    this.callbacks = {
        onLoaded: function () { controller.onLoaded(this); },
        onMove: function (data) { controller.onMove(this, data); }
    };

    this.loadGame();
}

/**
 * Load game
 */
GameController.prototype.loadGame = function()
{
    this.game.on('end', this.onEnd);
    this.game.on('clear', this.onClear);
    this.game.on('player:leave', this.onPlayerLeave);
    this.game.on('round:new', this.onRoundNew);
    this.game.on('round:end', this.onRoundEnd);
    this.game.on('round:winner', this.onRoundWinner);
    this.game.bonusManager.on('bonus:pop', this.onBonusPop);
    this.game.bonusManager.on('bonus:clear', this.onBonusClear);

    for (var i = this.game.room.controller.clients.items.length - 1; i >= 0; i--) {
        this.attach(this.game.room.controller.clients.items[i]);
    }
};

/**
 * Remove game
 *
 * @param {Game} game
 */
GameController.prototype.unloadGame = function()
{
    this.game.removeListener('end', this.onEnd);
    this.game.removeListener('round:new', this.onRoundNew);
    this.game.removeListener('round:end', this.onRoundEnd);
    this.game.removeListener('round:winner', this.onRoundWinner);
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
        console.log('client', client.id, client.players.items.length);
        for (var i = client.players.items.length - 1; i >= 0; i--) {
            this.game.removeAvatar(client.players.items[i].avatar);
        }
    } else {
        console.log('unable to remove client', client.id);
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

    client.on('loaded', this.callbacks.onLoaded);

    if (!client.players.isEmpty()) {
        client.on('player:move', this.callbacks.onMove);
    }

    for (var i = client.players.items.length - 1; i >= 0; i--) {
        avatar = client.players.items[i].getAvatar();

        avatar.on('die', this.onDie);
        avatar.on('point', this.onPoint);
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

    client.removeListener('loaded', this.callbacks.onLoaded);

    if (!client.players.isEmpty()) {
        client.removeListener('player:move', this.callbacks.onMove);
    }

    for (var i = client.players.items.length - 1; i >= 0; i--) {
        avatar = client.players.items[i].avatar;

        if (avatar) {
            avatar.removeListener('die', this.onDie);
            avatar.removeListener('point', this.onPoint);
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
            position: 'head',
            angle: 'angle',
            radius: 'radius',
            color: 'color',
            printing: 'printing',
            score: 'score'
        },
        events = [['spectate']],
        avatar, i;

    for (i = this.game.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.game.avatars.items[i];

        for (var property in properties) {
            if (properties.hasOwnProperty(property)) {
                events.push(['property', {avatar: avatar.id, property: property, value: avatar[properties[property]]}]);
            }
        }

        if (!avatar.alive) {
            events.push(['die', {avatar: avatar.id, angle: avatar.angle}]);
        }
    }

    for (i = this.game.bonusManager.bonuses.items.length - 1; i >= 0; i--) {
        events.push(['bonus:pop', this.game.bonusManager.bonuses.items[i].serialize()]);
    }

    client.addEvents(events);
};

/**
 * On game loaded
 *
 * @param {SocketClient} client
 */
GameController.prototype.onLoaded = function(client)
{
    var avatar;

    if (this.game.started) {
        this.attachSpectator(client);
    } else {
        for (var i = client.players.items.length - 1; i >= 0; i--) {
            client.players.items[i].getAvatar().ready = true;
        }

        if (this.game.isReady()) {
            this.game.newRound();
        }
    }
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
        player.avatar.setAngularVelocity(data.move);
    }
};

/**
 * On point
 *
 * @param {Object} data
 */
GameController.prototype.onPoint = function(data)
{
    this.socketGroup.addEvent('point', {avatar: data.avatar.id, point: data.point});
};

/**
 * On die
 *
 * @param {Object} data
 */
GameController.prototype.onDie = function(data)
{
    this.socketGroup.addEvent('die', {avatar: data.avatar.id, angle: data.avatar.angle});
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
 * On property
 *
 * @param {Object} data
 */
GameController.prototype.onProperty = function(data)
{
    if (data.property === 'angle' && this.game.frame && data.avatar.alive) { return; }

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
 * On round new
 *
 * @param {Object} data
 */
GameController.prototype.onRoundNew = function(data)
{
    this.socketGroup.addEvent('round:new');
};

/**
 * On round new
 *
 * @param {Object} data
 */
GameController.prototype.onRoundEnd = function(data)
{
    this.socketGroup.addEvent('round:end');
};

/**
 * On round winner
 *
 * @param {Object} data
 */
GameController.prototype.onRoundWinner = function(data)
{
    this.socketGroup.addEvent('round:winner', {winner: data.winner.id});
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
 * On end
 *
 * @param {Object} data
 */
GameController.prototype.onEnd = function(data)
{
    this.socketGroup.addEvent('end');
    this.unloadGame();
};
