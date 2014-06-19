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
    this.name       = $routeParams.name;

    console.log('on room %s', $routeParams.name);

    this.client.join('rooms');

    // Binding:
    this.createUser = this.createUser.bind(this);
    this.applyScope = this.applyScope.bind(this);
    this.loadRoom   = this.loadRoom.bind(this);
    this.setColor   = this.setColor.bind(this);
    this.setReady   = this.setReady.bind(this);
    this.start      = this.start.bind(this);

    //this.repository.on('room:close:' + this.name, this.loadRoom);
    this.repository.on('room:join:' + this.name, this.applyScope);
    this.repository.on('room:leave:' + this.name, this.applyScope);
    this.repository.on('room:player:ready:' + this.name, this.applyScope);
    this.repository.on('room:player:color:' + this.name, this.applyScope);
    this.repository.on('room:start:' + this.name, this.start);
    this.repository.on('room:game:' + this.name, this.startGame);

    // Hydrating scope:
    this.$scope.submit   = this.createUser;
    this.$scope.setColor = this.setColor;
    this.$scope.setReady = this.setReady;

    this.$scope.curvytron.bodyClass = null;

    if (this.repository.synced) {
        this.loadRoom();
    } else {
        this.repository.on('synced', this.loadRoom);
    }
}

/**
 * Load room into scope
 */
RoomController.prototype.loadRoom = function(e)
{
    var room = this.repository.get(this.name);

    if (room) {
        this.$scope.room = room;

        if (typeof(e) !== 'undefined') {
            this.applyScope();
        }
    } else {
        this.goHome();
    }
};

/**
 * Go back to the homepage
 */
RoomController.prototype.goHome = function()
{
    this.$location.path('/');
    //this.$rootScope.$apply();
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
                    $scope.username    = null;
                    $scope.hasUsername = true;
                    $scope.$apply();
                } else {
                    console.log('Error');
                }
            }
        );
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

    this.repository.setColor(
        this.$scope.room.name,
        this.$scope.color,
        function (result) {
            if (result.success) {
                console.log("setColor", result);
                //controller.loadRoom(true);
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
RoomController.prototype.setReady = function(name)
{
    var controller = this;

    this.repository.setReady(
        name,
        function (result) {
            if (result.success) {
                console.log("setReady", result);
                //controller.$scope.ready = result.ready; // A finir
                //controller.loadRoom(true);
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
    console.log("start", data);
    this.$location.path('/game/' + this.$scope.room.name);
    this.applyScope();
};

/**
 * Apply scope
 */
RoomController.prototype.applyScope = function()
{
    this.$scope.$apply();
};
