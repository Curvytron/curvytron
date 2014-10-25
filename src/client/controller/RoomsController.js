/**
 * Rooms Controller
 *
 * @param {Object} $scope
 * @param {Object} $location
 * @param {SocketClient} client
 * @param {Profile} profile
 */
function RoomsController($scope, $location, client, profile)
{
    this.$scope     = $scope;
    this.$location  = $location;
    this.client     = client;
    this.repository = new RoomsRepository(this.client);

    // Binding:
    this.createRoom   = this.createRoom.bind(this);
    this.onCreateRoom = this.onCreateRoom.bind(this);
    this.joinRoom     = this.joinRoom.bind(this);
    this.quickPlay    = this.quickPlay.bind(this);
    this.detachEvents = this.detachEvents.bind(this);
    this.applyScope   = this.applyScope.bind(this);

    this.$scope.$on('$destroy', this.detachEvents);

    // Hydrating the scope:
    this.$scope.rooms         = this.repository.rooms;
    this.$scope.createRoom    = this.createRoom;
    this.$scope.join          = this.joinRoom;
    this.$scope.quickPlay     = this.quickPlay;
    this.$scope.roomMaxLength = Room.prototype.maxLength;
    this.$scope.roomName      = '';

    this.$scope.curvytron.bodyClass = null;

    this.attachEvents();
}

/**
 * Attach Events
 */
RoomsController.prototype.attachEvents = function()
{
    this.repository.on('room:open', this.applyScope);
    this.repository.on('room:close', this.applyScope);
    this.repository.on('room:players', this.applyScope);
    this.repository.on('room:game', this.applyScope);

    this.repository.start();
};

/**
 * Attach Events
 */
RoomsController.prototype.detachEvents = function()
{
    this.repository.stop();

    this.repository.off('room:open', this.applyScope);
    this.repository.off('room:close', this.applyScope);
    this.repository.off('room:players', this.applyScope);
    this.repository.off('room:game', this.applyScope);
};

/**
 * Create a room
 */
RoomsController.prototype.createRoom = function(e)
{
    if (this.$scope.roomName) {
        var $scope = this.$scope,
            controller = this;

        this.repository.create(this.$scope.roomName, this.onCreateRoom);
    }
};

/**
 * On create Room
 *
 * @param {Object} result
 */
RoomsController.prototype.onCreateRoom = function(result)
{
    if (result.success) {
        this.$scope.name = null;
        this.joinRoom(
            this.repository.createRoom(result.room)
        );
    } else {
        console.error('Could not create room %s', this.$scope.name);
    }
};

/**
 * Join a room
 */
RoomsController.prototype.joinRoom = function(room)
{
    this.$location.path(room.url);
    this.applyScope();
};

/**
 * Quick play
 */
RoomsController.prototype.quickPlay = function()
{
    var room = this.repository.rooms.filter(function () { return !this.game; }).getRandomItem();

    if (room) {
        this.joinRoom(room);
    } else {
        this.$scope.roomName = 'Hello Curvytron!';
        this.createRoom();
    }
};

/**
 * Apply scope
 */
RoomsController.prototype.applyScope = function()
{
    try {
        this.$scope.$apply();
    } catch (e) {

    }
};
