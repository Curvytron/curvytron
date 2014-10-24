/**
 * Room Controller
 *
 * @param {Object} $scope
 * @param {Object} $rootScope
 * @param {Object} $routeParams
 * @param {Object} $location
 * @param {RoomRepository} RoomRepository
 * @param {SocketClient} SocketClient
 * @param {Profuile} profile
 * @param {Chat} chat
 */
function RoomConfigController($scope)
{
    this.$scope         = $scope;

    // Binding:
    //this.addPlayer          = this.addPlayer.bind(this);

    // Hydrating scope:
    //this.$scope.submitAddPlayer     = this.addPlayer;
}

/**
 * Apply scope
 */
RoomConfigController.prototype.applyScope = function()
{
    try {
        this.$scope.$apply();
    } catch (e) {

    }
};
