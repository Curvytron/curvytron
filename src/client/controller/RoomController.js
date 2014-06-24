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

    // Binding:
    this.addPlayer    = this.addPlayer.bind(this);
    this.applyScope   = this.applyScope.bind(this);
    this.onJoin       = this.onJoin.bind(this);
    this.joinRoom     = this.joinRoom.bind(this);
    this.leaveRoom    = this.leaveRoom.bind(this);
    this.setColor     = this.setColor.bind(this);
    this.setReady     = this.setReady.bind(this);
    this.start        = this.start.bind(this);

    this.$scope.$on('$destroy', this.leaveRoom);

    // Hydrating scope:
    this.$scope.submit   = this.addPlayer;
    this.$scope.setColor = this.setColor;
    this.$scope.setReady = this.setReady;

    this.$scope.curvytron.bodyClass = null;

    if (this.repository.synced) {
        this.joinRoom($routeParams.name);
    } else {
        var controller = this;

        this.repository.on('synced', function () { controller.joinRoom($routeParams.name); });
        this.repository.start();
    }
}

/**
 * Join room and load scope
 */
RoomController.prototype.joinRoom = function(name)
{
    var controller = this;

    this.repository.join(
        name,
        function (result) {
            if (result.success) {
                controller.$scope.room = controller.repository.get(name);
                controller.attachEvents(name);
            } else {
                console.log('Error');
                controller.goHome();
            }
            controller.applyScope();
        }
    );
};

/**
 * Leave room
 */
RoomController.prototype.leaveRoom = function()
{
    this.repository.leave();
    this.detachEvents();
};

/**
 * Attach Events
 *
 * @param {String} name
 */
RoomController.prototype.attachEvents = function(name)
{
    this.repository.on('room:close:' + name, this.goHome);
    this.repository.on('room:join:' + name, this.onJoin);
    this.repository.on('room:leave:' + name, this.applyScope);
    this.repository.on('room:player:ready:' + name, this.applyScope);
    this.repository.on('room:player:color:' + name, this.applyScope);
    this.repository.on('room:game:start:' + name, this.start);
};

/**
 * Attach Events
 *
 * @param {String} name
 */
RoomController.prototype.detachEvents = function(name)
{
    this.repository.on('room:close:' + name, this.goHome);
    this.repository.on('room:join:' + name, this.onJoin);
    this.repository.on('room:leave:' + name, this.applyScope);
    this.repository.on('room:player:ready:' + name, this.applyScope);
    this.repository.on('room:player:color:' + name, this.applyScope);
    this.repository.on('room:game:start:' + name, this.start);
};

/**
 * Go back to the homepage
 */
RoomController.prototype.goHome = function()
{
    this.$location.path('/');
};

/**
 * Add player
 */
RoomController.prototype.addPlayer = function()
{
    var $scope = this.$scope;

    if ($scope.username) {
        this.repository.addPlayer(
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
        player.on('control:change', this.applyScope);
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

    this.repository.setColor(
        this.$scope.room.name,
        player.name,
        player.color,
        function (result) {
            if (!result.success) {
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
    if (!player.local) {
        return;
    }

    this.repository.setReady(
        this.$scope.room.name,
        player.name,
        function (result) {
            if (!result.success) {
                console.log('Error');
            }
        }
    );
};

/**
 * Start Game
 *
 * @param {Event} e
 */
RoomController.prototype.start = function(e)
{
    this.repository.stop();
    this.$location.path('/game/' + e.detail.room.name);
    this.applyScope();
};

/**
 * Apply scope
 */
RoomController.prototype.applyScope = function()
{
    if (typeof(this.$scope.$root.$$phase) === 'undefined' || this.$scope.$root.$$phase !== '$apply') {
        this.$scope.$apply();
    }
};
