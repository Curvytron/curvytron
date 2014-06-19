/**
 * Room Controller
 *
 * @param {Object} $scope
 * @param {Object} $rootScope
 * @param {Object} $routeParams
 * @param {Object} $location
 * @param {RoomRepository} RoomRepository
 * @param {SocketClient} SocketClient
 */
function RoomController($scope, $rootScope, $routeParams, $location, repository, client)
{
    this.$scope     = $scope;
    this.$rootScope = $rootScope;
    this.$location  = $location;
    this.repository = repository;
    this.client     = client;

    console.log('on room %s', $routeParams.name);

    this.client.join('rooms');

    // Binding:
    this.createUser = this.createUser.bind(this);
    this.applyScope = this.applyScope.bind(this);
    this.onJoin     = this.onJoin.bind(this);
    this.loadRoom   = this.loadRoom.bind(this);
    this.setColor   = this.setColor.bind(this);
    this.setReady   = this.setReady.bind(this);
    this.start      = this.start.bind(this);

    // Hydrating scope:
    this.$scope.submit   = this.createUser;
    this.$scope.setColor = this.setColor;
    this.$scope.setReady = this.setReady;

    this.$scope.curvytron.bodyClass = null;

    if (this.repository.synced) {
        this.loadRoom($routeParams.name);
    } else {
        var controller = this;

        this.repository.on('synced', function () { controller.loadRoom($routeParams.name); });
    }
}

/**
 * Load room into scope
 */
RoomController.prototype.loadRoom = function(name)
{
    var room = this.repository.get(name);

    if (room) {
        this.$scope.room = room;

        this.attachEvents(name);

        if (typeof(e) !== 'undefined') {
            this.applyScope();
        }
    } else {
        this.goHome();
    }
};

/**
 * Attach Events
 *
 * @param {String} name
 */
RoomController.prototype.attachEvents = function(name)
{
    //this.repository.on('room:close:' + name, this.loadRoom);
    this.repository.on('room:join:' + name, this.onJoin);
    this.repository.on('room:leave:' + name, this.applyScope);
    this.repository.on('room:player:ready:' + name, this.applyScope);
    this.repository.on('room:player:color:' + name, this.applyScope);
    this.repository.on('room:start:' + name, this.start);
    this.repository.on('room:game:' + name, this.startGame);
};

/**
 * Go back to the homepage
 */
RoomController.prototype.goHome = function()
{
    this.$location.path('/');
};

/**
 * Rooms action
 *
 * @return {Array}
 */
RoomController.prototype.createUser = function(e)
{
    var $scope = this.$scope;

    if ($scope.username) {
        this.repository.join(
            $scope.room.name,
            $scope.username,
            function (result) {
                if (result.success) {
                    $scope.username = null;
                    $scope.$apply();
                } else {
                    console.log('Error');
                }
            }
        );
    }
};

/**
 * On join
 *
 * @param {Event} event
 */
RoomController.prototype.onJoin = function(event)
{
    var player = event.detail.player;

    if (player.client === this.client.id) {
        player.setLocal(true);
    }

    this.applyScope();
};

/**
 * Rooms action
 *
 * @return {Array}
 */
RoomController.prototype.setColor = function(player)
{
    if (!player.local) {
        return;
    }

    var controller = this;

    this.repository.setColor(
        this.$scope.room.name,
        player.name,
        player.color,
        function (result) {
            if (result.success) {
                //console.log("setColor", result);
            } else {
                console.log('Error');
            }
        }
    );
};

/**
 * Rooms action
 *
 * @return {Array}
 */
RoomController.prototype.setReady = function(player)
{
    console.log('setReady', player.name, player.local);
    if (!player.local) {
        return;
    }

    var controller = this;

    this.repository.setReady(
        this.$scope.room.name,
        player.name,
        function (result) {
            if (result.success) {
                //console.log("setReady", result);
            } else {
                console.log('Error');
            }
        }
    );
};

/**
 * Start Game
 *
 * @param {Object} data
 */
RoomController.prototype.start = function(data)
{
    this.$location.path('/game/' + this.$scope.room.name);
};

/**
 * Apply scope
 */
RoomController.prototype.applyScope = function()
{
    this.$scope.$apply();
};
