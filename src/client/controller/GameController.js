/**
 * Game Controller
 *
 * @param {Object} $scope
 * @param {Object} $routeParams
 * @param {SocketClient} client
 * @param {RoomRepository} repository
 * @param {Chat} chat
 * @param {Radio} radio
 * @param {Notifier} notifier
 * @param {SoundManager} sound
 */
function GameController($scope, $routeParams, $location, client, repository, chat, radio, notifier, sound)
{
    this.$scope         = $scope;
    this.$location      = $location;
    this.client         = client;
    this.repository     = repository;
    this.radio          = radio;
    this.chat           = chat;
    this.notifier       = notifier;
    this.sound          = sound;
    this.room           = null;
    this.game           = null;
    this.warmupInterval = null;
    this.assetsLoaded   = false;
    this.setup          = false;

    // Binding
    this.onLatency      = this.onLatency.bind(this);
    this.onGameStart    = this.onGameStart.bind(this);
    this.onGameStop     = this.onGameStop.bind(this);
    this.onReady        = this.onReady.bind(this);
    this.onAssetsLoaded = this.onAssetsLoaded.bind(this);
    this.onChatLoaded   = this.onChatLoaded.bind(this);
    this.onMove         = this.onMove.bind(this);
    this.onBonusPop     = this.onBonusPop.bind(this);
    this.onBonusClear   = this.onBonusClear.bind(this);
    this.onBonusStack   = this.onBonusStack.bind(this);
    this.onPoint        = this.onPoint.bind(this);
    this.onDie          = this.onDie.bind(this);
    this.onProperty     = this.onProperty.bind(this);
    this.onWarmup       = this.onWarmup.bind(this);
    this.endWarmup      = this.endWarmup.bind(this);
    this.onRoundNew     = this.onRoundNew.bind(this);
    this.onRoundEnd     = this.onRoundEnd.bind(this);
    this.onRoundWinner  = this.onRoundWinner.bind(this);
    this.onClear        = this.onClear.bind(this);
    this.onEnd          = this.onEnd.bind(this);
    this.onLeave        = this.onLeave.bind(this);
    this.onSpectate     = this.onSpectate.bind(this);
    this.onSpectators   = this.onSpectators.bind(this);
    this.onUnload       = this.onUnload.bind(this);
    this.onExit         = this.onExit.bind(this);
    this.backToRoom     = this.backToRoom.bind(this);
    this.updateBorders  = this.updateBorders.bind(this);

    // Hydrate scope:
    this.$scope.sortorder   = '-score';
    this.$scope.warmup      = false;
    this.$scope.phase       = 'round';
    this.$scope.end         = false;
    this.$scope.tieBreak    = false;
    this.$scope.borderless  = false;
    this.$scope.radio       = this.radio;
    this.$scope.sound       = this.sound;
    this.$scope.backToRoom  = this.backToRoom;
    this.$scope.toggleSound = this.sound.toggle;
    this.$scope.toggleRadio = this.radio.toggle;
    this.$scope.chatLoaded  = this.onChatLoaded;
    this.$scope.roundWinner = null;
    this.$scope.gameWinner  = null;
    this.$scope.spectating  = false;
    this.$scope.spectators  = 0;
    this.$scope.latency     = 0;

    this.repository.start();

    var name = decodeURIComponent($routeParams.name);

    if (!this.repository.room || this.repository.room.name !== name) {
        this.$location.path('/room/' + encodeURIComponent(name));
    } else {
        this.loadGame(this.repository.room);
    }
}

/**
 * Confirmation message
 *
 * @type {String}
 */
GameController.prototype.confirmation = 'Are you sure you want to leave the game?';

/**
 * Attach socket Events
 */
GameController.prototype.attachSocketEvents = function()
{
    this.client.on('latency', this.onLatency);
    this.client.on('game:start', this.onGameStart);
    this.client.on('game:stop', this.onGameStop);
    this.client.on('ready', this.onReady);
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
    this.client.on('game:spectators', this.onSpectators);
};

/**
 * Attach socket Events
 */
GameController.prototype.detachSocketEvents = function()
{
    this.client.off('latency', this.onLatency);
    this.client.off('game:start', this.onGameStart);
    this.client.off('game:stop', this.onGameStop);
    this.client.off('ready', this.onReady);
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
    this.client.off('game:spectators', this.onSpectators);
};

/**
 * Rooms action
 *
 * @return {Array}
 */
GameController.prototype.loadGame = function(room)
{
    this.offUnload        = this.$scope.$on('$locationChangeStart', this.onUnload);
    this.offDestroy       = this.$scope.$on('$destroy', this.onExit);
    window.onbeforeunload = this.onUnload;

    this.room = room;
    this.game = room.newGame();

    this.game.bonusManager.on('load', this.onAssetsLoaded);

    var avatar;

    for (var i = this.game.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.game.avatars.items[i];

        avatar.bonusStack.on('change', this.updateBorders);

        if (avatar.local) {
            avatar.input.on('move', this.onMove);
        }
    }

    this.game.fps.setElement(document.getElementById('fps'));
    this.radio.setActive(true);

    // Hydrate scope:
    this.$scope.curvytron.bodyClass = 'game-mode';
    this.$scope.game                = this.game;
    this.$scope.avatars             = this.game.avatars.items;

    this.attachSocketEvents();
    setTimeout(this.chat.scrollDown, 0);

    this.setup = true;
    this.checkReady();
};

