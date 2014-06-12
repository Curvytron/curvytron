function GameController($scope, $routeParams, RoomRepository)
{
    this.$scope     = $scope;
    this.repository = RoomRepository;
    this.name       = $routeParams.name;

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

    this.$scope.curvytron.bodyClass = "game-mode";

    room.startGame();

    this.$scope.game = room.game.serialize();
    this.$scope.roomName = room.name;
};
