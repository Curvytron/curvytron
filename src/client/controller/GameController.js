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

    this.onMove     = this.onMove.bind(this);
    this.onPosition = this.onPosition.bind(this);
    this.onDie      = this.onDie.bind(this);

    this.input.on('move', this.onMove);
    this.client.io.on('position', this.onPosition);
    this.client.io.on('die', this.onDie);

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

    console.log("onPosition", data, avatar);

    if (avatar) {
        avatar.setPosition(data.point);
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