/**
 * On assets loaded
 */
GameController.prototype.onAssetsLoaded = function()
{
    this.assetsLoaded = true;
    this.game.bonusManager.off('load', this.onAssetsLoaded);
    this.checkReady();
};

/**
 * Check loading is done
 */
GameController.prototype.checkReady = function()
{
    if (this.assetsLoaded && this.setup) {
        this.client.addEvent('ready');
    }
};

/**
 * On avatar ready (client loaded)
 *
 * @param {Event} e
 */
GameController.prototype.onReady = function(e)
{
    var data = e.detail,
        avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        avatar.ready = true;
        this.applyScope();
    }
};

/**
 * On chat loaded
 */
GameController.prototype.onChatLoaded = function ()
{
    this.chat.setScope(this.$scope);
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

    this.notifier.notify('Round start in ' + this.$scope.count + '...');

    this.warmupInterval = setInterval(this.onWarmup, 1000);

    setTimeout(this.endWarmup, time);
};

/**
 * On warmup
 */
GameController.prototype.onWarmup = function()
{
    this.$scope.count--;
    this.notifier.notify('Round start in ' + this.$scope.count + '...');
    this.applyScope();
};

/**
 * End warmup
 */
GameController.prototype.endWarmup = function(interval)
{
    this.clearWarmup();
    this.$scope.warmup = false;
    this.notifier.notify('Go!', 1000);
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
    this.sound.play('bonus-pop');
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
    this.sound.play('bonus-clear');
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
        avatar = this.game.avatars.getById(data.avatar),
        killer = (data.killer) ? this.game.avatars.getById(data.killer) : null;

    if (avatar) {
        avatar.setAngle(data.angle);
        avatar.die();
        this.applyScope();

        this.sound.play('death');
        //this.chat.messages.push(new DieMessage(this.chat.curvybot, avatar, killer));
    }
};

/**
 * On spectate
 */
GameController.prototype.onSpectate = function(e)
{
    var data = e.detail;

    this.$scope.spectating = true;

    this.game.maxScore = data.maxScore;

    for (var i = this.game.avatars.items.length - 1; i >= 0; i--) {
        this.game.avatars.items[i].local = true;
        this.game.avatars.items[i].ready = true;
    }

    if (data.inRound) {
        return data.rendered ? this.game.newRound(0) : this.onRoundNew();
    } else {
        return this.game.start();
    }
};

/**
 * On spectators
 *
 * @param {Event} e
 */
GameController.prototype.onSpectators = function(e)
{
    this.$scope.spectators = e.detail;
    this.applyScope();
};

/**
 * On game start
 *
 * @param {Event} e
 */
GameController.prototype.onGameStart = function(e)
{
    this.endWarmup();
    this.game.start();
};

/**
 * On game stop
 *
 * @param {Event} e
 */
GameController.prototype.onGameStop = function(e)
{
    this.game.stop();
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
    this.updateBorders();
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
    this.notifier.notify('Game over!', null, 'win');

    this.$scope.gameWinner = this.game.sortAvatars().getFirst();
    this.$scope.end        = true;
    this.$scope.phase      = 'game';

    this.applyScope();
    this.close();
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
        this.notifier.notifyInactive(avatar.name + ' won round!');
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
        avatar.bonusStack.off('change', this.updateBorders);
        this.game.removeAvatar(avatar);
        this.applyScope();
    }
};

/**
 * Update map border
 */
GameController.prototype.updateBorders = function()
{
    this.$scope.borderless = this.game.isBorderless();
    this.applyScope();
};

/**
 * Leave room
 */
GameController.prototype.onExit = function()
{
    if ((this.room && this.$location.path() !== this.room.url) || (this.game && this.game.started)) {
        this.repository.leave();
        this.chat.clear();
    }

    window.onbeforeunload = null;

    this.radio.setActive(false);
    this.sound.stop('win');
    this.offUnload();
    this.offDestroy();
    this.close();
};

/**
 * On unload
 *
 * @param {Event} e
 *
 * @return {String}
 */
GameController.prototype.onUnload = function(e)
{
    if (this.needConfirmation()) {
        if (e.type === 'beforeunload') {
            return this.confirmation;
        } else if (!confirm(this.confirmation)) {
            return e.preventDefault();
        }
    }
};

/**
 * Do we need confirmation before leaving?
 *
 * @return {Boolean}
 */
GameController.prototype.needConfirmation = function()
{
    return !this.$scope.spectating && !this.$scope.end;
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

        avatars = this.game.avatars.filter(function () { return this.input; }).items;

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
 * Set latency
 *
 * @param {Event} event
 */
GameController.prototype.onLatency = function(event)
{
    this.$scope.latency = event.detail[0];
    this.applyScope();
};

/**
 * Apply scope
 */
GameController.prototype.applyScope = CurvytronController.prototype.applyScope;
