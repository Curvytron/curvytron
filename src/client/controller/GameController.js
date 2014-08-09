/**
 * Game Controller
 *
 * @param {Object} $scope
 * @param {Object} $routeParams
 * @param {RoomRepository} repository
 * @param {SocketClient} client
 * @param {Chat} chat
 */
function GameController($scope, $routeParams, $location, repository, client, chat)
{
    gamepadListener.start();

    this.$scope     = $scope;
    this.$location  = $location;
    this.repository = repository;
    this.client     = client;
    this.chat       = chat;
    this.game       = null;
    this.room       = null;

    createjs.Sound.alternateExtensions = ['mp3'];
    createjs.Sound.registerManifest(
        [
            {id:'loose', src:'loose.ogg'},
            {id:'win', src:'win.ogg'}
        ],
        'sounds/'
    );

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
    this.onEnd         = this.onEnd.bind(this);
    this.onLeave       = this.onLeave.bind(this);
    this.leaveGame     = this.leaveGame.bind(this);
    this.backToRoom    = this.backToRoom.bind(this);

    this.attachSocketEvents();

    this.$scope.$on('$destroy', this.leaveGame);

    // Hydrate scope:
    this.$scope.sortorder   = '-score';
    this.$scope.countFinish = true;
    this.$scope.sound       = true;
    this.$scope.backToRoom  = this.backToRoom;

    this.chat.setScope(this.$scope);

    this.loadGame(decodeURIComponent($routeParams.name));
}

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
    this.client.on('end', this.onEnd);
    this.client.on('game:leave', this.onLeave);
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
    this.client.off('end', this.onEnd);
    this.client.off('game:leave', this.onLeave);
};

/**
 * Rooms action
 *
 * @return {Array}
 */
GameController.prototype.loadGame = function(name)
{
    var room = this.repository.get(name),
        avatars;

    if (room) {
        this.room = room;
        this.game = room.newGame();

        avatars = this.game.avatars.filter(function () { return this.local; }).items;

        for (var i = avatars.length - 1; i >= 0; i--) {
            avatars[i].input.on('move', this.onMove);
        }

        this.game.fps.setElement(document.getElementById('fps'));
        this.client.pingLogger.setElement(document.getElementById('ping'));

        // Hydrate scope:
        this.$scope.curvytron.bodyClass = 'game-mode';
        this.$scope.game = this.game;

        this.client.addEvent('loaded');
    } else {
        this.goHome();
    }
};

/**
 * Start warmup
 */
GameController.prototype.displayWarmup = function(time)
{
    var controller = this;

    this.$scope.count       = time/1000;
    this.$scope.countFinish = false;
    this.applyScope();

    var warmupInterval = setInterval(this.onWarmup, 1000);

    setTimeout(function () { controller.endWarmup(warmupInterval); }, time);
};

/**
 * On warmup
 */
GameController.prototype.onWarmup = function()
{
    this.$scope.count--;
    this.$scope.$apply();
};

/**
 * End warmup
 */
GameController.prototype.endWarmup = function(interval)
{
    clearInterval(interval);

    this.$scope.countFinish = true;
    this.applyScope();
};

/**
 * On move
 *
 * @param {Event} e
 */
GameController.prototype.onMove = function(e)
{
    this.client.addEvent('player:move', {avatar: e.detail.avatar.id, move: e.detail.move});
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
        bonus.setScale(this.game.canvas.scale);
        avatar.bonusStack[data.method](bonus);
    }
};

/**
 * On bonus pop
 *
 *
 * @param {Event} e
 */
GameController.prototype.onBonusPop = function(e)
{
    var data = e.detail,
        bonus = new Bonus(data.id, data.position, data.type, data.affect, data.radius, data.duration);

    bonus.setScale(this.game.canvas.scale);
    this.game.bonusManager.add(bonus);
};

/**
 * On bonus pop
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
        avatar.die();
        this.applyScope();

        if (this.$scope.sound) {
            createjs.Sound.play('loose').volume = 0.2;
        }
    }
};

/**
 * On round new
 *
 * @param {Game} game
 */
GameController.prototype.onRoundNew = function(e)
{
    document.getElementById('end').style.display        = 'none';
    document.getElementById('game-view').style.display  = 'none';
    document.getElementById('round-view').style.display = 'none';

    this.displayWarmup(this.game.warmupTime);
    this.game.newRound();
    this.applyScope();
};

/**
 * On round new
 *
 * @param {Game} game
 */
GameController.prototype.onRoundEnd = function(e)
{
    this.game.endRound();
};

/**
 * On end
 *
 * @param {Event} e
 */
GameController.prototype.onEnd = function(e)
{
    this.close();

    document.getElementById('end').style.display = 'block';
    document.getElementById('game-view').style.display = 'block';
    document.getElementById('round-view').style.display = 'none';

    if (this.$scope.sound) {
        createjs.Sound.play('win').volume = 0.2;
    }
};

/**
 * On round new
 *
 * @param {Game} game
 */
GameController.prototype.onRoundWinner = function(e)
{
    var data = e.detail,
        avatar = this.game.avatars.getById(data.winner);

    if (avatar) {
        this.$scope.roundWinner = avatar;
        this.applyScope();

        document.getElementById('end').style.display = 'block';
        document.getElementById('round-view').style.display = 'block';
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
    if (this.$location.path() !== this.room.url) {
        this.repository.leave();
        this.repository.refresh();
    }

    this.close();
};

/**
 * Close game
 */
GameController.prototype.close = function()
{
    if (this.game) {
        this.detachSocketEvents();
        this.game.end();

        avatars = this.game.avatars.filter(function () { return this.local; }).items;

        for (var i = avatars.length - 1; i >= 0; i--) {
            avatars[i].input.off('move', this.onMove);
        }

        this.room.closeGame();
        this.game = null;

        this.repository.start();
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
 * Go back to the homepage
 */
GameController.prototype.goHome = function()
{
    this.$location.path('/');
};

/**
 * Apply scope
 */
GameController.prototype.applyScope = function()
{
    try {
        this.$scope.$apply();
    } catch (e) {

    }
};
