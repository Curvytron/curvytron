function GameController($scope, $routeParams, RoomRepository)
{
    this.$scope     = $scope;
    this.repository = RoomRepository;
    this.name       = $routeParams.name;
    this.room       = this.repository.get(this.roomName);

    this.loadGame();
}

/**
 * Rooms action
 *
 * @return {Array}
 */
GameController.prototype.loadGame = function(e)
{
    var room = this.repository.get(this.roomName);

    this.$scope.curvytron.bodyClass = "game-mode";

    room.startGame();

    this.$scope.game = room.game.serialize();
};
