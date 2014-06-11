function RoomController($scope, $routeParams, RoomRepository)
{
    this.$scope     = $scope;
    this.repository = RoomRepository;

    this.loadRoom($routeParams.name);
}

/**
 * Rooms action
 *
 * @return {Array}
 */
RoomController.prototype.loadRoom = function(name)
{
    this.$scope.room = this.repository.get(name);
};