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
    this.$scope     = $scope;
    this.repository = RoomRepository;
    this.client     = SocketClient;
    this.name       = $routeParams.name;
    this.input      = new PlayerInput();

    this.client.join('game:' + this.name);

    this.onMove       = this.onMove.bind(this);
    this.onPosition   = this.onPosition.bind(this);
    this.onPoint      = this.onPoint.bind(this);
    this.onDie        = this.onDie.bind(this);
    this.onTrailClear = this.onTrailClear.bind(this);

    this.input.on('move', this.onMove);
    this.client.io.on('position', this.onPosition);
    this.client.io.on('point', this.onPoint);
    this.client.io.on('die', this.onDie);
    this.client.io.on('trail:clear', this.onTrailClear);

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

    room.startWarmup();

    this.room = room;
    this.game = this.room.game;

    this.$scope.curvytron.bodyClass = "game-mode";

    this.$scope.game     = this.game.serialize();
    this.$scope.roomName = this.game.name;
    this.$scope.count    = 5;
    this.$scope.countFinish = false;

    this.displayWarmup();
};

GameController.prototype.displayWarmup = function()
{
    var warmup = this.room.warmupTime,
        count = warmup/1000,
        $scope = this.$scope;

        var interval = setInterval(function(){
                count--;
                $scope.count = count;
                $scope.$apply();
            }, 1000);

        setTimeout(function() { clearInterval(interval); $scope.countFinish = true; $scope.$apply(); }, warmup);

    // room.game.start();
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
 * On move
 *
 * @param {Object} data
 */
GameController.prototype.onPosition = function(data)
{
    var avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        avatar.setPosition(data.point);
    }
};

/**
 * On move
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
 * On move
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
