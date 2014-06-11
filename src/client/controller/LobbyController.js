function LobbyController($scope, LobbyRepository, $routeParams)
{
    this.$scope     = $scope;
    this.repository = LobbyRepository;

    this.loadRooms = this.loadRooms.bind(this);

    this.repository.on('lobby:new', this.loadRooms);

    this.loadRooms();
}

/**
 * Rooms action
 *
 * @return {Array}
 */
LobbyController.prototype.loadRooms = function(e)
{
    console.log("loadRooms", e);
    this.$scope.rooms = this.repository.getAll();
};