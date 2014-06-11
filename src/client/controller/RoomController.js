function RoomController($scope, $routeParams, RoomRepository)
{
    this.$scope     = $scope;
    this.repository = RoomRepository;
    this.roomName   = $routeParams.name;

    this.createUser = this.createUser.bind(this);
    this.loadRoom   = this.loadRoom.bind(this);
    this.setColor   = this.setColor.bind(this);
    this.setReady   = this.setReady.bind(this);

    this.repository.on('room:join:' + this.roomName, this.loadRoom);

    this.$scope.submit   = this.createUser;
    this.$scope.setColor = this.setColor;
    this.$scope.setReady = this.setReady;

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

        this.repository.join(this.roomName, $scope.username, function (player) {
            if (player) {
                $scope.username = null;
                $scope.hasUsername = true;
                $scope.$apply();
            } else {
                console.log('Error');
            }
        });
    }
};

/**
 * Rooms action
 *
 * @return {Array}
 */
RoomController.prototype.setColor = function(e)
{
    var controller = this;
    console.log('color', this.$scope.color);

    this.repository.setColor(this.roomName, this.$scope.color, function (result) {
        console.log(result);
        if (result) {
            controller.loadRoom(true);
        } else {
            console.log('Error');
        }
    });
};

/**
 * Rooms action
 *
 * @return {Array}
 */
RoomController.prototype.setReady = function(e)
{
    var controller = this;
    console.log('ready', this.$scope.ready);

    this.repository.setColor(this.roomName, this.$scope.ready, function (result) {
        console.log(result);
        if (result) {
            controller.loadRoom(true);
        } else {
            console.log('Error');
        }
    });
};
