function RoomController($scope, $rootScope, $routeParams, $location, RoomRepository, SocketClient)
{
    this.$scope     = $scope;
    this.$rootScope = $rootScope;
    this.$location  = $location;
    this.repository = RoomRepository;
    this.client     = SocketClient;
    this.name       = $routeParams.name;

    this.client.join('rooms');

    this.createUser = this.createUser.bind(this);
    this.loadRoom   = this.loadRoom.bind(this);
    this.setColor   = this.setColor.bind(this);
    this.setReady   = this.setReady.bind(this);
    this.warmup     = this.warmup.bind(this);

    this.repository.on('room:close:' + this.name, this.loadRoom);
    this.repository.on('room:join:' + this.name, this.loadRoom);
    this.repository.on('room:leave:' + this.name, this.loadRoom);
    this.repository.on('room:player:ready:' + this.name, this.loadRoom);
    this.repository.on('room:player:color:' + this.name, this.loadRoom);
    this.repository.on('room:warmup:' + this.name, this.warmup);
    this.repository.on('room:game:' + this.name, this.startGame);

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
    this.$scope.room = this.repository.get(this.name).serialize();
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
RoomController.prototype.createUser = function(e)
{
    if (this.$scope.username) {
        var $scope = this.$scope;

        this.repository.join(this.name, $scope.username, function (result) {
            if (result.success) {
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

    this.repository.setColor(this.name, this.$scope.color, function (result) {
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

    this.repository.setReady(this.name, function (result) {
        if (result.success) {
            controller.$scope.ready = result.ready; // A finir
            controller.loadRoom(true);
        } else {
            console.log('Error');
        }
    });
};

/**
 * Start Game
 *
 * @param {Object} data
 */
RoomController.prototype.warmup = function(data)
{
    this.$location.path('/game/' + this.name);
    this.$rootScope.$apply();
};
