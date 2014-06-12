function RoomController($scope, $routeParams, RoomRepository, SocketClient)
{
    this.$scope     = $scope;
    this.repository = RoomRepository;
    this.client     = SocketClient;
    this.roomName   = $routeParams.name;

    this.client.join('rooms');

    this.createUser = this.createUser.bind(this);
    this.loadRoom   = this.loadRoom.bind(this);
    this.setColor   = this.setColor.bind(this);
    this.setReady   = this.setReady.bind(this);

    this.repository.on('room:close:' + this.roomName, this.loadRoom);
    this.repository.on('room:join:' + this.roomName, this.loadRoom);
    this.repository.on('room:leave:' + this.roomName, this.loadRoom);
    this.repository.on('room:player:ready:' + this.roomName, this.loadRoom);
    this.repository.on('room:player:color:' + this.roomName, this.loadRoom);

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

    this.repository.setColor(this.roomName, this.$scope.color, function (result) {
        if (result.success) {
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

    this.repository.setReady(this.roomName, function (result) {
        if (result.success) {
            controller.$scope.ready = result.ready; // A finir
            controller.loadRoom(true);
        } else {
            console.log('Error');
        }
    });
};
