/**
 * Rooms Controller
 *
 * @param {Object} $scope
 * @param {Object} $location
 * @param {SocketClient} client
 */
function RoomsController($scope, $location, client)
{
    AbstractController.call(this, $scope);

    document.body.classList.remove('game-mode');

    this.$location  = $location;
    this.client     = client;
    this.repository = new RoomsRepository(this.client);

    // Binding:
    this.createRoom   = this.createRoom.bind(this);
    this.onCreateRoom = this.onCreateRoom.bind(this);
    this.joinRoom     = this.joinRoom.bind(this);
    this.quickPlay    = this.quickPlay.bind(this);
    this.detachEvents = this.detachEvents.bind(this);

    this.$scope.$on('$destroy', this.detachEvents);
    this.$location.search('password', null);

    // Hydrating the scope:
    this.$scope.rooms           = this.repository.rooms;
    this.$scope.createRoom      = this.createRoom;
    this.$scope.join            = this.joinRoom;
    this.$scope.quickPlay       = this.quickPlay;
    this.$scope.roomMaxLength   = Room.prototype.maxLength;
    this.$scope.roomName        = '';
    this.$scope.$parent.profile = true;

    this.attachEvents();
}

RoomsController.prototype = Object.create(AbstractController.prototype);
RoomsController.prototype.constructor = RoomsController;

/**
 * Attach Events
 */
RoomsController.prototype.attachEvents = function()
{
    this.repository.on('room:open', this.requestDigestScope);
    this.repository.on('room:close', this.requestDigestScope);
    this.repository.on('room:players', this.requestDigestScope);
    this.repository.on('room:game', this.requestDigestScope);
    this.repository.on('room:config:open', this.requestDigestScope);

    this.repository.start();
};

/**
 * Attach Events
 */
RoomsController.prototype.detachEvents = function()
{
    this.repository.stop();

    this.repository.off('room:open', this.requestDigestScope);
    this.repository.off('room:close', this.requestDigestScope);
    this.repository.off('room:players', this.requestDigestScope);
    this.repository.off('room:game', this.requestDigestScope);
    this.repository.off('room:config:open', this.requestDigestScope);
};

/**
 * Create a room
 */
RoomsController.prototype.createRoom = function(e)
{
    this.repository.create(this.$scope.roomName, this.onCreateRoom);
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
        this.joinRoom(this.repository.createRoom(result.room));
        this.applyScope();
    } else {
        console.error('Could not create room %s', this.$scope.name);
    }
};

/**
 * Join a room
 */
RoomsController.prototype.joinRoom = function(room)
{
    if (room.open) {
        this.$location.path(room.getUrl());
    } else if (room.password && room.password.match(new RegExp('[0-9]{4}'))) {
        this.$location.path(room.getUrl()).search('password', room.password);
    }
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
