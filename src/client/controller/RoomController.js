function RoomController($scope, $routeParams, RoomRepository)
{
    this.$scope     = $scope;
    this.repository = RoomRepository;
    this.roomName   = $routeParams.name;

    this.loadRoom(this.roomName);

    this.createUser  = this.createUser.bind(this);

    this.repository.on('room:join:' + this.roomName, this.loadRoom);

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
