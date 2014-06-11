function RoomController($scope, $routeParams, RoomRepository)
{
    this.$scope     = $scope;
    this.repository = RoomRepository;

    this.loadRoom($routeParams.name);

    this.createUser = this.createUser.bind(this);

    this.$scope.submit = this.createUser;
}

/**
 * Rooms action
 *
 * @return {Array}
 */
RoomController.prototype.loadRoom = function(name)
{
    this.$scope.room = this.repository.get(name).serialize();
};

/**
 * Rooms action
 *
 * @return {Array}
 */
RoomController.prototype.createUser = function(e)
{
    if (this.$scope.username) {
        // this.repository.create(this.$scope.username);
        this.$scope.username = null;
    }
};
