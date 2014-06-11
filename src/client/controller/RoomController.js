function RoomController($scope, $routeParams, RoomRepository)
{
    this.$scope     = $scope;
    this.repository = RoomRepository;
    this.roomName   = $routeParams.name;

    this.loadRoom(this.roomName);

    this.createUser = this.createUser.bind(this);
    this.loadRoom = this.loadRoom.bind(this);
    
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
        var $scope = this.$scope;

        this.repository.join($scope.room.name, $scope.username, function (success) {
            if (success) {
                $scope.username = null;
                $scope.$apply();
            } else {
                console.log('Error');
            }
        });
    }
};
