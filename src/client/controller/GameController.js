/**
 * Game Controller
 *
 * @param {Object} $scope
 * @param {Object} $routeParams
 * @param {RoomRepository} RoomRepository
 * @param {SocketClient} SocketClient
 */
function GameController($scope, $routeParams, RoomRepository, SocketClient)
{
    this.$scope           = $scope;
    this.repository       = RoomRepository;
    this.client           = SocketClient;
    this.name             = $routeParams.name;
    this.input            = new PlayerInput();
    this.$scope.sortorder = "-score";

    this.client.join('game:' + this.name);

    this.onMove       = this.onMove.bind(this);
    this.onPosition   = this.onPosition.bind(this);
    this.onPoint      = this.onPoint.bind(this);
    this.onDie        = this.onDie.bind(this);
    this.onScore      = this.onScore.bind(this);
    this.onTrailClear = this.onTrailClear.bind(this);
    this.onWarmup     = this.onWarmup.bind(this);
    this.endWarmup    = this.endWarmup.bind(this);
    this.onRoundNew   = this.onRoundNew.bind(this);
    this.onRoundEnd   = this.onRoundEnd.bind(this);
    this.onEnd        = this.onEnd.bind(this);

    this.input.on('move', this.onMove);
    this.client.io.on('position', this.onPosition);
    this.client.io.on('point', this.onPoint);
    this.client.io.on('die', this.onDie);
    this.client.io.on('score', this.onScore);
    this.client.io.on('trail:clear', this.onTrailClear);
    this.client.io.on('round:new', this.onRoundNew);
    this.client.io.on('round:end', this.onRoundEnd);
    this.client.io.on('end', this.onEnd);

    this.loadGame();
}

/**
 * Rooms action
 *
 * @return {Array}
 */
GameController.prototype.loadGame = function()
{
    var room = this.repository.get(this.name);

    this.room = room;
    this.game = room.newGame();

    this.$scope.curvytron.bodyClass = "game-mode";

    this.$scope.game     = this.game;
    this.$scope.avatars  = this.game.avatars.items;
    this.$scope.roomName = this.game.name;

    this.client.io.emit('loaded');
};

/**
 * Start warmup
 */
GameController.prototype.displayWarmup = function(time)
{
    var controller = this;

    this.$scope.count       = time/1000;
    this.$scope.countFinish = false;
    this.$scope.$apply();

    var warmupInterval = setInterval(this.onWarmup, 1000);

    setTimeout(function () { controller.endWarmup(warmupInterval); }, time);

    this.warmupInterval = warmupInterval;
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

    if (this.warmupInterval === interval) {
        this.$scope.countFinish = true;
        this.$scope.$apply();
    }
};

/**
 * On move
 *
 * @param {Event} e
 */
GameController.prototype.onMove = function(e)
{
    this.client.io.emit('player:move', e.detail);
};

/**
 * On position
 *
 * @param {Object} data
 */
GameController.prototype.onPosition = function(data)
{
    var avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        avatar.setPosition(data.point);

        if (!this.game.isStarted()) {
            paper.view.update();
            paper.view.draw();
        }
    }
};

/**
 * On point
 *
 * @param {Object} data
 */
GameController.prototype.onPoint = function(data)
{
    var avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        avatar.addPoint(data.point);
    }
};

/**
 * On die
 *
 * @param {Object} data
 */
GameController.prototype.onDie = function(data)
{
    var avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        avatar.die();
    }
};

/**
 * On score
 *
 * @param {Object} data
 */
GameController.prototype.onScore = function(data)
{
    var avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        avatar.setScore(data.score);
        this.$scope.$apply();
    }
};

/**
 * On trail clear
 *
 * @param {Object} data
 */
GameController.prototype.onTrailClear = function(data)
{
    var avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        avatar.trail.clear();
    }
};

/**
 * On round new
 *
 * @param {Game} game
 */
GameController.prototype.onRoundNew = function()
{
    this.displayWarmup(this.game.warmupTime);
    this.game.newRound();
};

/**
 * On round new
 *
 * @param {Game} game
 */
GameController.prototype.onRoundEnd = function()
{
    this.game.endRound();
};

/**
 * On round new
 *
 * @param {Game} game
 */
GameController.prototype.onEnd = function()
{
    this.game.end();
};
