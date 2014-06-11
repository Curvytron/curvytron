function RoomController($scope, $routeParams, RoomRepository)
{
    this.$scope     = $scope;
    this.repository = RoomRepository;
    this.roomName   = $routeParams.name;

    this.createUser = this.createUser.bind(this);
    this.loadRoom   = this.loadRoom.bind(this);

    this.repository.on('room:join:' + this.roomName, this.loadRoom);

    this.$scope.submit = this.createUser;

    this.loadRoom();
}

/**
 * Rooms action
 *
 * @return {Array}
 */
RoomController.prototype.loadRoom = function(e)
{
    this.$scope.room = this.repository.get(this.roomName).serialize();

    if (typeof(e) !== 'undefined') {
        this.$scope.$apply();
    }
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

        this.repository.join(this.roomName, $scope.username, function (success) {
            if (success) {
                $scope.username = null;
                $scope.$apply();
            } else {
                console.log('Error');
            }
        });
    }
};
