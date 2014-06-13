function GameController($scope, $routeParams, RoomRepository, SocketClient)
{
    this.$scope     = $scope;
    this.repository = RoomRepository;
    this.client     = SocketClient;
    this.name       = $routeParams.name;
    this.input      = new PlayerInput();

    this.client.join('game:' + this.name);

    this.onMove  = this.onMove.bind(this);
    this.onPoint = this.onPoint.bind(this);

    this.input.on('move', this.onMove);
    this.client.io.on('point', this.onPoint);

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
GameController.prototype.onPoint = function(data)
{
    var avatar = this.game.avatars.getById(data.avatar);

    if (avatar) {
        avatar.trail.addPoint(data.point);
    }
};