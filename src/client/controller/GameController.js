/**
 * Game Controller
 *
 * @param {Object} $scope
 * @param {Object} $routeParams
 * @param {RoomRepository} repository
 * @param {SocketClient} client
 */
function GameController($scope, $routeParams, $location, repository, client)
{
    gamepadListener.start();

    this.$scope     = $scope;
    this.$location  = $location;
    this.repository = repository;
    this.client     = client;

    createjs.Sound.alternateExtensions = ['mp3'];
    createjs.Sound.registerManifest(
        [
            {id:'loose', src:'loose.ogg'},
            {id:'win', src:'win.ogg'}
        ],
        '../sounds/'
    );

    // Binding
    this.onMove        = this.onMove.bind(this);
    this.onPosition    = this.onPosition.bind(this);
    this.onPrinting    = this.onPrinting.bind(this);
    this.onAngle       = this.onAngle.bind(this);
    this.onPoint       = this.onPoint.bind(this);
    this.onBonusPop    = this.onBonusPop.bind(this);
    this.onBonusClear  = this.onBonusClear.bind(this);
    this.onDie         = this.onDie.bind(this);
    this.onScore       = this.onScore.bind(this);
    this.onTrailClear  = this.onTrailClear.bind(this);
    this.onWarmup      = this.onWarmup.bind(this);
    this.endWarmup     = this.endWarmup.bind(this);
    this.onRoundNew    = this.onRoundNew.bind(this);
    this.onRoundEnd    = this.onRoundEnd.bind(this);
    this.onRoundWinner = this.onRoundWinner.bind(this);
    this.onEnd         = this.onEnd.bind(this);
    this.onLeave       = this.onLeave.bind(this);

    this.attachSocketEvents();
    
    // Hydrate scope:
    this.$scope.sortorder = '-score';

    this.loadGame($routeParams.name);
}

/**
 * Attach socket Events
 */
GameController.prototype.attachSocketEvents = function()
{
    this.client.on('position', this.onPosition);
    this.client.on('printing', this.onPrinting);
    this.client.on('angle', this.onAngle);
    this.client.on('point', this.onPoint);
    this.client.on('bonus:pop', this.onBonusPop);
    this.client.on('bonus:clear', this.onBonusClear);
    this.client.on('die', this.onDie);
    this.client.on('score', this.onScore);
    this.client.on('trail:clear', this.onTrailClear);
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
    this.client.off('position', this.onPosition);
    this.client.off('printing', this.onPrinting);
    this.client.off('angle', this.onAngle);
    this.client.off('point', this.onPoint);
    this.client.off('die', this.onDie);
    this.client.off('score', this.onScore);
    this.client.off('trail:clear', this.onTrailClear);
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
GameController.prototype.onMove = function(event)
{
    this.client.addEvent('player:move', {avatar: event.detail.avatar.name, move: event.detail.move});
};

/**
 * On position
 *
 * @param {Event} e
 */
GameController.prototype.onPosition = function(e)
{
    var data = e.detail,
        avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        avatar.setPosition(data.point);
    }
};

/**
 * On bonus pop
 *
 * @param {Object} data
 */
GameController.prototype.onBonusPop = function(data)
{
    var bonus = new Bonus();
        bonus.unserialize(data);
        bonus.pop();

    this.game.bonuses.add(bonus);
};

/**
 * On bonus pop
 *
 * @param {Object} data
 */
GameController.prototype.onBonusClear = function(data)
{
    var bonus = this.game.bonuses.getById(data.id);
        bonus.clear();
};

/**
 * On printing
 *
 * @param {Event} e
 */
GameController.prototype.onPrinting = function(e)
{
    var data = e.detail,
        avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        avatar.setPrinting(data.printing);
    }
};

/**
 * On angle
 *
 * @param {Event} e
 */
GameController.prototype.onAngle = function(e)
{
    var data = e.detail,
        avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        avatar.setAngle(data.angle);
    }
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

        var loose = createjs.Sound.play('loose');
        loose.volume = 0.2;
    }
};

/**
 * On score
 *
 * @param {Event} e
 */
GameController.prototype.onScore = function(e)
{
    var data = e.detail,
        avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        avatar.setScore(data.score);
        this.applyScope();
    }
};

/**
 * On trail clear
 *
 * @param {Event} e
 */
GameController.prototype.onTrailClear = function(e)
{
    var data = e.detail,
        avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        avatar.trail.clear();
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
    this.detachSocketEvents();
    paper.view.pause();
    this.repository.start();

    avatars = this.game.avatars.filter(function () { return this.local; }).items;

    for (var i = avatars.length - 1; i >= 0; i--) {
        avatars[i].input.off('move', this.onMove);
    }

    this.game.end();
    this.room.closeGame();
    this.game = null;

    document.getElementById('end').style.display = 'block';
    document.getElementById('game-view').style.display = 'block';
    document.getElementById('round-view').style.display = 'none';

    createjs.Sound.play('win').volume = 0.2;
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
