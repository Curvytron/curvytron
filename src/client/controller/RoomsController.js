function RoomsController($scope, RoomRepository, SocketClient)
{
    this.$scope     = $scope;
    this.repository = RoomRepository;
    this.client     = SocketClient;

    this.client.join('rooms');

    this.loadRooms = this.loadRooms.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.joinRoom = this.joinRoom.bind(this);

    this.repository.on('room:new', this.loadRooms);
    this.repository.on('room:close', this.loadRooms);
    this.repository.on('room:join', this.loadRooms);
    this.repository.on('room:leave', this.loadRooms);
    this.repository.on('room:player:ready', this.loadRooms);
    this.repository.on('room:player:color', this.loadRooms);

    this.$scope.submit = this.createRoom;
    this.$scope.join   = this.joinRoom;

    this.loadRooms();
}

/**
 * Rooms action
 *
 * @return {Array}
 */
RoomsController.prototype.loadRooms = function(e)
{
    this.$scope.rooms = this.repository.all().map(function () {
        return this.serialize();
    }).items;

    this.$scope.curvytron.bodyClass = null;

    if (typeof(e) !== 'undefined') {
        this.$scope.$apply();
    }
};

/**
 * Rooms action
 *
 * @return {Array}
 */
RoomsController.prototype.createRoom = function(e)
{
    if (this.$scope.name) {
        var $scope = this.$scope;

        this.repository.create(this.$scope.name, function (result) {
            if (result.success) {
                $scope.name = null;
                $scope.$apply();
                window.location = "/#/room/" + result.room;
            } else {
                console.log('Error');
            }
        });
    }
};

/**
 * Join room
 *
 * @return {Array}
 */
RoomsController.prototype.joinRoom = function(room)
{
    window.location = "/#/room/" + room.name;
};
