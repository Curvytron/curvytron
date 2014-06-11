function RoomsController($scope, RoomRepository)
{
    this.$scope     = $scope;
    this.repository = RoomRepository;

    this.loadRooms = this.loadRooms.bind(this);
    this.createRoom = this.createRoom.bind(this);

    this.repository.on('room:new', this.loadRooms);
    this.repository.on('room:close', this.loadRooms);

    this.$scope.submit = this.createRoom;

    this.loadRooms();
}

/**
 * Rooms action
 *
 * @return {Array}
 */
RoomsController.prototype.loadRooms = function(e)
{
    this.$scope.rooms = this.repository.all();

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
        this.repository.create(this.$scope.name);
        this.$scope.name = null;
    }
};
