/**
 * Game Controller
 *
 * @param {Object} $scope
 * @param {Object} $routeParams
 * @param {SocketClient} client
 * @param {RoomRepository} repository
 * @param {Profile} profile
 * @param {Chat} chat
 */
function GameController($scope, $routeParams, $location, client, repository, profile, chat)
{
    this.$scope         = $scope;
    this.$location      = $location;
    this.client         = client;
    this.repository     = repository;
    this.profile        = profile;
    this.chat           = chat;
    this.room           = null;
    this.game           = null;
    this.warmupInterval = null;

    // Binding
    this.onMove        = this.onMove.bind(this);
    this.onBonusPop    = this.onBonusPop.bind(this);
    this.onBonusClear  = this.onBonusClear.bind(this);
    this.onBonusStack  = this.onBonusStack.bind(this);
    this.onPoint       = this.onPoint.bind(this);
    this.onDie         = this.onDie.bind(this);
    this.onProperty    = this.onProperty.bind(this);
    this.onWarmup      = this.onWarmup.bind(this);
    this.endWarmup     = this.endWarmup.bind(this);
    this.onRoundNew    = this.onRoundNew.bind(this);
    this.onRoundEnd    = this.onRoundEnd.bind(this);
    this.onRoundWinner = this.onRoundWinner.bind(this);
    this.onClear       = this.onClear.bind(this);
    this.onEnd         = this.onEnd.bind(this);
    this.onLeave       = this.onLeave.bind(this);
    this.onSpectate    = this.onSpectate.bind(this);
    this.leaveGame     = this.leaveGame.bind(this);
    this.backToRoom    = this.backToRoom.bind(this);
    this.toggleSound   = this.toggleSound.bind(this);

    this.attachSocketEvents();

    this.$scope.$on('$destroy', this.leaveGame);

    // Hydrate scope:
    this.$scope.sortorder   = '-score';
    this.$scope.warmup      = false;
    this.$scope.phase       = 'round';
    this.$scope.end         = false;
    this.$scope.tieBreak    = false;
    this.$scope.sound       = this.profile.sound;
    this.$scope.backToRoom  = this.backToRoom;
    this.$scope.toggleSound = this.toggleSound;
    this.$scope.roundWinner = null;
    this.$scope.gameWinner  = null;

    this.repository.start();
    this.chat.setScope(this.$scope);
    this.initSound();

    var name = decodeURIComponent($routeParams.name);

    if (!this.repository.room || this.repository.room.name !== name) {
        this.$location.path('/room/' + encodeURIComponent(name));
    } else {
        this.loadGame(this.repository.room);
    }
}

/**
 * Audio volume
 *
 * @type {Number}
 */
GameController.prototype.volume = 0.5;

/**
 * Initialize sound
 */
GameController.prototype.initSound = function()
{
    createjs.Sound.alternateExtensions = ['mp3'];

    createjs.Sound.registerSounds(
        [
            {id:'loose', src:'loose.ogg'},
            {id:'win', src:'win.ogg'}
        ],
        'sounds/'
    );

    createjs.Sound.setVolume(this.$scope.sound ? this.volume : 0);
};

/**
 * Attach socket Events
 */
GameController.prototype.attachSocketEvents = function()
{
    this.client.on('property', this.onProperty);
    this.client.on('point', this.onPoint);
    this.client.on('die', this.onDie);
    this.client.on('bonus:pop', this.onBonusPop);
    this.client.on('bonus:clear', this.onBonusClear);
    this.client.on('bonus:stack', this.onBonusStack);
    this.client.on('round:new', this.onRoundNew);
    this.client.on('round:end', this.onRoundEnd);
    this.client.on('round:winner', this.onRoundWinner);
    this.client.on('clear', this.onClear);
    this.client.on('end', this.onEnd);
    this.client.on('game:leave', this.onLeave);
    this.client.on('spectate', this.onSpectate);
};

/**
 * Attach socket Events
 */
GameController.prototype.detachSocketEvents = function()
{
    this.client.off('property', this.onProperty);
    this.client.off('point', this.onPoint);
    this.client.off('die', this.onDie);
    this.client.off('bonus:pop', this.onBonusPop);
    this.client.off('bonus:clear', this.onBonusClear);
    this.client.off('bonus:stack', this.onBonusStack);
    this.client.off('round:new', this.onRoundNew);
    this.client.off('round:end', this.onRoundEnd);
    this.client.off('round:winner', this.onRoundWinner);
    this.client.off('clear', this.onClear);
    this.client.off('end', this.onEnd);
    this.client.off('game:leave', this.onLeave);
    this.client.off('spectate', this.onSpectate);
};

/**
 * Rooms action
 *
 * @return {Array}
 */
GameController.prototype.loadGame = function(room)
{
    this.room = room;
    this.game = room.newGame();

    avatars = this.game.avatars.filter(function () { return this.local; });

    for (var i = avatars.items.length - 1; i >= 0; i--) {
        avatars.items[i].input.on('move', this.onMove);
    }

    this.game.setSpectate(avatars.isEmpty());
    this.game.fps.setElement(document.getElementById('fps'));
    this.client.pingLogger.setElement(document.getElementById('ping'));

    // Hydrate scope:
    this.$scope.curvytron.bodyClass = 'game-mode';
    this.$scope.game                = this.game;
    this.$scope.avatars             = this.game.avatars.items;

    this.client.addEvent('loaded');

    setTimeout(this.chat.scrollDown, 0);
};

/**
 * Start warmup
 */
