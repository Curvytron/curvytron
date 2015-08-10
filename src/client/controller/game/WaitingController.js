/**
 * Waiting players connection controller
 *
 * @param {Object} $scope
 * @param {SocketClient} client
 */
function WaitingController($scope, client)
{
    if (!$scope.game) { return; }

    AbstractController.call(this, $scope);

    this.client = client;
    this.game   = $scope.game;

    // Binding
    this.onReady      = this.onReady.bind(this);
    this.onStart      = this.onStart.bind(this);
    this.detachEvents = this.detachEvents.bind(this);

    // Hydrate scope
    this.$scope.list = this.game.avatars.items.slice(0);

    this.$scope.$on('$destroy', this.onStart);

    this.attachEvents();
}

WaitingController.prototype = Object.create(AbstractController.prototype);
WaitingController.prototype.constructor = WaitingController;

/**
 * Attach socket Events
 */
WaitingController.prototype.attachEvents = function()
{
    this.client.on('ready', this.onReady);
};

/**
 * Attach socket Events
 */
WaitingController.prototype.detachEvents = function()
{
    this.client.off('ready', this.onReady);
};

/**
 * On avatar ready (client loaded)
 *
 * @param {Event} e
 */
WaitingController.prototype.onReady = function(e)
{
    var avatar = this.game.avatars.getById(e.detail),
        index  = this.$scope.list.indexOf(avatar);

    if (avatar && index) {
        this.$scope.list.splice(index, 1);
        this.digestScope();
    }
};

/**
 * On game start
 *
 * @param {Event} e
 */
WaitingController.prototype.onStart = function(e)
{
    this.$scope.list.length = 0;
    this.detachEvents();
};
