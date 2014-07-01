/**
 * Game Controller
 */
function GameController()
{
    var controller = this;

    this.games = new Collection([], 'name');

    this.onDie         = this.onDie.bind(this);
    this.onAngle       = this.onAngle.bind(this);
    this.onPosition    = this.onPosition.bind(this);
    this.onBonusPop    = this.onBonusPop.bind(this);
    this.onBonusClear  = this.onBonusClear.bind(this);
    this.onPrinting    = this.onPrinting.bind(this);
    this.onPoint       = this.onPoint.bind(this);
    this.onScore       = this.onScore.bind(this);
    this.onTrailClear  = this.onTrailClear.bind(this);
    this.onRoundNew    = this.onRoundNew.bind(this);
    this.onRoundEnd    = this.onRoundEnd.bind(this);
    this.onRoundWinner = this.onRoundWinner.bind(this);
    this.onEnd         = this.onEnd.bind(this);

    this.callbacks = {
        onGameLoaded: function () { controller.onGameLoaded(this); },
        onMove: function (data) { controller.onMove(this, data); },
    };
}

/**
 * Add game
 *
 * @param {Game} game
 */
GameController.prototype.addGame = function(game)
{
    if (this.games.add(game)) {
        game.on('end', this.onEnd);
        game.on('round:new', this.onRoundNew);
        game.on('round:end', this.onRoundEnd);
        game.on('round:winner', this.onRoundWinner);
        game.bonusManager.on('bonus:pop', this.onBonusPop);
        game.bonusManager.on('bonus:clear', this.onBonusClear);

        for (var i = game.clients.items.length - 1; i >= 0; i--) {
            this.attach(game.clients.items[i], game);
        }
    }
};

/**
 * Remove game
 *
 * @param {Game} game
 */
GameController.prototype.removeGame = function(game)
{
    if (this.games.remove(game)) {
        game.removeListener('end', this.onEnd);
        game.removeListener('round:new', this.onRoundNew);
        game.removeListener('round:end', this.onRoundEnd);
        game.removeListener('round:winner', this.onRoundWinner);
        game.bonusManager.removeListener('bonus:pop', this.onBonusPop);
        game.bonusManager.removeListener('bonus:clear', this.onBonusClear);

        for (var i = game.clients.items.length - 1; i >= 0; i--) {
            this.detach(game.clients.items[i], game);
        }
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attach = function(client, game)
{
    this.attachEvents(client);
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.detach = function(client)
{
    this.detachEvents(client);

    var avatar;

    if (client.room.game) {
        for (var i = client.players.items.length - 1; i >= 0; i--) {
            avatar = client.players.items[i].avatar;
            client.room.game.client.addEvent('game:leave', {avatar: avatar.name});
            client.room.game.removeAvatar(avatar);
        }
    }
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attachEvents = function(client)
{
    var controller = this,
        avatar;

    client.on('loaded', this.callbacks.onGameLoaded);
    client.on('player:move', this.callbacks.onMove);

    for (var i = client.players.items.length - 1; i >= 0; i--) {
        avatar = client.players.items[i].avatar;

        avatar.on('die', this.onDie);
        avatar.on('angle', this.onAngle);
        avatar.on('position', this.onPosition);
        avatar.on('printing', this.onPrinting);
        avatar.on('point', this.onPoint);
        avatar.on('score', this.onScore);
        avatar.trail.on('clear', this.onTrailClear);
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

    client.removeListener('loaded', this.callbacks.onGameLoaded);
    client.removeListener('player:move', this.callbacks.onMove);

    for (var i = client.players.items.length - 1; i >= 0; i--) {
        avatar = client.players.items[i].avatar;

        avatar.removeListener('die', this.onDie);
        avatar.removeListener('angle', this.onAngle);
        avatar.removeListener('position', this.onPosition);
        avatar.removeListener('printing', this.onPrinting);
        avatar.removeListener('point', this.onPoint);
        avatar.removeListener('score', this.onScore);
        avatar.trail.removeListener('clear', this.onTrailClear);
    }
};

/**
 * On game loaded
 *
 * @param {SocketClient} client
 */
GameController.prototype.onGameLoaded = function(client)
{
    var game = client.room.game,
        avatar;

    for (var i = client.players.items.length - 1; i >= 0; i--) {
        avatar = client.players.items[i].avatar;
        avatar.ready = true;
    }

    if (game.isReady()) {
        game.newRound();
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
 * On position
 *
 * @param {Object} data
 */
GameController.prototype.onPosition = function(data)
{
    var avatar = data.avatar,
        game = avatar.player.client.room.game,
        point = data.point;

    game.client.addEvent('position', {avatar: avatar.name, point: point});
};

/**
 * On printing
 *
 * @param {Object} data
 */
GameController.prototype.onPrinting = function(data)
{
    var avatar = data.avatar,
        game = avatar.player.client.room.game,
        printing = data.printing;

    game.client.addEvent('printing', {avatar: avatar.name, printing: printing});
};

/**
 * On angle
 *
 * @param {Object} data
 */
GameController.prototype.onAngle = function(data)
{
    var avatar = data.avatar,
        game = avatar.player.client.room.game,
        angle = data.angle;

    if(!avatar.player.client.room.game.isPlaying()) {
        game.client.addEvent('angle', {avatar: avatar.name, angle: angle});
    }
};

/**
 * On point
 *
 * @param {Object} data
 */
GameController.prototype.onPoint = function(data)
{
    var avatar = data.avatar,
        game = avatar.player.client.room.game,
        point = data.point;

    if (data.important) {
        game.client.addEvent('point', {avatar: avatar.name, point: point});
    }
};

/**
 * On die
 *
 * @param {Object} data
 */
GameController.prototype.onDie = function(data)
{
    var avatar = data.avatar,
        game = avatar.player.client.room.game;

    game.client.addEvent('die', {avatar: avatar.name});
};

/**
 * On bonus pop
 *
 * @param {Object} data
 */
GameController.prototype.onBonusPop = function(data)
{
    var game = data.game, bonus = data.bonus;

    game.client.addEvent('bonus:pop', bonus.serialize());
};

/**
 * On bonus clear
 *
 * @param {Object} data
 */
GameController.prototype.onBonusClear = function(data)
{
    var game = data.game, bonus = data.bonus;

    game.client.addEvent('bonus:clear', {bonus: bonus.id});
};

/**
 * On score
 *
 * @param {Object} data
 */
GameController.prototype.onScore = function(data)
{
    var avatar = data.avatar,
        game = avatar.player.client.room.game,
        score = data.score;

    game.client.addEvent('score', {avatar: avatar.name, score: score});
};

/**
 * On point
 *
 * @param {Object} data
 */
GameController.prototype.onTrailClear = function(data)
{
    var avatar = data.avatar,
        game = avatar.player.client.room.game;

    game.client.addEvent('trail:clear', {avatar: avatar.name});
};

// Game events:

/**
 * On round new
 *
 * @param {Object} data
 */
GameController.prototype.onRoundNew = function(data)
{
    data.game.client.addEvent('round:new');
};

/**
 * On round new
 *
 * @param {Object} data
 */
GameController.prototype.onRoundEnd = function(data)
{
    data.game.client.addEvent('round:end');
};

/**
 * On round winner
 *
 * @param {Object} data
 */
GameController.prototype.onRoundWinner = function(data)
{
    data.game.client.addEvent('round:winner', {winner: data.winner.name});
};

/**
 * On end
 *
 * @param {Object} data
 */
GameController.prototype.onEnd = function(data)
{
    data.game.client.addEvent('end');
};