GameController.prototype.displayWarmup = function(time)
{
    var controller = this;

    this.$scope.count  = time/1000;
    this.$scope.warmup = true;
    this.applyScope();

    this.warmupInterval = setInterval(this.onWarmup, 1000);

    setTimeout(this.endWarmup, time);
};

/**
 * On warmup
 */
GameController.prototype.onWarmup = function()
{
    this.$scope.count--;
    this.applyScope();
};

/**
 * End warmup
 */
GameController.prototype.endWarmup = function(interval)
{
    this.clearWarmup();
    this.$scope.warmup = false;
    this.applyScope();
};

/**
 * Clear warmup interval
 */
GameController.prototype.clearWarmup = function()
{
    if (this.warmupInterval) {
        clearInterval(this.warmupInterval);
        this.warmupInterval = null;
    }
};

/**
 * On move
 *
 * @param {Event} e
 */
GameController.prototype.onMove = function(e)
{
    this.client.addEvent('player:move', {avatar: e.detail.avatar.id, move: e.detail.move ? e.detail.move : 0});
};

/**
 * On property
 *
 * @param {Event} e
 */
GameController.prototype.onProperty = function(e)
{
    var data = e.detail,
        avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        avatar.set(data.property, data.value);

        if (!this.game.frame) {
            this.game.draw();
        }

        if (data.property === 'score' || data.property === 'roundScore') {
            this.applyScope();
        }
    }
};

/**
 * On bonus stack
 *
 *
 * @param {Event} e
 */
GameController.prototype.onBonusStack = function(e)
{
    var data = e.detail,
        avatar = this.game.avatars.getById(data.avatar),
        bonus = new Bonus(data.bonus.id, data.bonus.position, data.bonus.type, data.bonus.affect, data.bonus.radius, data.bonus.duration);

    if (avatar && avatar.local) {
        avatar.bonusStack[data.method](bonus);
    }
};

/**
 * On bonus pop
 *
 * @param {Event} e
 */
GameController.prototype.onBonusPop = function(e)
{
    var data = e.detail,
        bonus = new Bonus(data.id, data.position, data.type, data.affect, data.radius, data.duration);

    this.game.bonusManager.add(bonus);
};

/**
 * On bonus clear
 *
 * @param {Event} e
 */
GameController.prototype.onBonusClear = function(e)
{
    var data = e.detail,
        bonus = this.game.bonusManager.bonuses.getById(data.bonus);

    this.game.bonusManager.remove(bonus);
};

/**
 * On point
 *
 * @param {Event} e
 */
GameController.prototype.onPoint = function(e)
{
    var data = e.detail,
        avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        avatar.addPoint(data.point);
    }
};

/**
 * On die
 *
 * @param {Event} e
 */
GameController.prototype.onDie = function(e)
{
    var data = e.detail,
        avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        avatar.setAngle(data.angle);
        avatar.die();
        this.applyScope();

        createjs.Sound.play('loose');
    }
};

/**
 * On spectate
 */
GameController.prototype.onSpectate = function()
{
    this.game.newRound(0);
};

/**
 * On round new
 *
 * @param {Event} e
 */
GameController.prototype.onRoundNew = function(e)
{
    this.$scope.end      = false;
    this.$scope.tieBreak = this.game.isTieBreak();

    this.displayWarmup(this.game.warmupTime);
    this.game.newRound();
    this.applyScope();
};

/**
 * On round new
 *
 * @param {Event} e
 */
GameController.prototype.onRoundEnd = function(e)
{
    this.game.endRound();
};

/**
 * On clear
 *
 * @param {Event} e
 */
GameController.prototype.onClear = function(e)
{
    this.game.clearTrails();
};

/**
 * On end
 *
 * @param {Event} e
 */
GameController.prototype.onEnd = function(e)
{
    this.$scope.gameWinner = this.game.sortAvatars().getFirst();
    this.applyScope();

    this.close();

    this.$scope.end   = true;
    this.$scope.phase = 'game';

    createjs.Sound.play('win');
};

/**
 * On round winner
 *
 * @param {Event} e
 */
GameController.prototype.onRoundWinner = function(e)
{
    var data = e.detail,
        avatar = this.game.avatars.getById(data.winner);

    if (avatar) {
        this.$scope.roundWinner = avatar;
        this.applyScope();

        this.$scope.end = true;
    }
};

/**
 * On leave
 *
 * @param {Event} e
 */
GameController.prototype.onLeave = function(e)
{
    var data = e.detail,
        avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        this.game.removeAvatar(avatar);
        this.applyScope();
    }
};

/**
 * Leave room
 */
GameController.prototype.leaveGame = function()
{
    if (this.room && this.$location.path() !== this.room.url) {
        this.repository.leave();
    }

    this.close();
};

/**
 * Close game
 */
GameController.prototype.close = function()
{
    this.clearWarmup();

    if (this.game) {
        this.detachSocketEvents();
        this.game.end();

        avatars = this.game.avatars.filter(function () { return this.local; }).items;

        for (var i = avatars.length - 1; i >= 0; i--) {
            avatars[i].input.off('move', this.onMove);
        }

        this.room.closeGame();

        delete this.game;
    }
};

/**
 * Go back to the room
 */
GameController.prototype.backToRoom = function()
{
    this.$location.path(this.room.url);
};

/**
 * Toggle sound
 */
GameController.prototype.toggleSound = function()
{
    this.$scope.sound = !this.$scope.sound;

    createjs.Sound.setVolume(this.$scope.sound ? this.volume : 0);
    this.profile.setSound(this.$scope.sound);
};

/**
 * Apply scope
 */
GameController.prototype.applyScope = CurvytronController.prototype.applyScope;
