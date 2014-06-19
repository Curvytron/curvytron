/**
 * Rooms Controller
 *
 * @param {Object} $scope
 * @param {Object} $location
 * @param {RoomRepository} repository
 * @param {SocketClient} client
 */
function RoomsController($scope, $location, repository, client)
{
    this.$scope     = $scope;
    this.$location  = $location;
    this.repository = repository;
    this.client     = client;

    this.client.join('rooms');

    // Binding:
    this.createRoom = this.createRoom.bind(this);
    this.joinRoom   = this.joinRoom.bind(this);
    this.applyScope = this.applyScope.bind(this);

    this.repository.on('room:new', this.applyScope);
    this.repository.on('room:close', this.applyScope);
    this.repository.on('room:join', this.applyScope);
    this.repository.on('room:leave', this.applyScope);

    // Hydrating the scope:
    this.$scope.rooms  = this.repository.rooms;
    this.$scope.submit = this.createRoom;
    this.$scope.join   = this.joinRoom;

    this.$scope.curvytron.bodyClass = null;
}

/**
 * Create a room
 */
RoomsController.prototype.createRoom = function(e)
{
    if (this.$scope.name) {
        var $scope = this.$scope,
            controller = this;

        this.repository.create(this.$scope.name, function (result) {
            if (result.success) {
                $scope.name = null;
                controller.joinRoom({name: result.room});
            } else {
                console.log('Error');
            }
        });
    }
};

/**
 * Join a room
 */
RoomsController.prototype.joinRoom = function(room)
{
    this.$location.path('/room/' + room.name);
};

/**
 * Apply scope
 */
RoomsController.prototype.applyScope = function()
{
    this.$scope.$apply();
};
